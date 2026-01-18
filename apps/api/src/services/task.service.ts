import {Logger} from "tslog";
import {TaskModel } from "@models";
import { CallbackError } from "mongoose";
import { ITask, Task } from "@schemas";

const log: Logger = new Logger();

export class TaskService {

  getTasks(callback: (err: CallbackError, task: ITask) => void) {
    log.info(`taskService.getTasks: find task`);
    return Task.find(callback);
  }

  getTaskByParams(params: any, callback: (err: CallbackError, task: ITask) => void) {
    log.info(`taskService.getTaskByParams: find task`);
    return Task.find(params, callback)
  }

  createTask(task: TaskModel): Promise<ITask> {
    log.info(`taskService.createTask: create task`);
    return Task.create(task);
  }

  updateTask(task: TaskModel, id: string): Promise<ITask> {
    log.info(`taskService.updateTask: findByIdAndUpdate task`);
    return Task.findByIdAndUpdate(id, {...task}, {new: true});
  }

  deleteTask(id: string, callback: (err: CallbackError, task: ITask) => void) {
    log.info(`taskService.deleteTask: findOneAndUpdate task`);
    return Task.findByIdAndDelete(id, callback);
  }
}
