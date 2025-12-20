import * as React from 'react';
import { useAuth } from '@hooks/use-auth/use-auth';
import { FrogLogo, UserIcon } from '../../assets/icons';

const Header = ({ title = undefined }: { title?: string | undefined }) => {
  const { user, isAuth } = useAuth();
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.firstName || user.name?.split(' ')[0] || '';
    const lastName = user.lastName || user.name?.split(' ')[1] || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <header 
      className="flex flex-row items-center justify-between shrink-0 w-full px-8 shadow-lg"
      style={{
        height: 'var(--header-height)',
        background: 'linear-gradient(135deg, hsl(var(--header-bg)), hsl(var(--header-bg-end)))'
      }}
    >
      {/* Left side - Logo and Title */}
      <div className="flex flex-row items-center gap-4">
        <FrogLogo className="shrink-0 transition-all hover:scale-110 hover:rotate-6 drop-shadow-lg" />
        <div className="flex flex-row shrink-0 items-center gap-2 px-2">
          <span className="text-4xl font-black text-white tracking-tighter leading-none whitespace-nowrap">
            {title || 'P-Frog'}
          </span>
          <span className="text-sm font-medium text-white opacity-90 whitespace-nowrap">
            | Project Management
          </span>
        </div>
      </div>

      {/* Right side - User Avatar */}
      <div className="flex flex-row items-center gap-3 shrink-0">
        {isAuth && user && (
          <>
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium text-white whitespace-nowrap">
                {user.firstName || user.name || user.email}
              </span>
              <span className="text-xs text-white opacity-75 whitespace-nowrap">
                {user.email}
              </span>
            </div>
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold border-2 cursor-pointer transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderColor: 'rgba(255, 255, 255, 0.5)'
              }}
            >
              {getUserInitials()}
            </div>
          </>
        )}
        {!isAuth && (
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white border-2"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderColor: 'rgba(255, 255, 255, 0.5)'
            }}
          >
            <UserIcon />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
