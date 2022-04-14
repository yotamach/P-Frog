import * as React from 'react';
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import {ListItemIcon, ListItemText, MenuList, Typography} from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from "./side-nav.module.scss";
import { NavMenuItem } from '@types';
import { NavLink } from 'react-router-dom';

const SideNav: React.FC<{ title?: string, menuItems: NavMenuItem[], color?: string, bgcolor?: string}> = ({ title, menuItems, color, bgcolor = 'primary.main' }) => {

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
      <Box flexDirection={'column'} bgcolor={bgcolor} className={styles.sideNav} p={2}>
          {title && <Typography
            variant="h6"
            noWrap
            component="h6"
            color={color}
            sx={{ mr: 15, display: { xs: 'none', md: 'flex' } }}
          >
            {title}
          </Typography>}
        <MenuList >
          {getMenuItems(menuItems)}
        </MenuList>
      </Box>
  );
};
export default SideNav;
