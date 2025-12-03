import * as React from 'react';
import { useAuth } from '@hooks/use-auth/use-auth';

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
      className="flex flex-row items-center justify-between flex-shrink-0 w-full px-8 shadow-lg"
      style={{
        height: 'var(--header-height)',
        background: 'linear-gradient(135deg, hsl(var(--header-bg)), hsl(var(--header-bg-end)))'
      }}
    >
      {/* Left side - Logo and Title */}
      <div className="flex flex-row items-center gap-4">
        <svg 
          width="48" 
          height="48" 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0 transition-all hover:scale-110 hover:rotate-6 drop-shadow-lg"
        >
          {/* Circle background */}
          <circle 
            cx="24" 
            cy="24" 
            r="22" 
            fill="rgba(255, 255, 255, 0.2)" 
            stroke="rgba(255, 255, 255, 0.4)" 
            strokeWidth="2"
          />
          {/* Frog body */}
          <ellipse cx="24" cy="26" rx="10" ry="8" fill="white" opacity="0.9"/>
          {/* Eyes */}
          <circle cx="20" cy="20" r="4" fill="white" opacity="0.95"/>
          <circle cx="28" cy="20" r="4" fill="white" opacity="0.95"/>
          <circle cx="20" cy="20" r="2" fill="rgba(0,0,0,0.8)"/>
          <circle cx="28" cy="20" r="2" fill="rgba(0,0,0,0.8)"/>
          {/* Eye highlights */}
          <circle cx="20.5" cy="19.5" r="1" fill="white"/>
          <circle cx="28.5" cy="19.5" r="1" fill="white"/>
          {/* Smile */}
          <path 
            d="M 20 30 Q 24 32 28 30" 
            stroke="rgba(0,0,0,0.6)" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            fill="none"
          />
          {/* Front legs */}
          <ellipse cx="18" cy="32" rx="3" ry="2" fill="white" opacity="0.8"/>
          <ellipse cx="30" cy="32" rx="3" ry="2" fill="white" opacity="0.8"/>
        </svg>
        <div className="flex flex-row flex-shrink-0 items-center gap-2 px-2">
          <span className="text-4xl font-black text-white tracking-tighter leading-none whitespace-nowrap">
            {title || 'P-Frog'}
          </span>
          <span className="text-sm font-medium text-white opacity-90 whitespace-nowrap">
            | Project Management
          </span>
        </div>
      </div>

      {/* Right side - User Avatar */}
      <div className="flex flex-row items-center gap-3 flex-shrink-0">
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
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
