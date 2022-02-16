import {Logger} from "tslog";
import {TaskModel } from "@models";
import { NativeError } from "mongoose";
import { Dict } from '@p-frog/data';
import { ITask, Task } from "@schemas";

const log: Logger = new Logger();

export class TaskService {

  getTasks(callback: (err: NativeError, task: ITask) => void) {
    log.info(`taskService.getTasks: find task`);
    return Task.find(callback);
  }

  getTaskByParams(params: Dict, callback: (err: NativeError, task: ITask) => void) {
    log.info(`taskService.getTaskByParams: find task`);
    return Task.find(params, callback)
  }

  createTask(task: TaskModel): Promise<ITask> {
    log.info(`taskService.createTask: create task`);
    return Task.create(task);
  }

  updateTask(task: TaskModel, id: string, callback: (err: NativeError, task: ITask) => void) {
    log.info(`taskService.updateTask: findOneAndUpdate task`);
    return Task.findOneAndUpdate({ id },{...task},{new: true}, callback);
  }

  deleteTask(id: string, callback: (err: NativeError, task: ITask) => void) {
    log.info(`taskService.deleteTask: findOneAndUpdate task`);
    return Task.findByIdAndDelete(id, callback);
  }
}
