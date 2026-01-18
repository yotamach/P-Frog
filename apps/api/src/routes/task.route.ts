import { Request, Response, Router } from "express";
import { Logger } from "tslog";
import {AppRouter} from "@models";
import { TaskService } from "src/services/task.service";
import { TaskModel } from '@models';

const log: Logger = new Logger();
const taskRouter: Router = Router();
const taskService: TaskService = new TaskService();

taskRouter.post('/',async (req: Request, res: Response) => {
  log.info("/create task: post route");
  try {
    const task: TaskModel = { ...req.body.data };
    log.info(`post: Task to create ${JSON.stringify(task)}`);
    const taskDetails = await taskService.createTask(task);
    log.info(`post: Task created succsfully! ${taskDetails}`);
    res.send(taskDetails);
  } catch(e) {
    log.error(`post: Failed to create task - ${e}`);
    res.status(500).send(e);
  }
});

taskRouter.patch('/:id', async (req: Request, res: Response) => {
  log.info(`Update task`);
  try {
    const task: TaskModel = req.body;
    const {id} = req.params;
    log.info(`patch: Updating task ${id} with data: ${JSON.stringify(task)}`);
    const updatedTask = await taskService.updateTask(task, id);
    log.info(`patch: Task updated successfully! ${JSON.stringify(updatedTask)}`);
    res.send({ success: true, task: updatedTask });
  } catch(e) {
    log.error(`patch: Failed to update task - ${e}`);
    res.status(500).send({ success: false, error: e });
  }
});

taskRouter.get('/:id', (req: Request, res: Response) => {
  const {id} = req.params;
  log.info(`GET /tasks/${id} - Fetching task by id`);
  taskService.getTaskByParams({ id }, (err, task) => {
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

taskRouter.get('/', (req: Request, res: Response) => {
  log.info('GET /tasks - Fetching all tasks');
  taskService.getTasks((err, tasks) => {
    if (err) {
      log.error(`GET /tasks - Error: ${err}`);
      res.send({ success: false, error: err});
    }
    else {
      log.info(`GET /tasks - Tasks retrieved successfully`);
      res.send({ success: true, tasks});
    }
  });
});

taskRouter.delete('/:id', (req: Request, res: Response) => {
  const {id} = req.params;
  log.info(`DELETE /tasks/${id} - Deleting task`);
  try{
    taskService.deleteTask(id, (err, task) => {
      if (err) {
        log.error(`DELETE /tasks/${id} - Error: ${err}`);
        res.status(404).send({ success: false, error: err});
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
