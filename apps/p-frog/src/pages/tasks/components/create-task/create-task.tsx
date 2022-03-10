import React from 'react';
import classes from './create-task.module.scss';

export interface CreateTaskkProps {
  prop?: string;
}

export function CreateTask({prop = 'default value'}: CreateTaskkProps) {
  return <div className={classes.createTask}>create-task {prop}</div>;
}
