import axios from 'axios';
import { TasksAPI } from './tasks.service';
const BASE_URL = `http://${process.env.NX_SERVER_HOST}:${process.env.NX_SERVER_PORT}/api/` 

export const request = axios.create({
    baseURL: BASE_URL,
    timeout: 1000
});

export {
    BASE_URL,
    TasksAPI
}