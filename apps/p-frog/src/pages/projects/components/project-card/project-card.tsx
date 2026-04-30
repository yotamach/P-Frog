import * as React from 'react';
import { Project, ProjectPriority, TaskStatus } from '@p-frog/data';
import { Calendar, List, AlertCircle, Trash2, Edit, Circle, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@components/ui/badge';
import { Card } from '@components/ui/card';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

const priorityVariant: Record<string, 'info' | 'warning' | 'destructive' | 'success'> = {
  [ProjectPriority.LOW]: 'info',
  [ProjectPriority.MEDIUM]: 'warning',
  [ProjectPriority.HIGH]: 'warning',
  [ProjectPriority.CRITICAL]: 'destructive',
};

const priorityAccent: Record<string, 'accent' | 'warning' | 'destructive' | 'primary'> = {
  [ProjectPriority.LOW]: 'accent',
  [ProjectPriority.MEDIUM]: 'warning',
  [ProjectPriority.HIGH]: 'warning',
  [ProjectPriority.CRITICAL]: 'destructive',
};

const statusConfig: Record<string, { label: string; icon: typeof Circle; variant: 'secondary' | 'info' | 'success' | 'destructive' }> = {
  [TaskStatus.TODO]: { label: 'To Do', icon: Circle, variant: 'secondary' },
  [TaskStatus.IN_PROGRESS]: { label: 'In Progress', icon: Clock, variant: 'info' },
  [TaskStatus.DONE]: { label: 'Done', icon: CheckCircle2, variant: 'success' },
  [TaskStatus.CANCELLED]: { label: 'Cancelled', icon: XCircle, variant: 'destructive' },
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = project.dueDate ? new Date(project.dueDate) < new Date() : false;

  // Calculate task counts by status
  const taskCounts = React.useMemo(() => {
    if (!project.tasks || project.tasks.length === 0) return null;

    const counts: Record<TaskStatus, number> = {
      [TaskStatus.TODO]: 0,
      [TaskStatus.IN_PROGRESS]: 0,
      [TaskStatus.DONE]: 0,
      [TaskStatus.CANCELLED]: 0,
    };

    project.tasks.forEach((task: any) => {
      if (task && typeof task === 'object' && task.status) {
        counts[task.status as TaskStatus]++;
      }
    });

    return counts;
  }, [project.tasks]);

  // Compute progress percentage based on completed tasks
  const progress = React.useMemo(() => {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const total = project.tasks.length;
    const done = project.tasks.filter((t: any) =>
      t && typeof t === 'object' && t.status === TaskStatus.DONE
    ).length;
    return Math.round((done / total) * 100);
  }, [project.tasks]);

  const accent = project.priority ? priorityAccent[project.priority] : 'primary';

  return (
    <Card
      accent={accent}
      className="p-6 hover:shadow-lg transition-all duration-300 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2 text-foreground">
            {project.title}
          </h3>
          {project.priority && (
            <Badge variant={priorityVariant[project.priority] ?? 'info'} className="text-xs font-medium">
              <AlertCircle className="w-3 h-3 mr-1" />
              {project.priority}
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(project)}
            className="p-2 rounded-md hover:bg-muted transition-colors text-primary"
            title="Edit project"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(project)}
            className="p-2 rounded-md hover:bg-destructive/10 text-destructive transition-colors"
            title="Delete project"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm mb-4 line-clamp-2 text-muted-foreground">
        {project.description}
      </p>

      {/* Progress bar */}
      {project.tasks && project.tasks.length > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="space-y-3">
        {/* Date and Total Tasks */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className={isOverdue ? 'text-destructive font-medium' : ''}>
              {project.dueDate && formatDate(project.dueDate)}
            </span>
          </div>

          {project.tasks && project.tasks.length > 0 && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <List className="w-4 h-4" />
              <span>{project.tasks.length} task{project.tasks.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Task Status Badges */}
        {taskCounts && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(taskCounts).map(([status, count]) => {
              if (count === 0) return null;
              const config = statusConfig[status as TaskStatus];
              const Icon = config.icon;

              return (
                <Badge
                  key={status}
                  variant={config.variant}
                  className="text-xs px-2 py-0.5 flex items-center gap-1"
                >
                  <Icon className="w-3 h-3" />
                  {count}
                </Badge>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProjectCard;
