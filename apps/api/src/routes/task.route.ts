import { Response, Router } from "express";
import { Logger } from "tslog";
import {AppRouter} from "@models";
import { TaskService } from "src/services/task.service";
import { TaskModel } from '@models';
import { auth } from "../middleware/authentication";
import { getUserId } from "../middleware/authorization";
import { canModifyTask, canCreateTaskInProject, canAssignTask, canAccessProject, isProjectMember } from "@controllers";

const log: Logger = new Logger();
const taskRouter: Router = Router();
const taskService: TaskService = new TaskService();

/**
 * POST /tasks
 * Create a new task
 * - Anyone can create standalone tasks (no project)
 * - Must be project member to create tasks in a project
 */
taskRouter.post('/', auth, async (req: any, res: Response) => {
  log.info("/create task: post route");
  try {
    const userId = getUserId(req);
    const task: TaskModel = req.body.data;
    
    // Check permission to create task in project
    const canCreate = await canCreateTaskInProject(userId, task.project as string || null);
    if (!canCreate) {
      log.warn(`POST /tasks - User ${userId} cannot create task in project ${task.project}`);
      return res.status(403).send({ success: false, error: 'You must be a member of the project to create tasks in it' });
    }
    
    log.info(`post: Task to create ${JSON.stringify(task)} for user ${userId}`);
    const taskDetails = await taskService.createTask(task, userId);
    log.info(`post: Task created successfully! ${taskDetails}`);
    res.send(taskDetails);
  } catch(e) {
    log.error(`post: Failed to create task - ${e}`);
    res.status(500).send(e);
  }
});

/**
 * PATCH /tasks/:id
 * Update a task
 * Allowed for:
 * - Task creator
 * - Task assignee
 * - Project admin (if task has a project)
 * - Superuser
 */
taskRouter.patch('/:id', auth, async (req: any, res: Response) => {
  log.info(`Update task`);
  try {
    const task: TaskModel = req.body;
    const {id} = req.params;
    const userId = getUserId(req);
    
    // Get existing task to check authorization
    const existingTask = await taskService.getTaskById(id);
    if (!existingTask) {
      return res.status(404).send({ success: false, error: 'Task not found' });
    }
    
    // Check permission to modify task
    const canModify = await canModifyTask(
      userId,
      existingTask.created_by?.toString(),
      existingTask.assignee?.toString() || null,
      existingTask.project?.toString() || null
    );
    
    if (!canModify) {
      log.warn(`PATCH /tasks/${id} - User ${userId} not authorized to modify task`);
      return res.status(403).send({ success: false, error: 'Not authorized to modify this task' });
    }
    
    log.info(`patch: Updating task ${id} for user ${userId} with data: ${JSON.stringify(task)}`);
    const updatedTask = await taskService.updateTask(task, id);
    if (!updatedTask) {
      log.warn(`patch: Task ${id} not found`);
      return res.status(404).send({ success: false, error: 'Task not found' });
    }
    log.info(`patch: Task updated successfully! ${JSON.stringify(updatedTask)}`);
    res.send({ success: true, task: updatedTask });
  } catch(e) {
    log.error(`patch: Failed to update task - ${e}`);
    res.status(500).send({ success: false, error: e });
  }
});

/**
 * PATCH /tasks/:id/assign
 * Assign a task to a user
 * Only project admins and superusers can assign tasks
 */
