import {App} from "./App";
import { userRouter } from './routes/index';

const port = process.env.port || 3333;
const app: App = new App('localhost', port);
app.addRouter(userRouter);

app.start();


