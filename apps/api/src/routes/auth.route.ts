import { Request, Response, Router } from "express";
import { Logger } from "tslog";
import {AppRouter} from "@models";
import { AuthService } from "@controllers";

const log: Logger = new Logger();
const authRouter: Router = Router();
const authService: AuthService = new AuthService();

authRouter.post(
  '/login',
  async (req, res) => {
  const response = await authService.Login(req.body);
  return res.status(response.status).json(response.resBody);
});

authRouter.post(
  '/signup',
  async (req: Request, res: Response) => {
    const response = await authService.SignUp(req.body);
    return res.status(response.status).json(response.resBody);
  }
);

authRouter.get(
  '/profile',
  (req: Request, res: Response) => {
    res.json({
      message: 'You made it to the secure route',
      token: req.headers.authorization
    })
  }
);

const authRoutes : AppRouter = { url: '/auth', router: authRouter};

export default authRoutes;
