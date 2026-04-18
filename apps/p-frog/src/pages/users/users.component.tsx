import { UsersTable } from './components';
import { useUsers } from '@data/queries/users.queries';

export function Users() {
  const { data: users, isLoading, isError } = useUsers();

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="border-b-2 pb-4" style={{ borderColor: 'hsl(var(--border))' }}>
        <h1 className="text-3xl font-extrabold mb-2 tracking-tight" style={{ color: 'hsl(var(--sidebar-text))' }}>
          Users
        </h1>
        <p className="text-[0.95rem] font-medium" style={{ color: 'hsl(var(--table-text-muted))' }}>
          Manage user accounts and roles
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center p-16">
          <div
            className="w-10 h-10 border-4 rounded-full animate-spin"
            style={{
              borderColor: 'hsl(var(--border))',
              borderTopColor: 'hsl(var(--sidebar-active))',
            }}
          />
        </div>
      )}

      {isError && (
        <div className="p-4 rounded border text-sm" style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--destructive))' }}>
          Failed to load users.
        </div>
      )}

      {!isLoading && !isError && users && (
        <UsersTable users={users} />
      )}
    </div>
  );
}

export default Users;
