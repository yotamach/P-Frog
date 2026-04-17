/* eslint-disable-next-line */
export interface TasksProps {}

export function Dashboard(props: TasksProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Dashboard</h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>Overview of your tasks and activities</p>
      </div>

      <div className="rounded-lg shadow-sm border p-6" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Tasks List</h2>
        <div style={{ color: 'var(--color-text-muted)' }}>
          <p>No tasks available</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