taskRouter.patch('/:id/assign', auth, async (req: any, res: Response) => {
  const {id} = req.params;
  const { assigneeId } = req.body; // null to unassign
  const userId = getUserId(req);
  
  log.info(`PATCH /tasks/${id}/assign - Assigning to ${assigneeId}`);
  
  try {
    // Get existing task
    const existingTask = await taskService.getTaskById(id);
    if (!existingTask) {
      return res.status(404).send({ success: false, error: 'Task not found' });
    }
    
    const projectId = existingTask.project?.toString() || null;
    
    // Check permission to assign
    const canAssign = await canAssignTask(userId, projectId);
    if (!canAssign) {
      // Allow task creator to assign their own standalone tasks
      if (!projectId && existingTask.created_by?.toString() === userId) {
        // OK - creator can assign their own standalone task
      } else {
        log.warn(`PATCH /tasks/${id}/assign - User ${userId} not authorized to assign task`);
        return res.status(403).send({ success: false, error: 'Only project admins can assign tasks' });
      }
    }
    
    // If assigning to someone, verify they are a project member (if task has project)
    if (assigneeId && projectId) {
      const isMember = await isProjectMember(assigneeId, projectId);
      if (!isMember) {
        return res.status(400).send({ success: false, error: 'Assignee must be a project member' });
      }
    }
    
    const updatedTask = await taskService.assignTask(id, assigneeId);
    log.info(`PATCH /tasks/${id}/assign - Task assigned successfully`);
    res.send({ success: true, task: updatedTask });
  } catch(e) {
    log.error(`PATCH /tasks/${id}/assign - Error: ${e}`);
    res.status(500).send({ success: false, error: e.message });
  }
});

/**
 * GET /tasks/:id
 * Get a single task
 * Allowed for users who have access (via ownership, assignment, or project membership)
 */
taskRouter.get('/:id', auth, async (req: any, res: Response) => {
  const {id} = req.params;
  const userId = getUserId(req);
  log.info(`GET /tasks/${id} - Fetching task by id for user ${userId}`);
  
  try {
    const task = await taskService.getTaskById(id);
    if (!task) {
      return res.status(404).send({ success: false, error: 'Task not found' });
    }
    
    // Check if user has access
    const isCreator = task.created_by?.toString() === userId;
    const isAssignee = task.assignee?.toString() === userId;
    const projectId = task.project?.toString();
    const hasProjectAccess = projectId ? await canAccessProject(userId, projectId) : false;
    
    if (!isCreator && !isAssignee && !hasProjectAccess) {
      log.warn(`GET /tasks/${id} - User ${userId} not authorized to view task`);
      return res.status(403).send({ success: false, error: 'Not authorized to view this task' });
    }
    
    log.info(`GET /tasks/${id} - Task retrieved successfully`);
    res.send({ success: true, task });
  } catch(e) {
    log.error(`GET /tasks/${id} - Error: ${e}`);
    res.status(500).send({ success: false, error: e.message });
  }
});

/**
 * GET /tasks
 * List all tasks the user has access to
 */
taskRouter.get('/', auth, async (req: any, res: Response) => {
  const userId = getUserId(req);
  log.info(`GET /tasks - Fetching tasks for user ${userId}`);
  try {
    const tasks = await taskService.getTasks(userId);
    log.info(`GET /tasks - Tasks retrieved successfully for user ${userId}`);
    res.send({ success: true, tasks });
  } catch(e) {
    log.error(`GET /tasks - Error: ${e}`);
    res.send({ success: false, error: e.message });
  }
});

/**
 * DELETE /tasks/:id
 * Delete a task
 * Allowed for:
 * - Task creator
 * - Project admin (if task has a project)
 * - Superuser
 */
taskRouter.delete('/:id', auth, async (req: any, res: Response) => {
  const {id} = req.params;
  const userId = getUserId(req);
  log.info(`DELETE /tasks/${id} - Deleting task for user ${userId}`);
  
  try {
    // Get existing task to check authorization
    const existingTask = await taskService.getTaskById(id);
    if (!existingTask) {
      return res.status(404).send({ success: false, error: 'Task not found' });
    }
    
    // Check permission to delete (same as modify, but we might want stricter later)
    const canDelete = await canModifyTask(
      userId,
      existingTask.created_by?.toString(),
      null, // assignee cannot delete, only creator/admin/superuser
      existingTask.project?.toString() || null
    );
    
    if (!canDelete) {
      log.warn(`DELETE /tasks/${id} - User ${userId} not authorized to delete task`);
      return res.status(403).send({ success: false, error: 'Not authorized to delete this task' });
    }
    
    const task = await taskService.deleteTask(id);
    log.info(`DELETE /tasks/${id} - Task deleted successfully`);
    res.send({ success: true, task });
  } catch(e) {
    log.error(`DELETE /tasks/${id} - Exception: ${e}`);
    res.status(500).send({ success: false, error: e.message });
  }
});

const taskRoutes : AppRouter = { url: '/tasks', router: taskRouter};

export default taskRoutes;
