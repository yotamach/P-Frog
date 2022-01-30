import * as express from "express";
import {BASE_API} from "./config/config";
import * as bodyParser from "body-parser";
import { AppRouter } from "@models";
import { connect } from "mongoose";
import { Logger } from "tslog";
import { Port } from "@p-frog/data";

const log: Logger = new Logger();

export class App {
  private readonly host: string;
  private readonly port: Port;
  private app = express();

  constructor(host: string, port: Port) {
    this.host = host;
    this.port = port;
  }

  start(): void {
    const server = this.app.listen(this.port, () => {
      log.info('Listening at https://' + this.host + ':' + this.port + BASE_API);
    });
    server.on('error', log.error);
  }

  configure(): void {
    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.app.use(bodyParser.json())
  }

  addRouter(appRouter: AppRouter): void {
    const { url, router } = appRouter;
    this.app.use(BASE_API + url, router);
  }

  dbConnect(host: string, userName: string, password: string, schema: string) {
    connect(`mongodb+srv://${userName}:${password}@${host}/${schema}?retryWrites=true&w=majority

    `);
    log.info(`Connected to mongoDB URL: mongodb://${host}/ DB: ${schema}`);
  }
}
