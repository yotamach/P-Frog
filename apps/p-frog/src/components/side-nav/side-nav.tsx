import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavMenuItem } from '@types';
import { NavLink } from 'react-router-dom';

const SideNav: React.FC<{ title?: string, menuItems: NavMenuItem[], color?: string, bgcolor?: string}> = ({ title, menuItems }) => {

  const getMenuItems = (menuItems: NavMenuItem[]) => {
    return menuItems.map((item) => (
      <NavLink 
        to={item.link} 
        key={item.title}
        style={({ isActive }) => ({
          backgroundColor: isActive ? 'hsl(var(--sidebar-active))' : 'transparent',
          color: isActive ? 'white' : 'hsl(var(--sidebar-text))',
          borderLeft: isActive ? '4px solid white' : '4px solid transparent',
        })}
        className={({ isActive }) => 
          `group relative overflow-hidden flex flex-row items-center gap-3 py-3.5 px-4 rounded-xl text-[0.9375rem] font-semibold transition-all duration-300 ease-out -ml-1 ${
            isActive 
              ? 'translate-x-2 shadow-lg' 
              : ''
          }`
        }
      >
        <FontAwesomeIcon 
          icon={item.icon} 
          className="w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
        />
        <span className="whitespace-nowrap transition-[letter-spacing] duration-300 group-hover:tracking-wide">
          {item.title}
        </span>
        {/* Animated background on hover */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full transition-transform duration-600 ease-out pointer-events-none -z-10 group-hover:translate-x-full" />
      </NavLink>
    ))
  }

  return (
    <div className="flex flex-col h-full py-6 px-3">
      {title && (
        <h2 className="px-4 py-3 mb-4 text-xs font-bold tracking-widest uppercase text-[hsl(var(--muted-foreground))] opacity-70 transition-opacity duration-300 hover:opacity-100">
          {title}
        </h2>
      )}
      <nav className="flex flex-col gap-1.5 px-2">
        {getMenuItems(menuItems)}
      </nav>
    </div>
  );
};
export default SideNav;
