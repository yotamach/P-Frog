import {Logger} from "tslog";
import {UserModel} from "@models";
import { IUser, User } from "@schemas";
import { NativeError } from "mongoose";
import { Dict } from '@p-frog/data';

const log: Logger = new Logger();

export class UserService {

  getUsers(callback: (err: NativeError, user: IUser) => void) {
    log.info(`UserService.getUsers: users fetched!`);
    return User.find(callback);
  }

  getUserByParams(params: Dict, callback: (err: NativeError, user: IUser) => void) {
    log.info(`UserService.getUserByParams: user fetched! params:${params}`);
    return User.find(params, callback)
  }

  createUser(user: UserModel): Promise<IUser> {
    log.info(`UserService.createUser: user created! ${user}`);
    return User.create(user);
  }

  updateUser(user: UserModel, id: string, callback: (err: NativeError, user: IUser) => void) {
    log.info(`UserService.updateUser: user updated! ${user}`);
    User.findOneAndUpdate({ id },{...user},{new: true}, callback);
  }

  deleteUser(id: string, callback: (err: NativeError, user: IUser) => void) {
    log.info(`taskService.deleteUser: findOneAndUpdate user`);
    return User.findByIdAndDelete(id, callback);
  }
}
