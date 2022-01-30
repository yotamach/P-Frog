import {App} from "./App";
import {userRoutes} from './routes/index';
import './config/config'

const { HOST, PORT, DB_HOST, DB_PORT, DB_SCHEMA, DB_USERNAME, DB_PASSWORD } = process.env;

const port: number = +PORT || 3333;
const app: App = new App(HOST, port);
app.configure();
app.addRouter(userRoutes);

app.start();
app.dbConnect(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_SCHEMA);


