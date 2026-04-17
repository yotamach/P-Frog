import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavMenuItem } from '@types';
import { NavLink } from 'react-router-dom';
import { FrogLogo } from '../../assets/icons';

interface IconRailProps {
  menuItems: NavMenuItem[];
}

export function IconRail({ menuItems }: IconRailProps) {
  return (
    <nav className="icon-rail">
      <div className="rail-logo">
        <FrogLogo className="w-8 h-8" />
      </div>
      <div className="rail-nav">
        {menuItems.map((item) => (
          <NavLink
            to={item.link}
            key={item.title}
            end={item.link === '/home'}
            data-tooltip={item.title}
            className={({ isActive }) =>
              `rail-item ${isActive ? 'active' : ''}`
            }
          >
            <FontAwesomeIcon icon={item.icon} />
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default IconRail;
