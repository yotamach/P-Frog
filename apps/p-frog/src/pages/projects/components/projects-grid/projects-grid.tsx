import * as React from 'react';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '@data/queries/projects.queries';
import { Project, ProjectPriority } from '@p-frog/data';
import { ProjectCard } from '../project-card/project-card';
import { Button, Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@components/index';
import { useForm } from 'react-hook-form';
import { FormTextField, FormDateField, FormSelectField, FormTextAreaField } from '@components/form/FormFields';
import { Validators } from '@data/index';
import { Plus, Search } from 'lucide-react';

const priorityOptions = [
  { value: ProjectPriority.LOW, label: 'Low' },
  { value: ProjectPriority.MEDIUM, label: 'Medium' },
  { value: ProjectPriority.HIGH, label: 'High' },
  { value: ProjectPriority.CRITICAL, label: 'Critical' },
];

export const ProjectsGrid: React.FC = () => {
  const { data: projects, isLoading, isError } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const [open, setOpen] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<Project | null>(null);
  const [searchValue, setSearchValue] = React.useState('');
  const { control, handleSubmit, reset } = useForm<Project>();

  const handleEdit = (project: Project) => {
    reset(project);
    setEditingProject(project);
    setOpen(true);
  };

  const handleDelete = (project: Project) => {
    if (project.id) {
      if (window.confirm(`Are you sure you want to delete "${project.title}"?`)) {
        deleteProject.mutate(String(project.id));
      }
    }
  };

  const handleCreate = () => {
    reset({
      title: '',
      description: '',
      dueDate: new Date(),
      priority: ProjectPriority.MEDIUM,
      tasks: []
    });
    setEditingProject(null);
    setOpen(true);
  };

  const onSubmit = (data: Project) => {
    if (editingProject?.id) {
      updateProject.mutate(
        { id: String(editingProject.id), project: data },
        {
          onSuccess: () => {
            setOpen(false);
            reset({});
          }
        }
      );
    } else {
      createProject.mutate(data, {
        onSuccess: () => {
          setOpen(false);
          reset({});
        }
      });
    }
  };

  const filteredProjects = React.useMemo(() => {
    if (!projects) return [];
    if (!searchValue) return projects;
    
    const search = searchValue.toLowerCase();
    return projects.filter(project => 
      project.title?.toLowerCase().includes(search) ||
      project.description?.toLowerCase().includes(search)
    );
  }, [projects, searchValue]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-16">
        <div 
          className="w-10 h-10 border-4 rounded-full animate-spin" 
          style={{
            borderColor: 'hsl(var(--border))',
            borderTopColor: 'hsl(var(--sidebar-active))'
          }}
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-8">
        <p className="text-destructive">Failed to load projects. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2"
            style={{ 
              borderColor: 'hsl(var(--border))',
              backgroundColor: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))'
            }}
          />
        </div>
        
        <Button
          onClick={handleCreate}
          style={{
            backgroundColor: 'hsl(var(--button-create))',
            color: 'white',
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center p-16">
          <p style={{ color: 'hsl(var(--muted-foreground))' }}>
            {searchValue ? 'No projects found matching your search.' : 'No projects yet. Create your first project!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Drawer */}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{editingProject ? 'Edit Project' : 'Create New Project'}</DrawerTitle>
            <DrawerDescription>
              {editingProject ? 'Update the project details below.' : 'Fill in the details to create a new project.'}
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

              <FormTextAreaField
                name="description"
                control={control}
                label="Description"
                rules={Validators.required}
              />

              <FormDateField
                name="dueDate"
                control={control}
                label="Due Date"
                rules={Validators.required}
              />

              <FormSelectField
                name="priority"
                control={control}
                label="Priority"
                options={priorityOptions}
                rules={Validators.required}
              />
            </div>

            <DrawerFooter className="px-0">
              <Button 
                type="submit"
                disabled={createProject.isPending || updateProject.isPending}
                style={{
                  backgroundColor: 'hsl(var(--button-create))',
                  color: 'white',
                }}
                className="w-full py-2 rounded-md hover:opacity-90 transition-opacity"
              >
                {editingProject ? 'Update Project' : 'Create Project'}
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

export default ProjectsGrid;
