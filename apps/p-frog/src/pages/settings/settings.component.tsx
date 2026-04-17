/* eslint-disable-next-line */
export interface TasksProps {}

export function Settings(props: TasksProps) {
  return (
        <div className="flex flex-col gap-8 h-full">
      <div className="border-b-2 pb-4" style={{ borderColor: 'hsl(var(--border))' }}>
        <h1 className="text-3xl font-extrabold mb-2 tracking-tight" style={{ color: 'hsl(var(--sidebar-text))' }}>
          Settings
        </h1>
        <p className="text-[0.95rem] font-medium" style={{ color: 'hsl(var(--table-text-muted))' }}>
        Configure workspace preferences, integrations, and notification rules for your team.

        </p>
      </div>
      </div>
  );
}

export default Settings;
