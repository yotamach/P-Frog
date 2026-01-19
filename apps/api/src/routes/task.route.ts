import { Response, Router } from "express";
import { Logger } from "tslog";
import {AppRouter} from "@models";
import { TaskService } from "src/services/task.service";
import { TaskModel } from '@models';
import { auth } from "../middleware/authentication";

const log: Logger = new Logger();
const taskRouter: Router = Router();
const taskService: TaskService = new TaskService();

taskRouter.post('/', auth, async (req: any, res: Response) => {
  log.info("/create task: post route");
  try {
    const task: TaskModel = { 
      ...req.body.data,
      created_by: req.user.user_id || req.user.id
    };
    log.info(`post: Task to create ${JSON.stringify(task)}`);
    const taskDetails = await taskService.createTask(task);
    log.info(`post: Task created succsfully! ${taskDetails}`);
    res.send(taskDetails);
  } catch(e) {
    log.error(`post: Failed to create task - ${e}`);
    res.status(500).send(e);
  }
});

taskRouter.patch('/:id', auth, async (req: any, res: Response) => {
  log.info(`Update task`);
  try {
    const task: TaskModel = req.body;
    const {id} = req.params;
    const userId = req.user.user_id || req.user.id;
    log.info(`patch: Updating task ${id} for user ${userId} with data: ${JSON.stringify(task)}`);
    const updatedTask = await taskService.updateTask(task, id, userId);
    if (!updatedTask) {
      log.warn(`patch: Task ${id} not found or user ${userId} is not the owner`);
      return res.status(404).send({ success: false, error: 'Task not found or unauthorized' });
    }
    log.info(`patch: Task updated successfully! ${JSON.stringify(updatedTask)}`);
    res.send({ success: true, task: updatedTask });
  } catch(e) {
    log.error(`patch: Failed to update task - ${e}`);
    res.status(500).send({ success: false, error: e });
  }
});

taskRouter.get('/:id', auth, (req: any, res: Response) => {
  const {id} = req.params;
  const userId = req.user.user_id || req.user.id;
  log.info(`GET /tasks/${id} - Fetching task by id for user ${userId}`);
  taskService.getTaskByParams({ _id: id, created_by: userId }, (err, task) => {
    if (err) {
      log.error(`GET /tasks/${id} - Error: ${err}`);
      res.send({ success: false, error: err});
    }
    else {
      log.info(`GET /tasks/${id} - Task retrieved successfully`);
      res.send({ success: true, task});
    }
  });
});

taskRouter.get('/', auth, (req: any, res: Response) => {
  const userId = req.user.user_id || req.user.id;
  log.info(`GET /tasks - Fetching tasks for user ${userId}`);
  taskService.getTasks(userId, (err, tasks) => {
    if (err) {
      log.error(`GET /tasks - Error: ${err}`);
      res.send({ success: false, error: err});
    }
    else {
      log.info(`GET /tasks - Tasks retrieved successfully for user ${userId}`);
      res.send({ success: true, tasks});
    }
  });
});

taskRouter.delete('/:id', auth, (req: any, res: Response) => {
  const {id} = req.params;
  const userId = req.user.user_id || req.user.id;
  log.info(`DELETE /tasks/${id} - Deleting task for user ${userId}`);
  try{
    taskService.deleteTask(id, userId, (err, task) => {
      if (err) {
        log.error(`DELETE /tasks/${id} - Error: ${err}`);
        res.status(404).send({ success: false, error: err});
      }
      else if (!task) {
        log.warn(`DELETE /tasks/${id} - Task not found or user ${userId} is not the owner`);
        res.status(404).send({ success: false, error: 'Task not found or unauthorized' });
      }
      else {
        log.info(`DELETE /tasks/${id} - Task deleted successfully`);
        res.send({ success: true, task});
      }
    });
  }
  catch(e) {
    log.error(`DELETE /tasks/${id} - Exception: ${e}`);
    res.status(500).send(e);
  }
});

const taskRoutes : AppRouter = { url: '/tasks', router: taskRouter};

export default taskRoutes;
