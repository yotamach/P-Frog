import { useSelector, useDispatch } from 'react-redux';
import { TasksState, getTasksState, fetchTasks, deleteTask, createTask, updateTask } from '@data/store/tasks/tasks.slice';
import { Task } from '@types';
import { useMemo } from 'react';

export interface UseTask {
  tasks: TasksState;
  getTasks: () => void;
  removeTask: (id: string) => void;
  editTask: (id: string, task: Task) => void;
  addTask: (task: Task) => void;
  tasksList: any[];
}



export function useTask(): UseTask {
  const tasks = useSelector(getTasksState);
  const dispatch = useDispatch();
  const getTasks = () => dispatch(fetchTasks());
  const addTask = (task: Task) => { dispatch(createTask(task)) };
  const editTask = useMemo(() =>(id: string, task: Task) => { dispatch(updateTask({id, task})) }, []);
  const removeTask = (id: string) => { dispatch(deleteTask(id)) };
  const tasksList = useMemo(() => Object.entries(tasks.entities).map(([key, values]) => ({ key, ...values })),[tasks]);

  return { tasksList, tasks, getTasks, addTask, editTask, removeTask };
}

