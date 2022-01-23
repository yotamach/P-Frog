import * as express from "express";
import {BASE_API} from "./config/config";
import * as bodyParser from "body-parser";
import {Router} from "express";

export class App {
  private readonly host: string;
  private readonly port: number | string;
  private app = express();

  constructor(host: string, port: number | string) {
    this.host = host;
    this.port = port;
  }

  start() {
    this.configure();
    const server = this.app.listen(this.port, () => {
      console.log('Listening at http://' + this.host + ':' + this.port + BASE_API);
    });
    server.on('error', console.error);
  }

  configure() {
    this.app.use(bodyParser);
  }

  addRouter(router: Router) {
    this.app.use(BASE_API, router);
  }
}
