import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavMenuItem } from '@types';
import { NavLink } from 'react-router-dom';

const SideNav: React.FC<{ title?: string, menuItems: NavMenuItem[], color?: string, bgcolor?: string}> = ({ title, menuItems, color }) => {

  const getMenuItems = (menuItems: NavMenuItem[]) => {
    return menuItems.map((item) => (
      <NavLink 
        to={item.link} 
        key={item.title} 
        className={({ isActive }) => 
          `nav-item ${isActive ? 'active' : ''}`
        }
      >
        <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
        <span>{item.title}</span>
      </NavLink>
    ))
  }

  return (
    <div className="flex flex-col p-4 space-y-1">
      {title && (
        <h2 className="px-4 mb-2 text-lg font-semibold tracking-tight">
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
