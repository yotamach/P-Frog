/* eslint-disable-next-line */
export interface TasksProps {}

export function Settings(props: TasksProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-dashed border-white/40 bg-white/90 p-8 shadow-sm">
      <h1 className="text-3xl font-extrabold" style={{ color: 'hsl(var(--sidebar-text))' }}>
        Settings
      </h1>
      <p className="text-sm" style={{ color: 'hsl(var(--table-text-muted))' }}>
        Configure workspace preferences, integrations, and notification rules for your team.
      </p>
    </section>
  );
}

export default Settings;
