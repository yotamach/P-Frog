import { randomUUID } from 'crypto';
import { AsyncLocalStorage } from 'async_hooks';
import { Request, Response, NextFunction } from 'express';

export interface CorrelationStore {
  correlationId: string;
}

export const correlationStorage = new AsyncLocalStorage<CorrelationStore>();

export const correlationIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const correlationId = (req.headers['x-correlation-id'] as string) || randomUUID();
  res.setHeader('x-correlation-id', correlationId);
  correlationStorage.run({ correlationId }, next);
};
