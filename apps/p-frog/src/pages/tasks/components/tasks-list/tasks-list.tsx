import * as React from 'react';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@data/queries/tasks.queries';
import { useProjects } from '@data/queries/projects.queries';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
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
import { Badge } from '@components/ui/badge';
import { Circle, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from '@tanstack/react-table';
import { Task, TaskStatus, Project } from '@p-frog/data';
import { useForm } from 'react-hook-form';
import { FormTextField, FormDateField, FormSelectField } from '@components/form/FormFields';
import { Validators } from '@data/index';

const statusOptions = [
  { value: TaskStatus.TODO, label: 'To Do' },
  { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
  { value: TaskStatus.DONE, label: 'Done' },
  { value: TaskStatus.CANCELLED, label: 'Cancelled' },
];


const TasksList: React.FC = () => {
  const { data: tasks, isLoading, isError } = useTasks();
  const { data: projects } = useProjects();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [open, setOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [searchValue, setSearchValue] = React.useState('');
  const { control, handleSubmit, reset, watch } = useForm<Task>();
  
  const selectedProjectId = watch('project');
  const selectedProject = React.useMemo(() => {
    if (!selectedProjectId || !projects) return null;
    return projects.find(p => p.id === selectedProjectId);
  }, [selectedProjectId, projects]);

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
      accessorKey: 'project',
      header: 'Project',
      cell: (info) => {
        const project = info.getValue() as Project | undefined;
        if (!project) return <span className="text-muted-foreground">-</span>;
        return (
          <Badge variant="secondary">
            {typeof project === 'object' ? project.title : project}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => {
        const status = info.getValue() as TaskStatus;
        const statusConfig = {
          [TaskStatus.TODO]: {
            label: 'To Do',
            variant: 'secondary' as const,
            icon: Circle,
          },
          [TaskStatus.IN_PROGRESS]: {
            label: 'In Progress',
            variant: 'info' as const,
            icon: Clock,
          },
          [TaskStatus.DONE]: {
            label: 'Done',
            variant: 'success' as const,
            icon: CheckCircle2,
          },
          [TaskStatus.CANCELLED]: {
            label: 'Cancelled',
            variant: 'destructive' as const,
            icon: XCircle,
          },
        };
        const config = statusConfig[status] || {
          label: status,
          variant: 'outline' as const,
          icon: Circle,
        };
        const IconComponent = config.icon;
        return (
          <Badge variant={config.variant}>
            <IconComponent className="w-3 h-3" />
            {config.label}
          </Badge>
        );
      },
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
    {
      accessorKey: 'created_at',
      header: 'Created',
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
        <DrawerContent>
          <DrawerHeader className="border-b border-border">
            <DrawerTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DrawerTitle>
            <DrawerDescription>
              {editingTask ? 'Update task details below' : 'Fill in the details to create a new task'}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 flex-1 bg-card">
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
              <FormSelectField 
                control={control} 
                name="project" 
                label="Project (Optional)" 
                options={[
                  { value: '', label: 'No Project' },
                  ...(projects || []).map(p => ({ value: String(p.id || ''), label: p.title }))
                ]}
              />
              <FormSelectField 
                control={control} 
                name="status" 
                label="Status" 
                options={statusOptions}
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
                rules={{
                  required: 'End date is required',
                  validate: (value: string | Date) => {
                    if (!selectedProject || !selectedProject.dueDate) return true;
                    const taskEndDate = new Date(value);
                    const projectDueDate = new Date(selectedProject.dueDate);
                    if (taskEndDate > projectDueDate) {
                      return `Task end date must be before project due date (${new Date(selectedProject.dueDate).toLocaleDateString()})`;
                    }
                    return true;
                  }
                }}
              />
              {selectedProject && selectedProject.dueDate && (
                <div className="text-xs p-2 rounded bg-muted text-muted-foreground">
                  Project due date: {new Date(selectedProject.dueDate).toLocaleDateString()}
                </div>
              )}
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
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => handleRowClick(row.original)}
                className="cursor-pointer"
                data-state={selectedTask?.id === row.original.id ? 'selected' : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                No tasks available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>
    </div>
  );
};

export default TasksList;