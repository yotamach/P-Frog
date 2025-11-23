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
        className={({ isActive }) => 
          `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150`
        }
        style={({ isActive }) => ({
          backgroundColor: isActive ? 'hsl(var(--sidebar-active))' : 'transparent',
          color: isActive ? 'white' : 'hsl(var(--sidebar-text))',
        })}
      >
        <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
        <span>{item.title}</span>
      </NavLink>
    ))
  }

  return (
    <div className="flex flex-col p-4 space-y-2">
      {title && (
        <h2 className="px-4 mb-2 text-xs font-semibold tracking-wide uppercase" style={{ color: 'hsl(var(--muted-foreground))' }}>
          {title}
        </h2>
      )}
      <nav className="flex flex-col space-y-1">
        {getMenuItems(menuItems)}
      </nav>
    </div>
  );
};
export default SideNav;
