import * as React from 'react';

const Header = ({ title = undefined }: { title?: string | undefined }) => {
  return (
    <header 
      className="h-16 flex items-center justify-between px-6 shadow-md"
      style={{ 
        background: 'linear-gradient(to right, hsl(var(--header-bg)), hsl(var(--header-bg-end)))',
        height: 'var(--header-height)',
      }}
    >
      <div className="flex items-center gap-3">
        <div 
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white font-bold text-lg shadow-lg"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          PF
        </div>
        <span 
          className="text-xl font-semibold text-white"
        >
          {title || 'P-Frog'}
        </span>
      </div>
    </header>
  );
};

export default Header;
