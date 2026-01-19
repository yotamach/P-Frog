import {Logger} from "tslog";
import {ProjectModel } from "@models";
import { CallbackError } from "mongoose";
import { IProject, Project } from "@schemas";

const log: Logger = new Logger();

export class ProjectService {

  getProjects(userId: string, callback: (err: CallbackError, projects: IProject[]) => void) {
    log.info(`projectService.getProjects: find projects for user ${userId}`);
    return Project.find({ created_by: userId }).populate('tasks').exec(callback);
  }

  getProjectByParams(params: any, callback: (err: CallbackError, projects: IProject[]) => void) {
    log.info(`projectService.getProjectByParams: find project with params ${JSON.stringify(params)}`);
    return Project.find(params).populate('tasks').exec(callback);
  }

  createProject(project: ProjectModel): Promise<IProject> {
    log.info(`projectService.createProject: create project`);
    return Project.create({
      ...project,
      owner: project.created_by
    });
  }

  updateProject(project: ProjectModel, id: string, userId: string): Promise<IProject> {
    log.info(`projectService.updateProject: findByIdAndUpdate project ${id} for user ${userId}`);
    return Project.findOneAndUpdate(
      { _id: id, created_by: userId },
      {...project},
      {new: true}
    ).populate('tasks').exec();
  }

  deleteProject(id: string, userId: string, callback: (err: CallbackError, project: IProject) => void) {
    log.info(`projectService.deleteProject: findOneAndDelete project ${id} for user ${userId}`);
    return Project.findOneAndDelete({ _id: id, created_by: userId }, callback);
  }

  addTaskToProject(projectId: string, taskId: string, userId: string): Promise<IProject> {
    log.info(`projectService.addTaskToProject: add task ${taskId} to project ${projectId}`);
    return Project.findOneAndUpdate(
      { _id: projectId, created_by: userId },
      { $addToSet: { tasks: taskId } },
      { new: true }
    ).populate('tasks').exec();
  }

  removeTaskFromProject(projectId: string, taskId: string, userId: string): Promise<IProject> {
    log.info(`projectService.removeTaskFromProject: remove task ${taskId} from project ${projectId}`);
    return Project.findOneAndUpdate(
      { _id: projectId, created_by: userId },
      { $pull: { tasks: taskId } },
      { new: true }
    ).populate('tasks').exec();
  }
}
