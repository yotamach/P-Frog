import axios from 'axios';
import { TasksAPI } from './tasks.service';
const BASE_URL = `http://${import.meta.env.VITE_SERVER_HOST || 'localhost'}:${import.meta.env.VITE_SERVER_PORT || '3333'}/api/` 

export const request = axios.create({
    baseURL: BASE_URL,
    timeout: 1000
});

export {
    BASE_URL,
    TasksAPI
}