import React from 'react';
import classes from './tasks-list.module.scss';
import { useTask,usePopper,useDialog } from '@hooks/index';
import { Loader, ModalPopper, Popup, Table } from '@components/index';
import { TopToolBarItem } from '@components/table/table';
import { Delete, Add, Edit } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { FormDateField, FormTextField } from '@components/form/FormFields';
import { Box, Button, DialogContentText, Grid } from '@mui/material';
import { Control } from 'react-hook-form';
import { createTask } from '@data/store/tasks/tasks.slice';
import { useDispatch } from 'react-redux';
import { Task } from '@types';
import { ActionButton } from '@components/popup/popup';

export interface TasksListProps {
  prop?: string;
}

export function TasksList({ prop }: TasksListProps) {
  const { control, handleSubmit, reset } = useForm();
  const { tasksList, tasks, removeTask, addTask } = useTask(); 
  const { popper, open: openPopper, setOpen: setOpenPopper, setPopper } = usePopper();
  const { setDialog, setOpen: setOpenDialog, dialog, open: openDialog } = useDialog();
  const { component, anchorEl, title } = popper;
  const dispatch = useDispatch();

  const onAddTask = handleSubmit((data: any) => {
    const task: Task = {
      title: data.title,
      description: data.description,
      startDate: data.startDate.toString(),
      endDate: data.endDate.toString()
    };
    addTask(task);
    reset({});
    setOpenPopper(false);
  });

  const onCancel = () => {
    setOpenPopper(false);
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
        setOpenPopper(true); 
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
        setOpenPopper(true); 
      }
    },  
    {
      icon: <Delete fontSize="inherit" />,
      label: 'Delete task',
      click: (event, rows) => { 
        setDialog({ title: 'Delete Task', content: getDeletePopupContent(), data: rows[0].original });
        setOpenDialog(true);
        console.log('Delete'); 
      }
    }]);


  const getDeletePopupContent = () => (<DialogContentText>Are you sure you want to delete This Task?</DialogContentText>)

  const getDeletePopupActionsButtons = (): ActionButton[] => ([
    {
      title: 'Delete',
      onClick: () => {
        console.log(dialog.data)
        removeTask(dialog.data.key);
        setOpenDialog(false);
      }
    },
    {
      title: 'Cancel',
      onClick: () => {
        setOpenDialog(false);
      }
    }
  ])

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
      []);

  return (<div className={classes.tasksList}>
      <Loader visible={tasks.loadingStatus === 'loading'} />
      <Popup open={openDialog} onClose={() => setOpenDialog(false)} title={'Delete Task'} content={getDeletePopupContent()} actionsButtons={getDeletePopupActionsButtons()} />
      <ModalPopper placement={'bottom-start'} anchorEl={anchorEl} title={title} open={openPopper} component={component} />
      <Table topToolBar={getTopToolBar()} columns={columns} data={tasksList} />
    </div>);
}