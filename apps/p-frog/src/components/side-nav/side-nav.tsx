import * as React from 'react';
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import {ListItemIcon, ListItemText, MenuList} from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from "./side-nav.module.scss";
import { NavMenuItem } from '@types';
import { menuItems } from '@data';
import { Link } from 'react-router-dom';

const SideNav = () => {

  const getMenuItems = (menuItems: NavMenuItem[]) => {
    return menuItems.map((item) => (
      <Link to={item.link}>
        <MenuItem key={item.title}>
              <ListItemIcon>
                <FontAwesomeIcon icon={item.icon}/>
              </ListItemIcon>
              <ListItemText>{item.title}</ListItemText>
        </MenuItem>
      </Link>
    ))
  }

  return (
      <Box flexDirection={'column'} className={styles.sideNav}>
        <MenuList>
          {getMenuItems(menuItems)}
        </MenuList>
      </Box>
  );
};
export default SideNav;
