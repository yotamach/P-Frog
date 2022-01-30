import { Request, Response, Router } from "express";
import { UserModel } from '../models/user.model';
import { Logger } from "tslog";
import {AppRouter} from "@models";
import {UserService} from "src/services";

const log: Logger = new Logger();
const userRouter: Router = Router();
const userService: UserService = new UserService();

userRouter.get('/login', (req: Request, res: Response) => {
  log.info(`Login route`);
  userService.getUserByParams(req.body, (err, user) => {
    if (err) {
      res.send({ success: false, error: err});
    }
    else {
      res.send({ success: true, user});
    }
  });
});

userRouter.post('/signup',async (req: Request, res: Response) => {
  log.info("/signup: Signup route");
  try {
    const user: UserModel = req.body;
    const userDetails = await userService.createUser(user);
    log.info(`/signup: User created succsfully! ${userDetails}`);
    res.send(userDetails);
  } catch(e) {
    log.error(`/signup: Failed to create user - ${e}`);
    res.send(e);
  }
});

userRouter.patch('/:id', (req: Request, res: Response) => {
  log.info(`Update user`);
  const user: UserModel = req.body;
  const {id} = req.params;
  userService.updateUser(user, id, (err, user) => {
    if (err) {
      res.send({ success: false, error: err});
    }
    else {
      res.send({ success: true, user});
    }
  });
});

userRouter.get('/:id', (req: Request, res: Response) => {
  log.info(`Get route`);
  const {id} = req.params;
  userService.getUserByParams({ id }, (err, user) => {
    if (err) {
      res.send({ success: false, error: err});
    }
    else {
      res.send({ success: true, user});
    }
  });
});

userRouter.get('/', (req: Request, res: Response) => {
  log.info(`Get route`);
  userService.getUsers((err, users) => {
    if (err) {
      res.send({ success: false, error: err});
    }
    else {
      res.send({ success: true, users});
    }
  });
});

const userRoutes : AppRouter = { url: '/users', router: userRouter};

export default userRoutes;
