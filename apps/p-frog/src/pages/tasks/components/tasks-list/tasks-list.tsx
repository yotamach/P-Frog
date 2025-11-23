import React, { useState } from 'react';
import { useTask,usePopper,useDialog } from '@hooks/index';
import { Loader, ModalPopper, Popup, Table } from '@components/index';
import { TopToolBarItem } from '@components/table/table';
import { Delete, Add, Edit } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { FormDateField, FormTextField } from '@components/form/FormFields';
import { Box, Button, DialogContentText, Grid } from '@mui/material';
import { Control } from 'react-hook-form';
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
  const { tasksList, isLoading, removeTask, editTask, addTask } = useTask(); 
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
    editTask(selectedRow?.original?.id, task);
    reset({});
    setOpenPopper(false);
    setSelectedRow(null);
  });

  const handleCreateClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPopper({
      component: TaskPoperContent({control, onSubmit: onAddTask, onCancel: () => setOpenPopper(false)}),
      title: 'Create Task',
      anchorEl: event.currentTarget
    });
    reset({});
    setOpenPopper(true);
  };

  const handleEditClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!selectedRow) return;
    setPopper({
      component: TaskPoperContent({control, onSubmit: onUpdateTask, onCancel: () => setOpenPopper(false)}),
      title: 'Edit Task',
      anchorEl: event.currentTarget
    });
    reset({ ...selectedRow.values });
    setOpenPopper(true);
  };

  const handleDeleteClick = () => {
    if (!selectedRow) return;
    setDialog({ 
      title: 'Delete Task', 
      content: getDeletePopupContent(), 
      data: selectedRow.original 
    });
    setOpenDialog(true);
  };


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
  }

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleCreateClick}
          className="px-4 py-2 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
          style={{ backgroundColor: 'hsl(var(--button-create))' }}
        >
          <Add fontSize="small" />
          Create Task
        </button>
        <button
          onClick={handleEditClick}
          disabled={!selectedRow}
          className="px-4 py-2 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            backgroundColor: selectedRow ? 'hsl(var(--button-edit))' : 'hsl(var(--button-disabled))'
          }}
        >
          <Edit fontSize="small" />
          Edit Task
        </button>
        <button
          onClick={handleDeleteClick}
          disabled={!selectedRow}
          className="px-4 py-2 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            backgroundColor: selectedRow ? 'hsl(var(--button-delete))' : 'hsl(var(--button-disabled))'
          }}
        >
          <Delete fontSize="small" />
          Delete Task
        </button>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ border: '1px solid hsl(var(--border))' }}>
        <Loader visible={isLoading} />
        <Popup 
          open={openDialog} 
          onClose={() => setOpenDialog(false)} 
          title={'Delete Task'} 
          content={getDeletePopupContent()} 
          actionsButtons={getDeletePopupActionsButtons()} 
        />
        <ModalPopper 
          placement={'bottom-start'} 
          anchorEl={anchorEl} 
          title={title} 
          open={openPopper} 
          component={component} 
        />
        <Table columns={columns} data={tasksList} onSelectRow={onSelectRow} />
      </div>
    </div>
  );
}