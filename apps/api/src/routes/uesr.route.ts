import { Request, Response, Router } from "express";
import { UserModel } from '../models/user.model';
import { Logger } from "tslog";
import {AppRouter} from "@models";
import {UserService} from "@controllers";
import { auth } from "../middleware/authentication";

const log: Logger = new Logger();
const userRouter: Router = Router();
const userService: UserService = new UserService();

userRouter.post('/',async (req: Request, res: Response) => {
  log.info('POST /users - Creating user');
  try {
    const user: UserModel = req.body;
    const userDetails = await userService.createUser(user);
    log.info('POST /users - User created successfully');
    res.send(userDetails);
  } catch(e) {
    log.error(`POST /users - Failed to create user - ${e}`);
    res.status(500).send({ success: false, error: e });
  }
});

userRouter.patch('/:id', (req: Request, res: Response) => {
  const {id} = req.params;
  log.info(`PATCH /users/${id} - Updating user`);
  const user: UserModel = req.body;
  userService.updateUser(user, id, (err, user) => {
    if (err) {
      log.error(`PATCH /users/${id} - Error: ${err}`);
      res.send({ success: false, error: err});
    }
    else {
      log.info(`PATCH /users/${id} - User updated successfully`);
      res.send({ success: true, user});
    }
  });
});

userRouter.get('/:id', (req: Request, res: Response) => {
  const {id} = req.params;
  log.info(`GET /users/${id} - Fetching user by id`);
  userService.getUserByParams({ id }, (err, user) => {
    if (err) {
      log.error(`GET /users/${id} - Error: ${err}`);
      res.send({ success: false, error: err});
    }
    else {
      log.info(`GET /users/${id} - User retrieved successfully`);
      res.send({ success: true, user});
    }
  });
});

userRouter.get('/',auth, (req: Request, res: Response) => {
  log.info('GET /users - Fetching all users');
  userService.getUsers((err, users) => {
    if (err) {
      log.error(`GET /users - Error: ${err}`);
      res.send({ success: false, error: err});
    }
    else {
      log.info(`GET /users - Users retrieved successfully`);
      res.send({ success: true, users});
    }
  });
});

const userRoutes : AppRouter = { url: '/users', router: userRouter};

export default userRoutes;
