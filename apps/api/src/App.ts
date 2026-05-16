import express, { Request, Response, NextFunction } from "express";
import { AppRouter } from "@models";
import { connect, set } from "mongoose";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { toNodeHandler } from 'better-auth/node';
import { BASE_API } from "./config/config";
import { swaggerSpec } from "./config/swagger";
import type { Auth } from "./config/auth";
import { correlationIdMiddleware } from "./middleware/correlation-id";
import { logger } from "./utils/logger";

// Suppress Mongoose strictQuery deprecation warning
set('strictQuery', false);

export class App {
  private readonly host: string;
  private readonly port: number;
  private app = express();

  constructor(host: string, port: number) {
    this.host = host;
    this.port = port;
  }

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      const server = this.app.listen(this.port, this.host, () => {
        logger.info('Listening at https://' + this.host + ':' + this.port + BASE_API);
        resolve();
      });
      server.on('error', (error) => {
        logger.error('Server error', { error });
        reject(error);
      });
    });
  }

  configure(auth: Auth): void {
    this.app.use(correlationIdMiddleware);
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const start = Date.now();
      res.on('finish', () => {
        logger.info('HTTP request', {
          method: req.method,
          url: req.originalUrl,
          status: res.statusCode,
          durationMs: Date.now() - start,
        });
      });
      next();
    });
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:4200',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-correlation-id'],
      exposedHeaders: ['x-correlation-id'],
    }));

    // better-auth handler must be mounted BEFORE express.json()
    this.app.all('/api/auth/*', toNodeHandler(auth));

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
  }

  setupSwagger(): void {
    this.app.use(`${BASE_API}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    logger.info(`Swagger docs available at ${BASE_API}/docs`);
  }

  addRouter(appRouter: AppRouter): void {
    const { url, router } = appRouter;
    this.app.use(BASE_API + url, router);
  }

  addDefaultRoutes(): void {
    this.app.use(function(req, res, next) {
      const err = new Error('Not Found');
      next(err);
    });

    this.app.use(function(req, res, next, err) {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.status(err.status || 500);
      res.render('error');
    });
  }

  dbConnect(host: string, port: string, userName: string, password: string, schema: string): Promise<void> {
    return connect(`mongodb://${userName}:${password}@${host}:${port}/${schema}?authSource=admin`)
      .then(() => {
        logger.info(`Connected to mongoDB DB: ${schema}`);
      })
      .catch((e) => {
        logger.error('Connection to mongoDB failed', { reason: e.message });
        throw e;
      });
  }
}
