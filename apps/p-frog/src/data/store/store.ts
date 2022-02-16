import { configureStore } from '@reduxjs/toolkit'
import { tasksReducer, TASKS_FEATURE_KEY } from './tasks/tasks.slice'

export const store = configureStore({
    reducer: {
      [TASKS_FEATURE_KEY]: tasksReducer,
    },
    // Additional middleware can be passed to this array
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== 'production',
    // Optional Redux store enhancers
    enhancers: [],
  });

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch