import { configureStore } from '@reduxjs/toolkit'
import { authReducer, AUTH_FEATURE_KEY } from './auth/auth.slice';
import { tasksReducer, TASKS_FEATURE_KEY } from './tasks/tasks.slice'

export const store = configureStore({
    reducer: {
      [TASKS_FEATURE_KEY]: tasksReducer,
      [AUTH_FEATURE_KEY]: authReducer,
    },
    // Additional middleware can be passed to this array
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: import.meta.env.MODE !== 'production',
    // Optional Redux store enhancers
    enhancers: [],
  });

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch