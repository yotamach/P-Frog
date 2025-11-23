/* eslint-disable-next-line */
export interface TasksProps {}

export function Dashboard(props: TasksProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">Overview of your tasks and activities</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Tasks List</h2>
        <div className="text-gray-600">
          <p>No tasks available</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
