import { Response, Router } from "express";
import { Logger } from "tslog";
import {AppRouter} from "@models";
import { ProjectService } from "src/services/project.service";
import { ProjectModel } from '@models';
import { auth } from "../middleware/authentication";
import { requireProjectAdmin, requireProjectMember, getUserId } from "../middleware/authorization";
import { canAccessProject, canManageProject } from "@controllers";

const log: Logger = new Logger();
const projectRouter: Router = Router();
const projectService: ProjectService = new ProjectService();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management endpoints
 */

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: Project created successfully
 *       500:
 *         description: Internal server error
 */

/**
 * POST /projects
 * Create a new project (any authenticated user can create)
 * Creator automatically becomes admin member
 */
projectRouter.post('/', auth, async (req: any, res: Response) => {
  log.info("/create project: post route");
  try {
    const userId = getUserId(req);
    const project: ProjectModel = req.body.data;
    log.info(`post: Project to create ${JSON.stringify(project)} for user ${userId}`);
    const projectDetails = await projectService.createProject(project, userId);
    log.info(`post: Project created successfully! ${projectDetails}`);
    res.send(projectDetails);
  } catch(e) {
    log.error(`post: Failed to create project - ${e}`);
    res.status(500).send(e);
  }
});

/**
 * @swagger
 * /projects/{id}:
 *   patch:
 *     summary: Update a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: Project updated
 *       404:
 *         description: Project not found
 */

/**
 * PATCH /projects/:id
 * Update a project
 * Requires: project admin or superuser
 */
projectRouter.patch('/:id', auth, requireProjectAdmin(), async (req: any, res: Response) => {
  log.info(`Update project`);
  try {
    const project: ProjectModel = req.body;
    const {id} = req.params;
    log.info(`patch: Updating project ${id} with data: ${JSON.stringify(project)}`);
    const updatedProject = await projectService.updateProject(project, id);
    if (!updatedProject) {
      log.warn(`patch: Project ${id} not found`);
      return res.status(404).send({ success: false, error: 'Project not found' });
    }
    log.info(`patch: Project updated successfully! ${JSON.stringify(updatedProject)}`);
    res.send({ success: true, project: updatedProject });
  } catch(e) {
    log.error(`patch: Failed to update project - ${e}`);
    res.status(500).send({ success: false, error: e });
  }
});

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get a project by ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 project:
 *                   $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 */

/**
 * GET /projects/:id
 * Get a single project
 * Requires: project member or superuser
 */
projectRouter.get('/:id', auth, requireProjectMember(), (req: any, res: Response) => {
  const {id} = req.params;
  log.info(`GET /projects/${id} - Fetching project by id`);
  projectService.getProjectByParams({ _id: id }, (err, project) => {
    if (err) {
      log.error(`GET /projects/${id} - Error: ${err}`);
      res.send({ success: false, error: err});
    }
    else {
      log.info(`GET /projects/${id} - Project retrieved successfully`);
      res.send({ success: true, project: project[0] || null});
    }
  });
});

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects for current user
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 projects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 */

/**
 * GET /projects
 * List all projects the user has access to
 */
projectRouter.get('/', auth, async (req: any, res: Response) => {
  const userId = getUserId(req);
  log.info(`GET /projects - Fetching projects for user ${userId}`);
  try {
    const projects = await projectService.getProjects(userId);
    log.info(`GET /projects - Projects retrieved successfully for user ${userId}`);
    res.send({ success: true, projects});
  } catch (err) {
    log.error(`GET /projects - Error: ${err}`);
    res.send({ success: false, error: err});
  }
});

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project deleted
 *       404:
 *         description: Project not found
 */

/**
 * DELETE /projects/:id
 * Delete a project
 * Requires: project admin or superuser
 */
projectRouter.delete('/:id', auth, requireProjectAdmin(), async (req: any, res: Response) => {
  const {id} = req.params;
  log.info(`DELETE /projects/${id} - Deleting project`);
  try {
    const project = await projectService.deleteProject(id);
    if (!project) {
      log.warn(`DELETE /projects/${id} - Project not found`);
      return res.status(404).send({ success: false, error: 'Project not found' });
    }
    log.info(`DELETE /projects/${id} - Project deleted successfully`);
    res.send({ success: true, project});
  } catch(e) {
    log.error(`DELETE /projects/${id} - Exception: ${e}`);
    res.status(500).send({ success: false, error: e });
  }
});

/**
 * POST /projects/:id/tasks/:taskId
 * Add task to project
 * Requires: project member or superuser
 */
projectRouter.post('/:id/tasks/:taskId', auth, requireProjectMember(), async (req: any, res: Response) => {
  const {id, taskId} = req.params;
  log.info(`POST /projects/${id}/tasks/${taskId} - Adding task to project`);
  try {
    const updatedProject = await projectService.addTaskToProject(id, taskId);
    if (!updatedProject) {
      log.warn(`POST /projects/${id}/tasks/${taskId} - Project not found`);
      return res.status(404).send({ success: false, error: 'Project not found' });
    }
    log.info(`POST /projects/${id}/tasks/${taskId} - Task added successfully`);
    res.send({ success: true, project: updatedProject });
  } catch(e) {
    log.error(`POST /projects/${id}/tasks/${taskId} - Exception: ${e}`);
    res.status(500).send({ success: false, error: e });
  }
});

/**
 * DELETE /projects/:id/tasks/:taskId
 * Remove task from project
 * Requires: project member or superuser
 */
projectRouter.delete('/:id/tasks/:taskId', auth, requireProjectMember(), async (req: any, res: Response) => {
  const {id, taskId} = req.params;
  log.info(`DELETE /projects/${id}/tasks/${taskId} - Removing task from project`);
  try {
    const updatedProject = await projectService.removeTaskFromProject(id, taskId);
    if (!updatedProject) {
      log.warn(`DELETE /projects/${id}/tasks/${taskId} - Project not found`);
      return res.status(404).send({ success: false, error: 'Project not found' });
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
