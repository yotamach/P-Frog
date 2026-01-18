import * as React from 'react';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@data/queries/tasks.queries';
import {
  Table,
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  TopBarTable,
} from '@components/index';
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from '@tanstack/react-table';
import { Task } from '@types';
import { useForm } from 'react-hook-form';
import { FormTextField, FormDateField } from '@components/form/FormFields';
import { Validators } from '@data/index';


const TasksList: React.FC = () => {
  const { data: tasks, isLoading, isError } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [open, setOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [searchValue, setSearchValue] = React.useState('');
  const { control, handleSubmit, reset } = useForm<Task>();

  const handleEdit = (task: Task) => {
    reset(task);
    setEditingTask(task);
    setOpen(true);
  };

  const handleRowClick = (task: Task) => {
    setSelectedTask(selectedTask?.id === task.id ? null : task);
  };

  const handleTopBarEdit = () => {
    if (selectedTask) {
      handleEdit(selectedTask);
    }
  };

  const handleDelete = () => {
    if (selectedTask?.id) {
      if (window.confirm('Are you sure you want to delete this task?')) {
        deleteTask.mutate(String(selectedTask.id), {
          onSuccess: () => {
            setSelectedTask(null);
          }
        });
      }
    }
  };

  const filteredTasks = React.useMemo(() => {
    if (!tasks) return [];
    if (!searchValue) return tasks;
    
    const search = searchValue.toLowerCase();
    return tasks.filter(task => 
      task.title?.toLowerCase().includes(search) ||
      task.description?.toLowerCase().includes(search)
    );
  }, [tasks, searchValue]);

  // Clear selection if selected task is no longer in filtered results
  React.useEffect(() => {
    if (selectedTask && filteredTasks.length > 0) {
      const stillExists = filteredTasks.some(task => task.id === selectedTask.id);
      if (!stillExists) {
        setSelectedTask(null);
      }
    }
  }, [filteredTasks, selectedTask]);

  const columns: ColumnDef<Task, any>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'startDate',
      header: 'Start Date',
      cell: (info) => {
        const value = info.getValue() as string | undefined;
        return value ? new Date(value).toLocaleDateString() : '-';
      },
    },
    {
      accessorKey: 'endDate',
      header: 'End Date',
      cell: (info) => {
        const value = info.getValue() as string | undefined;
        return value ? new Date(value).toLocaleDateString() : '-';
      },
    },
  ];

  const table = useReactTable<Task>({
    data: filteredTasks || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const onSubmit = (data: Task) => {
    if (editingTask && editingTask.id) {
      updateTask.mutate(
        {
          id: String(editingTask.id),
          task: data
        },
        {
          onSuccess: () => {
            setOpen(false);
            reset();
            setEditingTask(null);
          }
        }
      );
    } else {
      createTask.mutate(data, {
        onSuccess: () => {
          setOpen(false);
          reset();
          setEditingTask(null);
        }
      });
    }
  };

  const handleCreate = () => {
    reset({});
    setEditingTask(null);
    setSelectedTask(null);
    setOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-destructive">Error loading tasks</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TopBarTable 
        onCreateClick={handleCreate}
        onEditClick={handleTopBarEdit}
        onDeleteClick={handleDelete}
        onSearchChange={setSearchValue}
        searchValue={searchValue}
        searchPlaceholder="Search tasks..."
        hasSelection={!!selectedTask}
        selectedItemTitle={selectedTask?.title}
      />
      
      <Drawer open={open} onOpenChange={setOpen} direction="right">
        <DrawerContent style={{ backgroundColor: 'hsl(var(--color-background))' }}>
          <DrawerHeader style={{ borderBottom: '1px solid hsl(var(--color-border))' }}>
            <DrawerTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DrawerTitle>
            <DrawerDescription>
              {editingTask ? 'Update task details below' : 'Fill in the details to create a new task'}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <form id="task-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormTextField 
                control={control} 
                name="title" 
                label="Title" 
                rules={Validators.required} 
              />
              <FormTextField 
                control={control} 
                name="description" 
                label="Description" 
                rules={Validators.required} 
              />
              <FormDateField 
                control={control} 
                name="startDate" 
                label="Start Date" 
                rules={Validators.required} 
              />
              <FormDateField 
                control={control} 
                name="endDate" 
                label="End Date" 
                rules={Validators.required} 
              />
            </form>
          </div>
          <DrawerFooter>
            <Button type="submit" form="task-form">
              {editingTask ? 'Update' : 'Create'}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <div className="rounded-lg border bg-card shadow-sm">
      <Table.Table>
        <Table.TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </Table.TableHead>
              ))}
            </Table.TableRow>
          ))}
        </Table.TableHeader>
        <Table.TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <Table.TableRow 
                key={row.id}
                onClick={() => handleRowClick(row.original)}
                className="cursor-pointer transition-colors hover:bg-muted/50"
                style={{
                  backgroundColor: selectedTask?.id === row.original.id 
                    ? 'hsl(var(--color-accent))' 
                    : undefined,
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <Table.TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.TableCell>
                ))}
              </Table.TableRow>
            ))
          ) : (
            <Table.TableRow>
              <Table.TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                No tasks available
              </Table.TableCell>
            </Table.TableRow>
          )}
        </Table.TableBody>
      </Table.Table>
      </div>
    </div>
  );
};

export default TasksList;