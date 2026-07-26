import { randomUUID } from 'crypto';
import { AsyncLocalStorage } from 'async_hooks';
import { Request, Response, NextFunction } from 'express';

export interface CorrelationStore {
  correlationId: string;
}

export const correlationStorage = new AsyncLocalStorage<CorrelationStore>();

const CORRELATION_ID_PATTERN = /^[a-zA-Z0-9-]{1,100}$/;

export const correlationIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const incoming = req.headers['x-correlation-id'];
  const isValid = typeof incoming === 'string' && CORRELATION_ID_PATTERN.test(incoming);
  const correlationId = isValid ? incoming : randomUUID();
  res.setHeader('x-correlation-id', correlationId);
  correlationStorage.run({ correlationId }, next);
};
