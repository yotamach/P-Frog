import { Request, Response, Router } from 'express';
import { AppRouter } from '@models';

const healthRouter: Router = Router();

healthRouter.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

const healthRoutes: AppRouter = {
  url: '/health',
  router: healthRouter,
};

export default healthRoutes;
