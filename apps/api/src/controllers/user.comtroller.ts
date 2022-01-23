import {UserModel} from "../models/user.model";
import {Logger} from "tslog";

const log: Logger = new Logger();

export class UserController {

  getUser(id: number) {
    log.info(`getUser: user fetched! id:${id}`);
  }

  createUser(user: UserModel): UserModel {
    log.info(`createUser: user created successfully! user:${user}`);
    return user;
  }

  editUser(user: UserModel): UserModel {
    user.firstName = "Moshe";
    return user;
  }

  deleteUser(user: UserModel): Message {
    return { message: 'deleted in success' }
  }
}
