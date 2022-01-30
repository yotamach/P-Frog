import {Logger} from "tslog";
import {UserModel} from "@models";
import { IUser, User } from "@schemas";
import { NativeError } from "mongoose";
import { Dict, Message } from '@p-frog/data';

const log: Logger = new Logger();

export class UserService {

  getUsers(callback: (err: NativeError, user: IUser) => void) {
    log.info(`getUser: users fetched!`);
    return User.find(callback);
  }

  getUserByParams(params: Dict, callback: (err: NativeError, user: IUser) => void) {
    log.info(`getUser: user fetched! params:${params}`);
    return User.find(params, callback)
  }

  createUser(user: UserModel): Promise<IUser> {
    return User.create(user);
  }

  updateUser(user: UserModel, id: string, callback: (err: NativeError, user: IUser) => void) {
    User.findOneAndUpdate({ id },{...user},{new: true}, callback);
  }

  deleteUser(user: UserModel): Message {
    log.info(`user deleted ${user}`)
    return { message: 'deleted in success' }
  }
}
