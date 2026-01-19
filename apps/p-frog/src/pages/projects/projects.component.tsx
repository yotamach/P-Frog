import { Suspense } from 'react';
import { ProjectsGrid } from './components';

/* eslint-disable-next-line */
export interface ProjectsProps {}

export function Projects(props: ProjectsProps) {
  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="border-b-2 pb-4" style={{ borderColor: 'hsl(var(--border))' }}>
        <h1 className="text-3xl font-extrabold mb-2 tracking-tight" style={{ color: 'hsl(var(--sidebar-text))' }}>
          Projects
        </h1>
        <p className="text-[0.95rem] font-medium" style={{ color: 'hsl(var(--table-text-muted))' }}>
          Manage your projects and organize tasks
        </p>
      </div>

      <Suspense fallback={
        <div className="flex justify-center items-center p-16">
          <div 
            className="w-10 h-10 border-4 rounded-full animate-spin" 
            style={{
              borderColor: 'hsl(var(--border))',
              borderTopColor: 'hsl(var(--sidebar-active))'
            }}
          />
        </div>
      }>
        <div className="flex-1 overflow-auto">
          <ProjectsGrid />
        </div>
      </Suspense>
    </div>
  );
}

export default Projects;
