import { Request, Response, Router } from "express";
import { UserModel } from '../models/user.model';
import { Logger } from "tslog";
import {UserController} from "../controllers/user.comtroller";

const log: Logger = new Logger();
const userRouter: Router = Router();
const userController: UserController = new UserController();

userRouter.get('/login', (req: Request, res: Response) => {
  log.info(`Login route ${req.body}`);
  console.log(req.body);
  const {id} = req.body;
  userController.getUser(id);
  res.send({ success: true, userId: id});
});

userRouter.post('/signup', (req: Request, res: Response) => {
  log.info("Signup route");
  const user: UserModel = {
    firstName: 'Yotam',
    lastName: 'Achrak',
    age: 36
  };
  userController.createUser(user);
  res.send(user);
});


userRouter.use('/users', userRouter);

export default userRouter;
