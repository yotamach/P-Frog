import * as React from 'react';
import { useTasks } from '@data/queries/tasks.queries';
import { useProjects } from '@data/queries/projects.queries';
import { TaskStatus } from '@p-frog/data';
import { Card } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { CheckCircle2, Clock, Circle, FolderKanban } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  accent?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning';
}

function StatCard({ label, value, icon, accent = 'primary' }: StatCardProps) {
  return (
    <Card accent={accent} className="p-6 hover:shadow-glow-primary transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-4xl font-extrabold text-gradient-stat">{value}</p>
        </div>
        <div className="text-primary opacity-70">{icon}</div>
      </div>
    </Card>
  );
}

/* eslint-disable-next-line */
export interface TasksProps {}

export function Dashboard(props: TasksProps) {
  const { data: tasks } = useTasks();
  const { data: projects } = useProjects();

  const stats = React.useMemo(() => {
    const taskList = tasks || [];
    return {
      projects: projects?.length ?? 0,
      completed: taskList.filter((t) => t.status === TaskStatus.DONE).length,
      inProgress: taskList.filter((t) => t.status === TaskStatus.IN_PROGRESS).length,
      todo: taskList.filter((t) => t.status === TaskStatus.TODO).length,
    };
  }, [tasks, projects]);

  const recentProjects = React.useMemo(() => {
    return (projects || []).slice(0, 5);
  }, [projects]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Welcome back! Here's an overview of your projects and tasks.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Projects"
          value={stats.projects}
          icon={<FolderKanban className="w-7 h-7" />}
          accent="primary"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={<CheckCircle2 className="w-7 h-7" />}
          accent="success"
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          icon={<Clock className="w-7 h-7" />}
          accent="accent"
        />
        <StatCard
          label="To Do"
          value={stats.todo}
          icon={<Circle className="w-7 h-7" />}
          accent="warning"
        />
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Recent Projects</h2>
          <Badge variant="secondary">{recentProjects.length}</Badge>
        </div>
        {recentProjects.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No projects yet. Create your first project to get started.
          </p>
        ) : (
          <div className="space-y-3">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted transition-colors"
              >
                <div>
                  <p className="font-semibold text-foreground">{project.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {project.description}
                  </p>
                </div>
                {project.priority && (
                  <Badge variant="default">{project.priority}</Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export default Dashboard;
