import {Logger} from "tslog";
import {TaskModel } from "@models";
import { CallbackError, Types } from "mongoose";
import { ITask, Task, ProjectMember } from "@schemas";
import { isSuperuser } from "./permission.service";

const log = new Logger({});

export class TaskService {

  /**
   * Get all tasks the user has access to:
   * - Tasks created by the user
   * - Tasks assigned to the user
   * - Tasks in projects the user is a member of
   * - All tasks if superuser
   */
  async getTasks(userId: string): Promise<ITask[]> {
    log.info(`taskService.getTasks: find tasks for user ${userId}`);
    
    // Check if superuser - they can see all tasks
    const superuser = await isSuperuser(userId);
    if (superuser) {
      log.info(`taskService.getTasks: user ${userId} is superuser, returning all tasks`);
      return Task.find({}).populate('project').populate('assignee', 'id userName firstName lastName').exec();
    }
    
    // Get project IDs where user is a member
    const memberships = await ProjectMember.find({ user: userId });
    const projectIds = memberships.map(m => m.project);
    
    // Find tasks where:
    // - user is the creator, OR
    // - user is the assignee, OR
    // - task belongs to a project the user is a member of
    return Task.find({
      $or: [
        { created_by: userId },
        { assignee: userId },
        { project: { $in: projectIds } }
      ]
    }).populate('project').populate('assignee', 'id userName firstName lastName').exec();
  }

  /**
   * Get a single task by ID
   */
  async getTaskById(taskId: string): Promise<ITask | null> {
    log.info(`taskService.getTaskById: find task ${taskId}`);
    return Task.findById(taskId)
      .populate('project')
      .populate('assignee', 'id userName firstName lastName')
      .exec();
  }

  async getTaskByParams(params: any): Promise<ITask[]> {
    log.info(`taskService.getTaskByParams: find task with params ${JSON.stringify(params)}`);
    return Task.find(params)
      .populate('project')
      .populate('assignee', 'id userName firstName lastName')
      .exec();
  }

  createTask(task: TaskModel, creatorId: string): Promise<ITask> {
    log.info(`taskService.createTask: create task for user ${creatorId}`);
    return Task.create({
      ...task,
      created_by: creatorId
    }).then(createdTask => 
      Task.findById(createdTask._id)
        .populate('project')
        .populate('assignee', 'id userName firstName lastName')
        .exec()
    );
  }

  /**
   * Update a task (authorization should be checked before calling this)
   */
  async updateTask(task: TaskModel, id: string): Promise<ITask | null> {
    log.info(`taskService.updateTask: findByIdAndUpdate task ${id}`);
    return Task.findByIdAndUpdate(
      id,
      {...task},
      {new: true}
    ).populate('project').populate('assignee', 'id userName firstName lastName').exec();
  }

  /**
   * Delete a task (authorization should be checked before calling this)
   */
  async deleteTask(id: string): Promise<ITask | null> {
    log.info(`taskService.deleteTask: findByIdAndDelete task ${id}`);
    return Task.findByIdAndDelete(id);
  }

  /**
   * Assign a task to a user
   */
  async assignTask(taskId: string, assigneeId: string | null): Promise<ITask | null> {
    log.info(`taskService.assignTask: assigning task ${taskId} to user ${assigneeId}`);
    return Task.findByIdAndUpdate(
      taskId,
      { assignee: assigneeId },
      { new: true }
    ).populate('project').populate('assignee', 'id userName firstName lastName').exec();
  }

  /**
   * Get tasks by project ID
   */
  async getTasksByProject(projectId: string): Promise<ITask[]> {
    log.info(`taskService.getTasksByProject: find tasks for project ${projectId}`);
    return Task.find({ project: projectId })
      .populate('assignee', 'id userName firstName lastName')
      .exec();
  }
}
