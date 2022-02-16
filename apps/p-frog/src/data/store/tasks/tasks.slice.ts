import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction
} from '@reduxjs/toolkit';
import { PendingAction, RejectedAction, Task } from '@types';
import { TasksAPI } from '../../services';
import { RootState } from '../store';

export const TASKS_FEATURE_KEY = 'tasks';

const tasksAPI: TasksAPI = new TasksAPI();

export interface TasksState extends EntityState<Task> {
  loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
  error: string | null | undefined;
}

export const tasksAdapter = createEntityAdapter<Task>();

export const fetchTasks = createAsyncThunk(
  'tasks/fechtAll',
  async (_, { rejectWithValue } ) => {
    try{
      const response = await tasksAPI.fetchAll();
      return response.data;
    } catch(e: any) {
        return rejectWithValue(e.response.data);
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (task: Task) => {
    const response = await tasksAPI.create(task);
    return response.data;
  }
)

export const initialTasksState: TasksState = tasksAdapter.getInitialState({
  loadingStatus: 'not loaded',
  error: null,
});

export const tasksSlice = createSlice({
  name: TASKS_FEATURE_KEY,
  initialState: initialTasksState,
  reducers: {
    add: tasksAdapter.addOne,
    remove: tasksAdapter.removeOne,
    update: tasksAdapter.updateOne,
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchTasks.fulfilled, (state: TasksState, action: PayloadAction<any>) => {
      state.loadingStatus = 'loaded';
      tasksAdapter.addMany(state, action.payload.tasks);
    })
    .addMatcher<PendingAction>(
     (action) => action.type.endsWith("/pending"),
     (state: TasksState, action: PayloadAction<any>) => {
      state.loadingStatus = 'loading';
     })
    .addMatcher<RejectedAction>(
      (action) => action.type.endsWith("/rejected"),
      (state: TasksState, action: PayloadAction<any>) => {
       state.loadingStatus = 'error';
       state.error = action.payload;
    });
}});

/*
 * Export reducer for store configuration.
 */
export const tasksReducer = tasksSlice.reducer;

/*
 * Export action creators to be dispatched. For use with the `useDispatch` hook.
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(tasksActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const tasksActions = tasksSlice.actions;

/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *import { TasksAPI } from 'apps\p-frog\src\data\services\tasks.service';
import { TaskModel } from '@models';
import { Task } from '@schemas';
import { Response } from 'express';

 * // ...
 *
 * const entities = useSelector(selectAllTasks);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities } = tasksAdapter.getSelectors();

export const getTasksState = (rootState: RootState): TasksState =>
  rootState[TASKS_FEATURE_KEY];

export const selectAllTasks = createSelector(getTasksState, selectAll);

export const selectTasksEntities = createSelector(
  getTasksState,
  selectEntities
);

