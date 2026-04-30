import * as React from 'react';
import { Project, Task, TaskStatus } from '@p-frog/data';
import { useCreateTask as useCreateTaskMutation } from '@data/queries/tasks.queries';
import { useDeleteTask as useDeleteTaskMutation } from '@data/queries/tasks.queries';
import { Button, Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@components/index';
import { useForm } from 'react-hook-form';
import { FormTextField, FormDateField, FormSelectField } from '@components/form/FormFields';
import { Validators } from '@data/index';
import { Plus, Trash2, Calendar, Clock } from 'lucide-react';
import { Badge } from '@components/ui/badge';

interface ProjectTasksProps {
  project: Project;
}

const statusOptions = [
  { value: TaskStatus.TODO, label: 'To Do' },
  { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
  { value: TaskStatus.DONE, label: 'Done' },
  { value: TaskStatus.CANCELLED, label: 'Cancelled' },
];

const statusVariant = {
  [TaskStatus.TODO]: 'secondary' as const,
  [TaskStatus.IN_PROGRESS]: 'info' as const,
  [TaskStatus.DONE]: 'success' as const,
  [TaskStatus.CANCELLED]: 'destructive' as const,
};

export const ProjectTasks: React.FC<ProjectTasksProps> = ({ project }) => {
  const [open, setOpen] = React.useState(false);
  const { control, handleSubmit, reset } = useForm<Task>();
  const createTask = useCreateTaskMutation();
  const deleteTask = useDeleteTaskMutation();

  const handleCreate = () => {
    const projectDueDate = project.dueDate ? new Date(project.dueDate) : new Date();
    projectDueDate.setDate(projectDueDate.getDate() - 1); // Default to one day before project due
    
    reset({
      title: '',
      description: '',
      startDate: new Date(),
      endDate: projectDueDate,
      status: TaskStatus.TODO,
      project: project.id
    });
    setOpen(true);
  };

  const onSubmit = (data: Task) => {
    createTask.mutate(
      { ...data, project: project.id },
      {
        onSuccess: () => {
          setOpen(false);
          reset({});
        }
      }
    );
  };

  const handleDelete = (taskId: string) => {
    if (window.confirm('Are you sure you want to remove this task from the project?')) {
      deleteTask.mutate(taskId);
    }
  };

  const projectTasks = project.tasks || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
          Tasks ({projectTasks.length})
        </h3>
        <Button
          onClick={handleCreate}
          size="sm"
          className="flex items-center gap-2"
          style={{
            backgroundColor: 'hsl(var(--button-create))',
            color: 'white',
          }}
        >
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      {projectTasks.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <p style={{ color: 'hsl(var(--muted-foreground))' }}>
            No tasks yet. Create your first task!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {projectTasks.map((task: any) => {
            const taskObj = typeof task === 'object' ? task : { id: task };
            return (
              <div
                key={taskObj.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                style={{ backgroundColor: 'hsl(var(--card))' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                        {taskObj.title || 'Task'}
                      </h4>
                      {taskObj.status && (
                        <Badge variant={statusVariant[taskObj.status as TaskStatus]}>
                          {taskObj.status}
                        </Badge>
                      )}
                    </div>
                    {taskObj.description && (
                      <p className="text-sm mb-2" style={{ color: 'hsl(var(--muted-foreground))' }}>
                        {taskObj.description}
                      </p>
                    )}
                    {taskObj.endDate && (
                      <div className="flex items-center gap-1 text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                        <Calendar className="w-3 h-3" />
                        Due: {new Date(taskObj.endDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(taskObj.id)}
                    className="p-2 rounded-md hover:bg-destructive/10 transition-colors"
                    title="Remove task"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Add Task to {project.title}</DrawerTitle>
            <DrawerDescription>
              Create a new task for this project. {project.dueDate && `Task end date must be before ${new Date(project.dueDate).toLocaleDateString()}.`}
            </DrawerDescription>
          </DrawerHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="px-4">
            <div className="space-y-4">
              <FormTextField
                name="title"
                control={control}
                label="Title"
                rules={Validators.required}
              />

              <FormTextField
                name="description"
                control={control}
                label="Description"
                rules={Validators.required}
              />

              <FormSelectField
                name="status"
                control={control}
                label="Status"
                options={statusOptions}
                rules={Validators.required}
              />

              <FormDateField
                name="startDate"
                control={control}
                label="Start Date"
                rules={Validators.required}
              />

              <FormDateField
                name="endDate"
                control={control}
                label="End Date"
                rules={{
                  required: 'End date is required',
                  validate: (value: string | Date) => {
                    if (!project.dueDate) return true;
                    const taskEndDate = new Date(value);
                    const projectDueDate = new Date(project.dueDate);
                    if (taskEndDate > projectDueDate) {
                      return `Task end date must be before project due date (${projectDueDate.toLocaleDateString()})`;
                    }
                    return true;
                  }
                }}
              />

              <div className="text-xs p-2 rounded" style={{ backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))' }}>
                <Clock className="w-3 h-3 inline mr-1" />
                Project due date: {project.dueDate && new Date(project.dueDate).toLocaleDateString()}
              </div>
            </div>

            <DrawerFooter className="px-0">
              <Button 
                type="submit"
                disabled={createTask.isPending}
                style={{
                  backgroundColor: 'hsl(var(--button-create))',
                  color: 'white',
                }}
                className="w-full py-2 rounded-md hover:opacity-90 transition-opacity"
              >
                Create Task
              </Button>
              <DrawerClose asChild>
                <Button 
                  type="button" 
                  variant="outline"
                  className="w-full"
                >
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default ProjectTasks;
