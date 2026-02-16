
import {settingsRoutes, taskRoutes, userRoutes, authRoutes, projectRoutes, projectMemberRoutes} from './routes/index';
import './config/config'
import { App } from './App';

const { SERVER_HOST, SERVER_PORT, DB_HOST, DB_PORT, DB_SCHEMA, DB_USERNAME, DB_PASSWORD } = process.env;

const port: number = +SERVER_PORT || 3333;
const app: App = new App(SERVER_HOST, port);
app.configure();
app.setupSwagger();
app.addRouter(authRoutes);
app.addRouter(userRoutes);
app.addRouter(settingsRoutes);
app.addRouter(taskRoutes);
app.addRouter(projectRoutes);
app.addRouter(projectMemberRoutes);

app.start();
app.dbConnect(DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_SCHEMA);


