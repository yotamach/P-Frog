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

export const AUTH_FEATURE_KEY = 'auth';

const tasksAPI: TasksAPI = new TasksAPI();

export interface TasksState extends EntityState<Task> {
  loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
  error: string | null | undefined;
}

export const tasksAdapter = createEntityAdapter<Task>();

export const fetchTasks = createAsyncThunk(
  'auth/login',
  async (_, thunkAPI ) => {
    try{
      const response = await tasksAPI.fetchAll();
      return response.data;
    } catch(e: any) {
        return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

export const createTask = createAsyncThunk(
  'auth/signup',
  async (task: Task, thunkAPI) => {
    try{
      const response = await tasksAPI.create(task);
      return response.data;
    } catch(e: any) {
        return thunkAPI.rejectWithValue(e.response.data);
    }
  }
)

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id ,task }: {id: string, task: Task}, thunkAPI) => {
    try{
      const response = await tasksAPI.update(id, task);
      return { id, task: response.data.task };
    } catch(e: any) {
        return thunkAPI.rejectWithValue(e.response.data);
    }
  }
)

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string, thunkAPI) => {
    try{
      const response = await tasksAPI.delete(id);
      return response.data;
    } catch(e: any) {
        return thunkAPI.rejectWithValue(e.response.data);
    }
  }
)


export const initialTasksState: TasksState = tasksAdapter.getInitialState({
  loadingStatus: 'not loaded',
  error: null,
  statusMessage: null
});

export const tasksSlice = createSlice({
  name: AUTH_FEATURE_KEY,
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
    .addCase(createTask.fulfilled, (state: TasksState, action: PayloadAction<any>) => {
      state.loadingStatus = 'loaded';
      tasksAdapter.addOne(state, action.payload);
    })
    .addCase(updateTask.fulfilled, (state: TasksState, action: PayloadAction<any>) => {
      state.loadingStatus = 'loaded';
      const { id ,task } = action.payload;
      delete task.id;
      tasksAdapter.updateOne(state, { id, changes: task });
    })
    .addCase(deleteTask.fulfilled, (state: TasksState, action: PayloadAction<any>) => {
      state.loadingStatus = 'loaded';
      tasksAdapter.removeOne(state, action.payload.task.id);
    })
    .addMatcher<PendingAction>(
      (action) => action.type.endsWith("/pending"),
      (state: TasksState, action: PayloadAction<any>) => {
       state.loadingStatus = 'loading';
 
    })
    .addMatcher<RejectedAction>(
      (action) => action.type.endsWith("/rejected"),
      (state: TasksState, action: any) => {
       state.loadingStatus = 'error';
       state.error = action?.error;
    });
}});

export const tasksReducer = tasksSlice.reducer;

export const tasksActions = tasksSlice.actions;

const { selectAll, selectEntities } = tasksAdapter.getSelectors();

export const getTasksState = (rootState: RootState): TasksState =>
  rootState[AUTH_FEATURE_KEY];

export const selectAllTasks = createSelector(getTasksState, selectAll);

export const selectTasksEntities = createSelector(
  getTasksState,
  selectEntities
);

