import { useAuth } from '@hooks/use-auth/use-auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ThemeToggle } from '../theme-toggle/theme-toggle';
import Dropdown from '../dropdown/dropdown';

const routeNames: Record<string, string> = {
  '': 'Dashboard',
  'tasks': 'Tasks',
  'projects': 'Projects',
  'settings': 'Settings',
};

export function ContentHeader() {
  const { user, isAuth, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.firstName || user.name?.split(' ')[0] || '';
    const lastName = user.lastName || user.name?.split(' ')[1] || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U';
  };

  const getBreadcrumb = () => {
    const path = location.pathname.replace('/home', '').replace(/^\//, '');
    const segments = path ? path.split('/') : [];
    const primary = segments[0] || '';
    const name = routeNames[primary] || primary.charAt(0).toUpperCase() + primary.slice(1);
    return { parent: 'Home', current: name };
  };

  const breadcrumb = getBreadcrumb();

  const dropdownItems = [
    {
      label: 'Profile',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      onClick: () => navigate('/home/settings')
    },
    {
      label: 'Logout',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
      onClick: () => {
        logout();
        navigate('/login');
      }
    }
  ];

  return (
    <header className="content-header">
      {/* Left: breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span style={{ color: 'var(--color-text-muted)' }}>{breadcrumb.parent}</span>
        <FontAwesomeIcon icon={faChevronRight} className="text-xs" style={{ color: 'var(--color-text-muted)' }} />
        <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>{breadcrumb.current}</span>
      </div>

      {/* Right: search + theme toggle + avatar */}
      <div className="flex items-center gap-3.5">
        {/* Search input */}
        <div className="relative">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] pointer-events-none"
            style={{ color: 'var(--color-text-muted)' }}
          />
          <input
            type="text"
            placeholder="Search..."
            className="h-[34px] w-[200px] rounded-full pl-9 pr-3.5 text-[13px] outline-none transition-colors"
            style={{
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface-warm)',
              color: 'var(--color-text-primary)',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* User name + avatar */}
        {isAuth && user ? (
          <>
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                {user.firstName || user.name || user.email}
              </span>
            </div>
            <Dropdown
              trigger={
                <div
                  data-testid="user-avatar"
                  className="flex items-center justify-center rounded-full cursor-pointer text-[13px] font-bold transition-colors"
                  style={{
                    width: 34,
                    height: 34,
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-primary-foreground)',
                  }}
                >
                  {getUserInitials()}
                </div>
              }
              items={dropdownItems}
            />
          </>
        ) : (
          <div
            className="flex items-center justify-center rounded-full text-[13px] font-bold"
            style={{
              width: 34,
              height: 34,
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-primary-foreground)',
            }}
          >
            U
          </div>
        )}
      </div>
    </header>
  );
}

export default ContentHeader;
