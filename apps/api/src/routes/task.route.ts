import { Request, Response, Router } from "express";
import { Logger } from "tslog";
import {AppRouter} from "@models";
import { TaskService } from "src/services/task.service";
import { TaskModel } from '@models';

const log: Logger = new Logger();
const taskRouter: Router = Router();
const taskService: TaskService = new TaskService();

taskRouter.get('/login', (req: Request, res: Response) => {
  log.info(`Login route`);
  taskService.getTaskByParams(req.body, (err, task) => {
    if (err) {
      res.send({ success: false, error: err});
    }
    else {
      res.send({ success: true, task});
    }
  });
});

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
    res.send(e);
  }
});

taskRouter.patch('/:id', (req: Request, res: Response) => {
  log.info(`Update task`);
  const task: TaskModel = req.body;
  const {id} = req.params;
  taskService.updateTask(task, id, (err, task) => {
    if (err) {
      res.send({ success: false, error: err});
    }
    else {
      res.send({ success: true, task});
    }
  });
});

taskRouter.get('/:id', (req: Request, res: Response) => {
  log.info(`Get route`);
  const {id} = req.params;
  taskService.getTaskByParams({ id }, (err, task) => {
    if (err) {
      res.send({ success: false, error: err});
    }
    else {
      res.send({ success: true, task});
    }
  });
});

taskRouter.get('/', (req: Request, res: Response) => {
  log.info(`Get route`);
  taskService.getTasks((err, tasks) => {
    if (err) {
      res.send({ success: false, error: err});
    }
    else {
      res.send({ success: true, tasks});
    }
  });
});

taskRouter.delete('/:id', (req: Request, res: Response) => {
  log.info(`Get route`);
  const {id} = req.params;
  taskService.deleteTask(id, (err, task) => {
    if (err) {
      res.send({ success: false, error: err});
    }
    else {
      res.send({ success: true, task});
    }
  });
});

const taskRoutes : AppRouter = { url: '/tasks', router: taskRouter};

export default taskRoutes;
