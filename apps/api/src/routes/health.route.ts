import { Request, Response, Router } from 'express';
import { connection } from 'mongoose';
import { AppRouter } from '@models';

const healthRouter: Router = Router();

healthRouter.get('/', (req: Request, res: Response) => {
  const isConnected = connection.readyState === 1;

  if (!isConnected) {
    return res.status(503).json({ status: 'unhealthy', database: 'disconnected' });
  }

  res.status(200).json({ status: 'ok', database: 'connected' });
});

const healthRoutes: AppRouter = {
  url: '/health',
  router: healthRouter,
};

export default healthRoutes;
