import {Logger} from "tslog";
import {UserModel} from "@models";
import { IUser, User } from "@schemas";

type UserQueryParams = Record<string, unknown>;

const log = new Logger({});

export class UserService {

  async getUsers(): Promise<IUser[]> {
    log.info(`UserService.getUsers: users fetched!`);
    return User.find({}).exec();
  }

  /**
   * Get all users (async version)
   */
  async getAllUsers(): Promise<IUser[]> {
    log.info(`UserService.getAllUsers: fetching all users`);
    return User.find({}).exec();
  }

  async getUserByParams(params: UserQueryParams): Promise<IUser[]> {
    log.info(`UserService.getUserByParams: user fetched! params:${params}`);
    return User.find(params).exec();
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

  async updateUser(user: UserModel, id: string): Promise<IUser | null> {
    log.info(`UserService.updateUser: user updated! ${user}`);
    return User.findOneAndUpdate({ id }, {...user}, {new: true}).exec();
  }

  async deleteUser(id: string): Promise<IUser | null> {
    log.info(`taskService.deleteUser: findOneAndUpdate user`);
    return User.findByIdAndDelete(id).exec();
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
