import React, { useEffect } from 'react';
import classes from './tasks-list.module.scss';
import { useTask } from '@hooks/index';
import { Table } from '@components/index';
import { ColumnProps } from '@components/table/table';

export interface TasksListProps {
  prop?: string;
}



export function TasksList({ prop }: TasksListProps) {
  const { tasksList, tasks, getTasks } = useTask(); 

  useEffect(() => {
    getTasks();
  }, []);

  const getColumns = (): ColumnProps[] => [
    { title: 'Title', align: 'left', field: 'title' },
    { title: 'Description', align: 'left', field: 'description' },
    { title: 'Start date', align: 'left', field: 'startDate' },
    { title: 'End date', align: 'left', field: 'endDate' },
  ];

  return (<div className={classes.tasksList}>
      <Table columns={getColumns()} data={tasksList} />
    </div>);
}
