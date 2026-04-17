import {Logger} from "tslog";
import {ProjectModel } from "@models";
import { IProject, Project, ProjectMember, ProjectRole } from "@schemas";
import { isSuperuser } from "./permission.service";

const log = new Logger({});

export class ProjectService {

  /**
   * Get all projects the user has access to (via membership or superuser)
   */
  async getProjects(userId: string): Promise<IProject[]> {
    log.info(`projectService.getProjects: find projects for user ${userId}`);
    
    // Check if superuser - they can see all projects
    const superuser = await isSuperuser(userId);
    if (superuser) {
      log.info(`projectService.getProjects: user ${userId} is superuser, returning all projects`);
      return Project.find({}).populate('tasks').exec();
    }
    
    // Get projects where user is a member
    const memberships = await ProjectMember.find({ user: userId });
    const projectIds = memberships.map(m => m.project);
    
    return Project.find({ _id: { $in: projectIds } }).populate('tasks').exec();
  }

  async getProjectByParams(params: any): Promise<IProject[]> {
    log.info(`projectService.getProjectByParams: find project with params ${JSON.stringify(params)}`);
    return Project.find(params).populate('tasks').exec();
  }

  /**
   * Get a single project by ID
   */
  async getProjectById(projectId: string): Promise<IProject | null> {
    log.info(`projectService.getProjectById: find project ${projectId}`);
    return Project.findById(projectId).populate('tasks').exec();
  }

  /**
   * Create a new project and add the creator as admin member
   */
  async createProject(project: ProjectModel, creatorId: string): Promise<IProject> {
    log.info(`projectService.createProject: create project for user ${creatorId}`);
    
    // Create the project
    const newProject = await Project.create({
      ...project,
      created_by: creatorId
    });
    
    // Add creator as admin member
    await ProjectMember.create({
      project: newProject._id,
      user: creatorId,
      role: ProjectRole.ADMIN
    });
    
    log.info(`projectService.createProject: created project ${newProject._id} with creator ${creatorId} as admin`);
    
    return newProject;
  }

  /**
   * Update a project (authorization should be checked before calling this)
   */
  async updateProject(project: ProjectModel, id: string): Promise<IProject | null> {
    log.info(`projectService.updateProject: findByIdAndUpdate project ${id}`);
    return Project.findByIdAndUpdate(
      id,
      {...project},
      {new: true}
    ).populate('tasks').exec();
  }

  /**
   * Delete a project and all its memberships (authorization should be checked before calling this)
   */
  async deleteProject(id: string): Promise<IProject | null> {
    log.info(`projectService.deleteProject: deleting project ${id} and its memberships`);
    
    // Delete all memberships for this project
    await ProjectMember.deleteMany({ project: id });
    
    // Delete the project
    return Project.findByIdAndDelete(id);
  }

  addTaskToProject(projectId: string, taskId: string): Promise<IProject> {
    log.info(`projectService.addTaskToProject: add task ${taskId} to project ${projectId}`);
    return Project.findByIdAndUpdate(
      projectId,
      { $addToSet: { tasks: taskId } },
      { new: true }
    ).populate('tasks').exec();
  }

  removeTaskFromProject(projectId: string, taskId: string): Promise<IProject> {
    log.info(`projectService.removeTaskFromProject: remove task ${taskId} from project ${projectId}`);
    return Project.findByIdAndUpdate(
      projectId,
      { $pull: { tasks: taskId } },
      { new: true }
    ).populate('tasks').exec();
  }
}
