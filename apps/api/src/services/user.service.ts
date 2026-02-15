import {Logger} from "tslog";
import {UserModel} from "@models";
import { IUser, User } from "@schemas";
import { MongooseError } from "mongoose";

type UserQueryParams = Record<string, unknown>;

const log: Logger = new Logger();

export class UserService {

  getUsers(callback: (err: MongooseError, user: IUser) => void) {
    log.info(`UserService.getUsers: users fetched!`);
    return User.find(callback);
  }

  /**
   * Get all users (async version)
   */
  async getAllUsers(): Promise<IUser[]> {
    log.info(`UserService.getAllUsers: fetching all users`);
    return User.find({}).exec();
  }

  getUserByParams(params: UserQueryParams, callback: (err: MongooseError, user: IUser) => void) {
    log.info(`UserService.getUserByParams: user fetched! params:${params}`);
    return User.find(params, callback)
  }

  /**
   * Get user by ID (async version)
   */
  async getUserById(id: string): Promise<IUser | null> {
    log.info(`UserService.getUserById: fetching user ${id}`);
    return User.findById(id).exec();
  }

  createUser(user: UserModel): Promise<IUser> {
    log.info(`UserService.createUser: user created! ${user}`);
    return User.create(user);
  }

  updateUser(user: UserModel, id: string, callback: (err: MongooseError, user: IUser) => void) {
    log.info(`UserService.updateUser: user updated! ${user}`);
    User.findOneAndUpdate({ id },{...user},{new: true}, callback);
  }

  deleteUser(id: string, callback: (err: MongooseError, user: IUser) => void) {
    log.info(`taskService.deleteUser: findOneAndUpdate user`);
    return User.findByIdAndDelete(id, callback);
  }

  /**
   * Set superuser status for a user
   */
  async setSuperuserStatus(userId: string, isSuperuser: boolean): Promise<IUser | null> {
    log.info(`UserService.setSuperuserStatus: setting superuser=${isSuperuser} for user ${userId}`);
    return User.findByIdAndUpdate(
      userId,
      { isSuperuser },
      { new: true }
    ).exec();
  }

  /**
   * Search users by username or email (for adding members)
   */
  async searchUsers(query: string): Promise<IUser[]> {
    log.info(`UserService.searchUsers: searching for "${query}"`);
    const regex = new RegExp(query, 'i');
    return User.find({
      $or: [
        { userName: regex },
        { email: regex },
        { firstName: regex },
        { lastName: regex }
      ]
    }).limit(20).exec();
  }
}
