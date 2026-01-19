import { Response, Router } from "express";
import { Logger } from "tslog";
import {AppRouter} from "@models";
import { ProjectService } from "src/services/project.service";
import { ProjectModel } from '@models';
import { auth } from "../middleware/authentication";

const log: Logger = new Logger();
const projectRouter: Router = Router();
const projectService: ProjectService = new ProjectService();

projectRouter.post('/', auth, async (req: any, res: Response) => {
  log.info("/create project: post route");
  try {
    const project: ProjectModel = { 
      ...req.body.data,
      created_by: req.user.user_id || req.user.id
    };
    log.info(`post: Project to create ${JSON.stringify(project)}`);
    const projectDetails = await projectService.createProject(project);
    log.info(`post: Project created successfully! ${projectDetails}`);
    res.send(projectDetails);
  } catch(e) {
    log.error(`post: Failed to create project - ${e}`);
    res.status(500).send(e);
  }
});

projectRouter.patch('/:id', auth, async (req: any, res: Response) => {
  log.info(`Update project`);
  try {
    const project: ProjectModel = req.body;
    const {id} = req.params;
    const userId = req.user.user_id || req.user.id;
    log.info(`patch: Updating project ${id} for user ${userId} with data: ${JSON.stringify(project)}`);
    const updatedProject = await projectService.updateProject(project, id, userId);
    if (!updatedProject) {
      log.warn(`patch: Project ${id} not found or user ${userId} is not the owner`);
      return res.status(404).send({ success: false, error: 'Project not found or unauthorized' });
    }
    log.info(`patch: Project updated successfully! ${JSON.stringify(updatedProject)}`);
    res.send({ success: true, project: updatedProject });
  } catch(e) {
    log.error(`patch: Failed to update project - ${e}`);
    res.status(500).send({ success: false, error: e });
  }
});

projectRouter.get('/:id', auth, (req: any, res: Response) => {
  const {id} = req.params;
  const userId = req.user.user_id || req.user.id;
  log.info(`GET /projects/${id} - Fetching project by id for user ${userId}`);
  projectService.getProjectByParams({ _id: id, created_by: userId }, (err, project) => {
    if (err) {
      log.error(`GET /projects/${id} - Error: ${err}`);
      res.send({ success: false, error: err});
    }
    else {
      log.info(`GET /projects/${id} - Project retrieved successfully`);
      res.send({ success: true, project});
    }
  });
});

projectRouter.get('/', auth, (req: any, res: Response) => {
  const userId = req.user.user_id || req.user.id;
  log.info(`GET /projects - Fetching projects for user ${userId}`);
  projectService.getProjects(userId, (err, projects) => {
    if (err) {
      log.error(`GET /projects - Error: ${err}`);
      res.send({ success: false, error: err});
    }
    else {
      log.info(`GET /projects - Projects retrieved successfully for user ${userId}`);
      res.send({ success: true, projects});
    }
  });
});

projectRouter.delete('/:id', auth, (req: any, res: Response) => {
  const {id} = req.params;
  const userId = req.user.user_id || req.user.id;
  log.info(`DELETE /projects/${id} - Deleting project for user ${userId}`);
  try{
    projectService.deleteProject(id, userId, (err, project) => {
      if (err) {
        log.error(`DELETE /projects/${id} - Error: ${err}`);
        res.status(404).send({ success: false, error: err});
      }
      else if (!project) {
        log.warn(`DELETE /projects/${id} - Project not found or user ${userId} is not the owner`);
        res.status(404).send({ success: false, error: 'Project not found or unauthorized' });
      }
      else {
        log.info(`DELETE /projects/${id} - Project deleted successfully`);
        res.send({ success: true, project});
      }
    });
  }
  catch(e) {
    log.error(`DELETE /projects/${id} - Exception: ${e}`);
    res.status(500).send(e);
  }
});

// Add task to project
projectRouter.post('/:id/tasks/:taskId', auth, async (req: any, res: Response) => {
  const {id, taskId} = req.params;
  const userId = req.user.user_id || req.user.id;
  log.info(`POST /projects/${id}/tasks/${taskId} - Adding task to project for user ${userId}`);
  try {
    const updatedProject = await projectService.addTaskToProject(id, taskId, userId);
    if (!updatedProject) {
      log.warn(`POST /projects/${id}/tasks/${taskId} - Project not found or unauthorized`);
      return res.status(404).send({ success: false, error: 'Project not found or unauthorized' });
    }
    log.info(`POST /projects/${id}/tasks/${taskId} - Task added successfully`);
    res.send({ success: true, project: updatedProject });
  } catch(e) {
    log.error(`POST /projects/${id}/tasks/${taskId} - Exception: ${e}`);
    res.status(500).send({ success: false, error: e });
  }
});

// Remove task from project
projectRouter.delete('/:id/tasks/:taskId', auth, async (req: any, res: Response) => {
  const {id, taskId} = req.params;
  const userId = req.user.user_id || req.user.id;
  log.info(`DELETE /projects/${id}/tasks/${taskId} - Removing task from project for user ${userId}`);
  try {
    const updatedProject = await projectService.removeTaskFromProject(id, taskId, userId);
    if (!updatedProject) {
      log.warn(`DELETE /projects/${id}/tasks/${taskId} - Project not found or unauthorized`);
      return res.status(404).send({ success: false, error: 'Project not found or unauthorized' });
    }
    log.info(`DELETE /projects/${id}/tasks/${taskId} - Task removed successfully`);
    res.send({ success: true, project: updatedProject });
  } catch(e) {
    log.error(`DELETE /projects/${id}/tasks/${taskId} - Exception: ${e}`);
    res.status(500).send({ success: false, error: e });
  }
});

const projectRoutes : AppRouter = { url: '/projects', router: projectRouter};

export default projectRoutes;
