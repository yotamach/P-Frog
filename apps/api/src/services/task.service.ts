import {Logger} from "tslog";
import {TaskModel } from "@models";
import { CallbackError } from "mongoose";
import { ITask, Task } from "@schemas";

const log: Logger = new Logger();

export class TaskService {

  getTasks(userId: string, callback: (err: CallbackError, tasks: ITask[]) => void) {
    log.info(`taskService.getTasks: find tasks for user ${userId}`);
    return Task.find({ created_by: userId }).populate('project').exec(callback);
  }

  getTaskByParams(params: any, callback: (err: CallbackError, tasks: ITask[]) => void) {
    log.info(`taskService.getTaskByParams: find task with params ${JSON.stringify(params)}`);
    return Task.find(params, callback)
  }

  createTask(task: TaskModel): Promise<ITask> {
    log.info(`taskService.createTask: create task`);
    return Task.create(task).then(createdTask => 
      Task.findById(createdTask._id).populate('project').exec()
    );
  }

  updateTask(task: TaskModel, id: string, userId: string): Promise<ITask> {
    log.info(`taskService.updateTask: findByIdAndUpdate task ${id} for user ${userId}`);
    return Task.findOneAndUpdate(
      { _id: id, created_by: userId },
      {...task},
      {new: true}
    ).populate('project').exec();
  }

  deleteTask(id: string, userId: string, callback: (err: CallbackError, task: ITask) => void) {
    log.info(`taskService.deleteTask: findOneAndDelete task ${id} for user ${userId}`);
    return Task.findOneAndDelete({ _id: id, created_by: userId }, callback);
  }
}
