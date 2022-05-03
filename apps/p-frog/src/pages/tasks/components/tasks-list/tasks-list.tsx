import React, { useState } from 'react';
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
import { Validators } from '@data/index';
import { Row } from 'react-table';

export interface TasksListProps {
  prop?: string;
}

export function TasksList({ prop }: TasksListProps) {
  const { control, handleSubmit, reset } = useForm();
  const [ selectedRow, setSelectedRow ] = useState<Row<any> | null>(null);
  const { tasksList, tasks, removeTask, editTask, addTask } = useTask(); 
  const { popper, open: openPopper, setOpen: setOpenPopper, setPopper } = usePopper();
  const { setDialog, setOpen: setOpenDialog, dialog, open: openDialog } = useDialog();
  const { component, anchorEl, title } = popper;
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
    setSelectedRow(null);
  });

  const onUpdateTask = handleSubmit((data: any) => {
    const task: Task = {
      title: data.title,
      description: data.description,
      startDate: data.startDate.toString(),
      endDate: data.endDate.toString()
    };
    console.log(selectedRow);
    console.log(selectedRow?.original?.id);
    editTask(selectedRow?.original?.id,task);
    reset({});
    setOpenPopper(false);
    setSelectedRow(null);
  });

  const onCancel = () => {
    setOpenPopper(false);
  }


  const getTopToolBar = (): TopToolBarItem[] => ([{
      icon: <Add fontSize="inherit" />,
      label: 'Add task',
      click: (event, rows) => { 
        setPopper({
          component: TaskPoperContent({control, onSubmit: onAddTask, onCancel, row: rows[0]}),
          title: 'Edit task',
          anchorEl: event.currentTarget
        })
        reset({});
        setOpenPopper(true); 
        
      }
    },
    {
      icon: <Edit fontSize="inherit" />,
      label: 'Edit task',
      disabled: !selectedRow,
      click: (event, rows) => { 
        setPopper({
          component: TaskPoperContent({control, onSubmit: onUpdateTask, onCancel}),
          title: 'Edit task',
          anchorEl: event.currentTarget
        });
        setSelectedRow(rows[0]);
        reset({ ...rows[0].values });
        setOpenPopper(true); 
      }
    },  
    {
      icon: <Delete fontSize="inherit" />,
      label: 'Delete task',
      disabled: !selectedRow,
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
        removeTask(dialog.data.key);
        setOpenDialog(false);
        setSelectedRow(null);
      }
    },
    {
      title: 'Cancel',
      onClick: () => {
        setOpenDialog(false);
      }
    }
  ])

  const TaskPoperContent: React.FC<{ control: Control, onSubmit: any, onCancel: any, row?: Row<object> }> = ({ control, onSubmit, onCancel, row }) => {
    const submit = (event: any) => {
      event.preventDefault();
      onSubmit(row);
    };

    return (<Box width={400}>
      <form onSubmit={submit} >
        <Grid container spacing={1}>
          <Grid item xs={6} pb={1}>
            <FormTextField control={control} name={'title'} label='Title' rules={Validators.required} />
          </Grid>
          <Grid item xs={6} pb={1}>
            <FormTextField control={control} name={'description'} label='Description' rules={Validators.required} />
          </Grid>
          <Grid item xs={6} pb={1}>
            <FormDateField control={control} name={'startDate'} label='Start Date' rules={Validators.required} />
          </Grid>
          <Grid item xs={6} mb={1} pb={1}>
            <FormDateField control={control} name={'endDate'} label='End Date' rules={Validators.required} />
          </Grid>
          <Grid item container xs={12} spacing={1} sx={{ justifyContent: 'space-between' }}>      
            <Grid item xs={2}>
              <Button type='submit' variant="contained" size="medium" color="primary">OK</Button>
            </Grid> 
            <Grid item xs={2}>
              <Button type='button' onClick={onCancel} variant="outlined" size="medium" color="secondary">Close</Button>
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


  const onSelectRow = async (row: Row<object> | null) =>{
    setSelectedRow(row);
    console.log(row);
  }

  return (<div className={classes.tasksList}>
      <Loader visible={tasks.loadingStatus === 'loading'} />
      <Popup open={openDialog} onClose={() => setOpenDialog(false)} title={'Delete Task'} content={getDeletePopupContent()} actionsButtons={getDeletePopupActionsButtons()} />
      <ModalPopper placement={'bottom-start'} anchorEl={anchorEl} title={title} open={openPopper} component={component} />
      <Table topToolBar={getTopToolBar()} columns={columns} data={tasksList} onSelectRow={onSelectRow} />
    </div>);
}