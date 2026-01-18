import * as React from 'react';
import { useAuth } from '@hooks/use-auth/use-auth';
import { FrogLogo, UserIcon } from '../../assets/icons';
import { useNavigate } from 'react-router-dom';
import Dropdown from '../dropdown/dropdown';

const Header = ({ title = undefined }: { title?: string | undefined }) => {
  const { user, isAuth, logout } = useAuth();
  const navigate = useNavigate();
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.firstName || user.name?.split(' ')[0] || '';
    const lastName = user.lastName || user.name?.split(' ')[1] || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U';
  };

  const dropdownItems = [
    {
      label: 'Profile',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      onClick: () => navigate('/settings')
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
            
            <Dropdown
              trigger={
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold border-2 cursor-pointer transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                  }}
                >
                  {getUserInitials()}
                </div>
              }
              items={dropdownItems}
            />
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
