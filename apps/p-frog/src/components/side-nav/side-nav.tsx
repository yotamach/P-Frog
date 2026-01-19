import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavMenuItem } from '@types';
import { NavLink } from 'react-router-dom';

const SideNav: React.FC<{ 
  title?: string; 
  menuItems: NavMenuItem[];
}> = ({ title, menuItems }) => {
  return (
    <aside 
      className="w-64 h-full border-r overflow-y-auto shrink-0"
      style={{ 
        backgroundColor: 'hsl(var(--sidebar-bg))',
        borderColor: 'hsl(var(--sidebar-border))'
      }}
    >
      <div className="py-6 px-3">
        {title && (
          <h2 className="px-4 py-3 mb-4 text-xs font-bold tracking-widest uppercase text-[hsl(var(--muted-foreground))] opacity-70">
            {title}
          </h2>
        )}
        <nav className="flex flex-col gap-1.5 px-2">
          {menuItems.map((item) => (
            <NavLink 
              to={item.link} 
              key={item.title}
              end={item.link === '/home'}
              className={({ isActive }) => 
                `group flex items-center gap-3 py-3.5 px-4 rounded-xl text-[0.9375rem] font-semibold transition-all duration-300 ${
                  isActive 
                    ? 'bg-[hsl(var(--sidebar-active))] text-white shadow-lg translate-x-1' 
                    : 'text-[hsl(var(--sidebar-text))] hover:bg-[hsl(var(--sidebar-hover))]'
                }`
              }
            >
              <FontAwesomeIcon 
                icon={item.icon} 
                className="w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110"
              />
              <span className="whitespace-nowrap transition-[letter-spacing] duration-300 group-hover:tracking-wide">
                {item.title}
              </span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default SideNav;
