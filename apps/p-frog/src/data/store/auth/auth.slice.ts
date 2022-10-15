import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import { PendingAction, RejectedAction, Task } from '@types';
import { TasksAPI } from '../../services';
import { RootState } from '../store';

export const AUTH_FEATURE_KEY = 'auth';

const tasksAPI: TasksAPI = new TasksAPI();

export interface AuthState {
  loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
  error: string | null | undefined;
  isAuth: boolean;
  statusMessage?: any;
}

export const Login = createAsyncThunk(
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

export const SignUp = createAsyncThunk(
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

export const SignOut = createAsyncThunk(
  'auth/signout',
  async (id: string, thunkAPI) => {
    try{
      const response = await tasksAPI.delete(id);
      return response.data;
    } catch(e: any) {
        return thunkAPI.rejectWithValue(e.response.data);
    }
  }
)


export const initialAuthState: AuthState = {
  loadingStatus: 'not loaded',
  error: null,
  isAuth: false,
  statusMessage: null
};

export const authSlice = createSlice({
  name: AUTH_FEATURE_KEY,
  initialState: initialAuthState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(Login.fulfilled, (state: AuthState, action: PayloadAction<any>) => {
      state.loadingStatus = 'loaded';
      state.error = null;
      state.isAuth = true;
    })
    .addCase(SignOut.fulfilled, (state: AuthState, action: PayloadAction<any>) => {
      state.loadingStatus = 'loaded';
      state.error = null;
      state.isAuth = false;
    })
    .addCase(SignUp.fulfilled, (state: AuthState, action: PayloadAction<any>) => {
      state.loadingStatus = 'loaded';
      state.error = null;
      state.isAuth = false;
    })
    .addMatcher<PendingAction>(
      (action) => action.type.endsWith("/pending"),
      (state: AuthState, action: PayloadAction<any>) => {
       state.loadingStatus = 'loading';
 
    })
    .addMatcher<RejectedAction>(
      (action) => action.type.endsWith("/rejected"),
      (state: AuthState, action: any) => {
       state.loadingStatus = 'error';
       state.error = action?.error;
    });
}});

export const authReducer = authSlice.reducer;

export const authActions = authSlice.actions;


export const getAuthsState = (rootState: RootState): AuthState =>
  rootState[AUTH_FEATURE_KEY];

export const isAuth = createSelector(
  getAuthsState,((state: AuthState) => state.isAuth)
);

