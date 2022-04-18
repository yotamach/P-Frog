import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TasksState, getTasksState, fetchTasks, deleteTask, createTask } from '@data/store/tasks/tasks.slice';
import { useSnackbar } from 'notistack';
import { Task } from '@types';

export interface UseTask {
  tasks: TasksState;
  getTasks: () => void;
  removeTask: (id: string) => void;
  addTask: (task: Task) => void;
  tasksList: any[];
}



export function useTask(): UseTask {
  const { enqueueSnackbar } = useSnackbar();
  const tasks = useSelector(getTasksState);
  const dispatch = useDispatch();
  const getTasks = () => dispatch(fetchTasks());
  const addTask = (task: Task) => { dispatch(createTask(task)) };
  const removeTask = (id: string) => { dispatch(deleteTask(id)) };
  const tasksList = Object.entries(tasks.entities).map(([key, values]) => ({ key, ...values }));
  useEffect(() => {
    getTasks();
  }, []);
  const { loadingStatus, statusMessage } = tasks;
  useEffect(() => {
      if(statusMessage && (loadingStatus === 'loaded' || loadingStatus || 'error'))
      {
        const { message, type: variant } = statusMessage;
        enqueueSnackbar(message, { variant });
      }
  },[loadingStatus]);

  return { tasksList, tasks, getTasks, addTask, removeTask };
}

