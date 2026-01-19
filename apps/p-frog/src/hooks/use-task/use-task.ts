import { Task } from '@p-frog/data';
import { useMemo } from 'react';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@data/queries/tasks.queries';

export interface UseTask {
  tasks: Task[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  getTasks: () => void;
  removeTask: (id: string) => void;
  editTask: (id: string, task: Task) => void;
  addTask: (task: Task) => void;
  tasksList: any[];
}

export function useTask(): UseTask {
  const { data: tasks = [], isLoading, isError, error, refetch } = useTasks();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const getTasks = () => refetch();
  const addTask = (task: Task) => createTaskMutation.mutate(task);
  const editTask = (id: string, task: Task) => updateTaskMutation.mutate({ id, task });
  const removeTask = (id: string) => deleteTaskMutation.mutate(id);
  
  const tasksList = useMemo(() => 
    tasks.map((task) => ({ key: task.id, ...task })),
    [tasks]
  );

  return { 
    tasksList, 
    tasks,
    isLoading,
    isError,
    error,
    getTasks, 
    addTask, 
    editTask, 
    removeTask 
  };
}

