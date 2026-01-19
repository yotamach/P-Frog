import * as React from 'react';
import { Project, ProjectPriority, TaskStatus } from '@p-frog/data';
import { Calendar, List, AlertCircle, Trash2, Edit, Circle, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@components/ui/badge';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

const priorityColors = {
  [ProjectPriority.LOW]: 'bg-blue-100 text-blue-800',
  [ProjectPriority.MEDIUM]: 'bg-yellow-100 text-yellow-800',
  [ProjectPriority.HIGH]: 'bg-orange-100 text-orange-800',
  [ProjectPriority.CRITICAL]: 'bg-red-100 text-red-800',
};

const statusConfig = {
  [TaskStatus.TODO]: { 
    label: 'To Do',
    icon: Circle,
    color: 'bg-gray-100 text-gray-700 border-gray-200'
  },
  [TaskStatus.IN_PROGRESS]: { 
    label: 'In Progress',
    icon: Clock,
    color: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  [TaskStatus.DONE]: { 
    label: 'Done',
    icon: CheckCircle2,
    color: 'bg-green-100 text-green-700 border-green-200'
  },
  [TaskStatus.CANCELLED]: { 
    label: 'Cancelled',
    icon: XCircle,
    color: 'bg-red-100 text-red-700 border-red-200'
  },
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isOverdue = new Date(project.dueDate) < new Date();

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

  return (
    <div 
      className="rounded-lg border p-6 hover:shadow-lg transition-all duration-300 bg-white group"
      style={{ borderColor: 'hsl(var(--border))' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'hsl(var(--foreground))' }}>
            {project.title}
          </h3>
          {project.priority && (
            <Badge className={`${priorityColors[project.priority]} text-xs font-medium`}>
              <AlertCircle className="w-3 h-3 mr-1" />
              {project.priority}
            </Badge>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(project)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            title="Edit project"
          >
            <Edit className="w-4 h-4" style={{ color: 'hsl(var(--sidebar-active))' }} />
          </button>
          <button
            onClick={() => onDelete(project)}
            className="p-2 rounded-md hover:bg-red-50 transition-colors"
            title="Delete project"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      {/* Description */}
      <p 
        className="text-sm mb-4 line-clamp-2" 
        style={{ color: 'hsl(var(--muted-foreground))' }}
      >
        {project.description}
      </p>

      {/* Footer */}
      <div className="space-y-3">
        {/* Date and Total Tasks */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
            <Calendar className="w-4 h-4" />
            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
              {formatDate(project.dueDate)}
            </span>
          </div>
          
          {project.tasks && project.tasks.length > 0 && (
            <div className="flex items-center gap-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
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
                  variant="outline"
                  className={`${config.color} text-xs px-2 py-0.5 flex items-center gap-1 border`}
                >
                  <Icon className="w-3 h-3" />
                  {count}
                </Badge>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
