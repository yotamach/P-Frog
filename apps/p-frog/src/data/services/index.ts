import axios from 'axios';
import { TasksAPI } from './tasks.service';

// Helper to safely access import.meta.env (works in both Vite and Jest)
const getEnvVar = (key: string, defaultValue: string) => {
  try {
    return (import.meta.env as any)?.[key] || defaultValue;
  } catch {
    return defaultValue;
  }
};

const BASE_URL = `http://${getEnvVar('VITE_SERVER_HOST', 'localhost')}:${getEnvVar('VITE_SERVER_PORT', '3333')}/api/`;

export const request = axios.create({
    baseURL: BASE_URL,
    timeout: 1000
});

export {
    BASE_URL,
    TasksAPI
}