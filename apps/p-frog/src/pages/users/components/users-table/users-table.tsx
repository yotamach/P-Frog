import * as React from 'react';
import { User, SystemRole } from '@p-frog/data';
import { Trash2 } from 'lucide-react';
import { useUpdateUserRole, useDeleteUser } from '@data/queries/users.queries';
import { useStore } from '@tanstack/react-store';
import { authStore, selectUser } from '@data/store/authStore';

interface UsersTableProps {
  users: User[];
}

const ROLE_LABELS: Record<SystemRole, string> = {
  [SystemRole.SUPERUSER]: 'Superuser',
  [SystemRole.ADMIN]: 'Admin',
  [SystemRole.PROJECT_MANAGER]: 'Project Manager',
  [SystemRole.MEMBER]: 'Member',
};

export const UsersTable: React.FC<UsersTableProps> = ({ users }) => {
  const currentUser = useStore(authStore, selectUser);
  const currentRole: SystemRole = currentUser?.role ?? SystemRole.MEMBER;
  const isSuperuser = currentRole === SystemRole.SUPERUSER;

  const { mutate: updateRole, isPending: isUpdating } = useUpdateUserRole();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const getRoleOptions = (targetUser: User): SystemRole[] => {
    const targetRole = targetUser.role ?? SystemRole.MEMBER;
    // Nobody can change a superuser's role via this UI
    if (targetRole === SystemRole.SUPERUSER) return [];
    if (isSuperuser) {
      return [SystemRole.ADMIN, SystemRole.PROJECT_MANAGER, SystemRole.MEMBER];
    }
    // Admin cannot change admin roles
    if (targetRole === SystemRole.ADMIN) return [];
    return [SystemRole.PROJECT_MANAGER, SystemRole.MEMBER];
  };

  const canChangeRole = (targetUser: User): boolean => {
    if (targetUser.id === currentUser?.id) return false;
    return getRoleOptions(targetUser).length > 0;
  };

  return (
    <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'hsl(var(--border))' }}>
      <table className="w-full text-sm" style={{ backgroundColor: 'var(--color-surface)' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--muted))' }}>
            <th className="text-left px-4 py-3 font-semibold" style={{ color: 'hsl(var(--foreground))' }}>Name</th>
            <th className="text-left px-4 py-3 font-semibold" style={{ color: 'hsl(var(--foreground))' }}>Username</th>
            <th className="text-left px-4 py-3 font-semibold" style={{ color: 'hsl(var(--foreground))' }}>Email</th>
            <th className="text-left px-4 py-3 font-semibold" style={{ color: 'hsl(var(--foreground))' }}>Role</th>
            {isSuperuser && (
              <th className="text-left px-4 py-3 font-semibold" style={{ color: 'hsl(var(--foreground))' }}>Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            const roleOptions = getRoleOptions(user);
            const userRole = user.role ?? SystemRole.MEMBER;
            const isCurrentUser = user.id === currentUser?.id;

            return (
              <tr
                key={user.id}
                style={{
                  borderBottom: index < users.length - 1 ? '1px solid hsl(var(--border))' : 'none',
                  backgroundColor: isCurrentUser ? 'hsl(var(--muted) / 0.4)' : undefined,
                }}
              >
                <td className="px-4 py-3" style={{ color: 'hsl(var(--foreground))' }}>
                  {user.firstName || user.lastName
                    ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
                    : '—'}
                  {isCurrentUser && (
                    <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'hsl(var(--sidebar-active) / 0.15)', color: 'hsl(var(--sidebar-active))' }}>
                      You
                    </span>
                  )}
                </td>
                <td className="px-4 py-3" style={{ color: 'hsl(var(--foreground))' }}>
                  {user.userName}
                </td>
                <td className="px-4 py-3" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  {user.email ?? '—'}
                </td>
                <td className="px-4 py-3">
                  {canChangeRole(user) ? (
                    <select
                      value={userRole}
                      disabled={isUpdating || isDeleting}
                      onChange={(e) => updateRole({ id: user.id!, role: e.target.value as SystemRole })}
                      className="px-2 py-1 rounded border text-sm"
                      style={{
                        borderColor: 'hsl(var(--border))',
                        backgroundColor: 'var(--color-surface)',
                        color: 'hsl(var(--foreground))',
                      }}
                    >
                      {roleOptions.map((r) => (
                        <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                      ))}
                    </select>
                  ) : (
                    <span
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor: 'hsl(var(--muted))',
                        color: 'hsl(var(--foreground))',
                      }}
                    >
                      {ROLE_LABELS[userRole]}
                    </span>
                  )}
                </td>
                {isSuperuser && (
                  <td className="px-4 py-3">
                    {!isCurrentUser && (
                      <button
                        onClick={() => deleteUser(user.id!)}
                        disabled={isDeleting || isUpdating}
                        className="p-1.5 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
