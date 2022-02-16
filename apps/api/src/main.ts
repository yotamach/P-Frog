import {App} from "./App";
import {taskRoutes, userRoutes} from './routes/index';
import './config/config'

const { SERVER_HOST, SERVER_PORT, DB_HOST, DB_SCHEMA, DB_USERNAME, DB_PASSWORD } = process.env;

const port: number = +SERVER_PORT || 3333;
const app: App = new App(SERVER_HOST, port);
app.configure();
app.addRouter(userRoutes);
app.addRouter(taskRoutes);

app.start();
app.dbConnect(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_SCHEMA);


