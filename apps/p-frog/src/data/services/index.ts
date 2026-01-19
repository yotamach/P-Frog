import axios from 'axios';
import { TasksAPI } from './tasks.service';
import { ProjectsAPI } from './projects.service';
import { AuthAPI } from './auth.service';
import { authStore, clearAuth } from '../store/authStore';

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

// Add request interceptor to include auth token
request.interceptors.request.use(
  (config) => {
    const state = authStore.state;
    if (state.token) {
      config.headers = config.headers || {};
      config.headers['x-access-token'] = `Bearer ${state.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle expired tokens
request.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token is expired or invalid (401), clear auth state
    if (error.response && error.response.status === 401) {
      clearAuth();
      // Redirect to login will happen via ProtectedRoute
    }
    return Promise.reject(error);
  }
);

export {
    BASE_URL,
    TasksAPI,
    ProjectsAPI,
    AuthAPI
}