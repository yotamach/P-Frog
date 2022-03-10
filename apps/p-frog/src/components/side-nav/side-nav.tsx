import * as React from 'react';
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import {ListItemIcon, ListItemText, MenuList} from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from "./side-nav.module.scss";
import { NavMenuItem } from '@types';
import { NavLink } from 'react-router-dom';

const SideNav: React.FC<{ menuItems: NavMenuItem[], color?: string }> = ({ menuItems, color }) => {

  const getMenuItems = (menuItems: NavMenuItem[]) => {
    return menuItems.map((item) => (
      <NavLink to={item.link} key={item.title} style={{ textDecoration: 'none' }}>
        <MenuItem key={item.title} sx={{ color: color }}>
              <ListItemIcon sx={{ color: color }}>
                <FontAwesomeIcon icon={item.icon}/>
              </ListItemIcon>
              <ListItemText>{item.title}</ListItemText>
        </MenuItem>
      </NavLink>
    ))
  }

  return (
      <Box flexDirection={'column'} className={styles.sideNav}>
        <MenuList color={"text.secondary"}>
          {getMenuItems(menuItems)}
        </MenuList>
      </Box>
  );
};
export default SideNav;
