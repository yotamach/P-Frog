import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction
} from '@reduxjs/toolkit';
import { PendingAction, RejectedAction, Task } from '@types';
import { VariantType } from 'notistack';
import { TasksAPI } from '../../services';
import { RootState } from '../store';

export const TASKS_FEATURE_KEY = 'tasks';

const tasksAPI: TasksAPI = new TasksAPI();

type StatusMessage = {
  type: VariantType,
  message: string;
};

export interface TasksState extends EntityState<Task> {
  loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
  statusMessage: StatusMessage | null;
  error: string | null | undefined;
}

export const tasksAdapter = createEntityAdapter<Task>();

export const fetchTasks = createAsyncThunk(
  'tasks/fechtAll',
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
  'tasks/createTask',
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
    .addCase(createTask.fulfilled, (state: TasksState, action: PayloadAction<any>) => {
      state.loadingStatus = 'loaded';
      tasksAdapter.addOne(state, action.payload);
      state.statusMessage = { type: 'success', message: 'Task added successfuly!' }
    })
    .addCase(updateTask.fulfilled, (state: TasksState, action: PayloadAction<any>) => {
      state.loadingStatus = 'loaded';
      const { id ,task } = action.payload;
      delete task.id;
      tasksAdapter.updateOne(state, { id, changes: task });
      state.statusMessage = { type: 'success', message: 'Task updated successfuly!' }
    })
    .addCase(deleteTask.fulfilled, (state: TasksState, action: PayloadAction<any>) => {
      state.loadingStatus = 'loaded';
      tasksAdapter.removeOne(state, action.payload.task.id);
      state.statusMessage = { type: 'success', message: 'Task removed successfuly!' }
    })
    .addMatcher<PendingAction>(
      (action) => action.type.endsWith("/pending"),
      (state: TasksState, action: PayloadAction<any>) => {
       state.loadingStatus = 'loading';
       state.statusMessage = null;
 
    })
    .addMatcher<RejectedAction>(
      (action) => action.type.endsWith("/rejected"),
      (state: TasksState, action: any) => {
       state.loadingStatus = 'error';
       state.error = action?.error;
       state.statusMessage = { type: 'error', message: String(action?.error?.message) }
    });
}});

export const tasksReducer = tasksSlice.reducer;

export const tasksActions = tasksSlice.actions;

const { selectAll, selectEntities } = tasksAdapter.getSelectors();

export const getTasksState = (rootState: RootState): TasksState =>
  rootState[TASKS_FEATURE_KEY];

export const selectAllTasks = createSelector(getTasksState, selectAll);

export const selectTasksEntities = createSelector(
  getTasksState,
  selectEntities
);

