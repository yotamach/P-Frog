import { TasksAPI } from './tasks.service';
import { ProjectsAPI } from './projects.service';
import { AuthAPI } from './auth.service';
import { UsersAPI } from './users.service';
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

export type ApiResponse<T = any> = Promise<{ data: T }>;

interface FetchConfig {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  url: string;
  body?: any;
  headers?: Record<string, string>;
}

/**
 * Core fetch-based HTTP request function.
 * Returns { data: T } to match axios behavior.
 * Throws { response: { status, data } } format for errors.
 */
const makeRequest = async <T = any>(config: FetchConfig): Promise<{ data: T }> => {
  const { method, url, body, headers: customHeaders } = config;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  // Add auth token from store
  const state = authStore.state;
  if (state.token) {
    headers['x-access-token'] = `Bearer ${state.token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(BASE_URL + url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle 401 (unauthorized)
    if (response.status === 401) {
      clearAuth();
    }

    const data = await response.json();

    if (!response.ok) {
      // Throw in axios-compatible format: { response: { data } }
      const error: any = new Error(data?.message || `HTTP ${response.status}`);
      error.response = { status: response.status, data };
      throw error;
    }

    return { data };
  } catch (error: any) {
    clearTimeout(timeoutId);

    // Re-throw if already in axios-compatible format
    if (error.response) {
      throw error;
    }

    // AbortSignal timeout
    if (error.name === 'AbortError') {
      const timeoutError: any = new Error('Request timeout');
      timeoutError.response = { status: 408, data: { message: 'Request timeout' } };
      throw timeoutError;
    }

    // Network or other errors
    const networkError: any = new Error(error.message || 'Network error');
    networkError.response = { status: 0, data: { message: error.message || 'Network error' } };
    throw networkError;
  }
};

/**
 * Request object with axios-compatible methods (get, post, patch, delete).
 * Allows existing service code to work without major refactoring.
 */
export const request = {
  get: <T = any>(url: string, config?: Omit<FetchConfig, 'method' | 'url'>): ApiResponse<T> =>
    makeRequest({ method: 'GET', url, ...config }),

  post: <T = any>(url: string, data?: any, config?: Omit<FetchConfig, 'method' | 'url' | 'body'>): ApiResponse<T> =>
    makeRequest({ method: 'POST', url, body: data, ...config }),

  patch: <T = any>(url: string, data?: any, config?: Omit<FetchConfig, 'method' | 'url' | 'body'>): ApiResponse<T> =>
    makeRequest({ method: 'PATCH', url, body: data, ...config }),

  delete: <T = any>(url: string, config?: Omit<FetchConfig, 'method' | 'url'>): ApiResponse<T> =>
    makeRequest({ method: 'DELETE', url, ...config }),

  put: <T = any>(url: string, data?: any, config?: Omit<FetchConfig, 'method' | 'url' | 'body'>): ApiResponse<T> =>
    makeRequest({ method: 'PUT', url, body: data, ...config }),
};

export {
    BASE_URL,
    TasksAPI,
    ProjectsAPI,
    AuthAPI,
    UsersAPI
}
