import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Task } from '@types';
import { TasksState, getTasksState, fetchTasks } from '@data/store/tasks/tasks.slice';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseTask {
  tasks: TasksState;
  getTasks: () => void;
  createTask: (task: Task) => any;
  tasksList: any[];
}

export function useTask(): UseTask {
  const tasks = useSelector(getTasksState);
  const dispatch = useDispatch();
  const getTasks = () => dispatch(fetchTasks());
  const createTask = (task: Task): any => dispatch(createTask(task));
  const tasksList = Object.entries(tasks.entities).map(([key, values]) => ({ key, values }));
  useEffect(() => {
    getTasks();
  }, []);
  return { tasksList, tasks, getTasks, createTask };
}

