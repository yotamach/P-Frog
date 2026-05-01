import express from "express";
import { AppRouter } from "@models";
import { connect, set } from "mongoose";
import { Logger } from "tslog";
import cors from 'cors';
import cookieParser  from 'cookie-parser'
import expressSession from 'express-session'
import swaggerUi from 'swagger-ui-express';
import { BASE_API } from "./config/config";
import { swaggerSpec } from "./config/swagger";

const log = new Logger({ name: 'P-Frog API' });

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
        log.info('Listening at https://' + this.host + ':' + this.port + BASE_API);
        resolve();
      });
      server.on('error', (error) => {
        log.error('Server error:', error);
        reject(error);
      });
    });
  }

  configure(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(
      expressSession({
        secret: 'Pfrog-session',
        resave: false,
        saveUninitialized: false,
      }) as any
    );
  }

  setupSwagger(): void {
    this.app.use(`${BASE_API}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    log.info(`Swagger docs available at ${BASE_API}/docs`);
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
    
    // error handler
    this.app.use(function(req, res, next ,err) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
    
      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });
  };

  dbConnect(host: string, port: string, userName: string, password: string, schema: string): Promise<void> {
    return connect(`mongodb://${userName}:${password}@${host}:${port}/${schema}?authSource=admin`)
      .then(() => {
        log.info(`Connected to mongoDB DB: ${schema}`);
      })
      .catch((e) => {
        log.error(`Connection to mongoDB was failed, reason: ${e}`);
        throw e;
      });
  }
}


