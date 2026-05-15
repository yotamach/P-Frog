
import {settingsRoutes, taskRoutes, userRoutes, projectRoutes, projectMemberRoutes, healthRoutes} from './routes/index';
import './config/config'
import { App } from './App';
import { createAuth } from './config/auth';
import { setAuthInstance } from './middleware/authentication';

const { SERVER_HOST, SERVER_PORT, DB_HOST, DB_PORT, DB_SCHEMA, DB_USERNAME, DB_PASSWORD } = process.env;

async function startApp() {
  const port: number = +process.env.PORT || +SERVER_PORT || 3333;
  const app: App = new App(SERVER_HOST, port);

  try {
    await app.dbConnect(DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_SCHEMA);

    const auth = createAuth();
    setAuthInstance(auth);

    app.configure(auth);
    app.setupSwagger();
    app.addRouter(userRoutes);
    app.addRouter(settingsRoutes);
    app.addRouter(taskRoutes);
    app.addRouter(projectRoutes);
    app.addRouter(projectMemberRoutes);
    app.addRouter(healthRoutes);

    await app.start();
  } catch (error) {
    process.exit(1);
  }
}

startApp();


