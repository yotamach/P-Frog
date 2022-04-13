import React, { useEffect, useState } from 'react';
import classes from './tasks-list.module.scss';
import { useTask,usePopper } from '@hooks/index';
import { Table } from '@components/index';
import { ColumnProps, TopToolBarItem } from '@components/table/table';
import { Delete, Add, Edit } from '@mui/icons-material';
import { ModalPopper } from '@components/popper/modal-popper';
import { useForm } from 'react-hook-form';
import { FormDateField, FormTextField } from '@components/form/FormFields';
import { Box, Button, Grid } from '@mui/material';
import { Control } from 'react-hook-form';
import { createTask } from '@data/store/tasks/tasks.slice';
import { useDispatch } from 'react-redux';
import { Task } from '@types';

export interface TasksListProps {
  prop?: string;
}

export function TasksList({ prop }: TasksListProps) {
  const { control, handleSubmit, reset } = useForm();
  const { tasksList, tasks, getTasks } = useTask(); 
  const { popper, open, setOpen, setPopper } = usePopper();
  const { component, anchorEl, title } = popper;
  const dispatch = useDispatch();
  useEffect(() => {
    getTasks();
  }, []);

  const onAddTask = handleSubmit((data: any) => {
    console.log(data);
    // const task: Task = {
    //   title: data.title,
    //   description: data.description,
    //   startDate: data.startDate.toString(),
    //   endDate: data.endDate.toString()
    // };
    // const tasy: Task = {
    //   title: "hoho",
    //   description: "bob?!?",
    //   startDate: "1985/2/5",
    //   endDate: "1999/2/5",
    // }
    // dispatch(createTask(tasy));

    reset({});
    setOpen(false);
  });

  const onCancel = () => {
    setOpen(false);
  }


  const getTopToolBar = (): TopToolBarItem[] => ([{
      icon: <Add fontSize="inherit" />,
      label: 'Add task',
      click: (event, rows) => { 
        setPopper({
          component: AddTaskPoperContent({control, onAddTask, onCancel}),
          title: 'Edit task',
          anchorEl: event.currentTarget
        });
        console.log('Add'); 
        console.log(rows); 
        setOpen(true); 
      }
    },
    {
      icon: <Edit fontSize="inherit" />,
      label: 'Edit task',
      click: (event) => { 
        setPopper({
          component: AddTaskPoperContent({control, onAddTask,onCancel}),
          title: 'Edit task',
          anchorEl: event.currentTarget
        });
        console.log('Edit'); 
        setOpen(true); 
      }
    },  
    {
      icon: <Delete fontSize="inherit" />,
      label: 'Delete task',
      click: (event) => { 
        console.log('Delete'); 
      }
    }]);


    const columns = React.useMemo(
      () => [
            {
              Header: 'Title',
              accessor: 'title',
            },
            {
              Header: 'Description',
              accessor: 'description',
            },
            {
              Header: 'Start date',
              accessor: 'startDate',
            },
            {
              Header: 'End date',
              accessor: 'endDate',
            },
          ],
      []
    )

  return (<div className={classes.tasksList}>
      <ModalPopper placement={'bottom-start'} anchorEl={anchorEl} title={title} open={open} component={component} />
      <Table topToolBar={getTopToolBar()} columns={columns} data={tasksList} />
    </div>);
}

const AddTaskPoperContent: React.FC<{ control: Control, onAddTask: any, onCancel: any }> = ({ control, onAddTask, onCancel }) => {
  return (<Box width={400}>
    <form onSubmit={onAddTask} >
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <FormTextField control={control} name={'title'} label='Title' />
        </Grid>
        <Grid item xs={6}>
          <FormTextField control={control} name={'description'} label='Description' />
        </Grid>
        <Grid item xs={6}>
          <FormDateField control={control} name={'startDate'} label='Start Date' />
        </Grid>
        <Grid item xs={6} mb={1}>
          <FormDateField control={control} name={'endDate'} label='End Date' />
        </Grid>
        <Grid item container xs={12} spacing={1} sx={{ justifyContent: 'space-between' }}>      
          <Grid item xs={2}>
            <Button type='submit' variant="contained" size="small" color="primary">OK</Button>
          </Grid> 
          <Grid item xs={2}>
            <Button type='button' onClick={onCancel} variant="outlined" size="small" color="secondary">Close</Button>
          </Grid> 
        </Grid>
      </Grid>
    </form>
  </Box>);
}