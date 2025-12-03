import React, { useState } from 'react';
import { useTask,usePopper,useDialog } from '@hooks/index';
import { Loader, ModalPopper, Popup, Table } from '@components/index';
import { TopToolBarItem } from '@components/table/table';
import { useForm } from 'react-hook-form';
import { FormDateField, FormTextField } from '@components/form/FormFields';
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


  const getDeletePopupContent = () => (
    <p className="text-[0.95rem] leading-relaxed" style={{ color: 'hsl(var(--table-text))' }}>
      Are you sure you want to delete this task?
    </p>
  )

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

    return (
      <div className="w-[400px]">
        <form onSubmit={submit}>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <FormTextField control={control} name={'title'} label='Title' rules={Validators.required} />
            </div>
            <div>
              <FormTextField control={control} name={'description'} label='Description' rules={Validators.required} />
            </div>
            <div>
              <FormDateField control={control} name={'startDate'} label='Start Date' rules={Validators.required} />
            </div>
            <div>
              <FormDateField control={control} name={'endDate'} label='End Date' rules={Validators.required} />
            </div>
          </div>
          <div className="flex justify-between gap-3">
            <button 
              type='submit'
              className="px-6 py-2.5 text-white rounded-lg font-semibold text-sm border-none cursor-pointer transition-all duration-200"
              style={{ backgroundColor: 'hsl(var(--button-create))' }}
            >
              OK
            </button>
            <button 
              type='button' 
              onClick={onCancel}
              className="px-6 py-2.5 bg-white rounded-lg font-semibold text-sm cursor-pointer transition-all duration-200 border"
              style={{ 
                color: 'hsl(var(--sidebar-text))',
                borderColor: 'hsl(var(--border))'
              }}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    );
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
    <div className="flex flex-col gap-6">
      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handleCreateClick}
          className="flex items-center gap-2 px-5 py-3 text-white rounded-[0.625rem] font-semibold text-sm border-none cursor-pointer transition-all duration-200 shadow-md hover:-translate-y-0.5 hover:shadow-lg"
          style={{ backgroundColor: 'hsl(var(--button-create))' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create Task
        </button>
        <button
          onClick={handleEditClick}
          disabled={!selectedRow}
          className={`flex items-center gap-2 px-5 py-3 text-white rounded-[0.625rem] font-semibold text-sm border-none transition-all duration-200 ${
            selectedRow 
              ? 'cursor-pointer shadow-md hover:-translate-y-0.5 hover:shadow-lg' 
              : 'cursor-not-allowed opacity-50'
          }`}
          style={{ backgroundColor: selectedRow ? 'hsl(var(--button-edit))' : 'hsl(var(--button-disabled))' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          Edit Task
        </button>
        <button
          onClick={handleDeleteClick}
          disabled={!selectedRow}
          className={`flex items-center gap-2 px-5 py-3 text-white rounded-[0.625rem] font-semibold text-sm border-none transition-all duration-200 ${
            selectedRow 
              ? 'cursor-pointer shadow-md hover:-translate-y-0.5 hover:shadow-lg' 
              : 'cursor-not-allowed opacity-50'
          }`}
          style={{ backgroundColor: selectedRow ? 'hsl(var(--button-delete))' : 'hsl(var(--button-disabled))' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
          Delete Task
        </button>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-xl overflow-hidden border shadow-sm" style={{ borderColor: 'hsl(var(--border))' }}>
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