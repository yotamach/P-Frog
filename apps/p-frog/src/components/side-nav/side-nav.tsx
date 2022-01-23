import * as React from 'react';
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import {ListItemIcon, ListItemText, MenuList} from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from "./side-nav.module.scss";
import { NavMenuItem } from '@types';
import { menuItems } from '@data';

const SideNav = () => {

  const getMenuItems = (menuItems: NavMenuItem[]) => {
    return menuItems.map((item) => (
      <MenuItem key={item.title}>
        <ListItemIcon>
          <FontAwesomeIcon icon={item.icon}/>
        </ListItemIcon>
        <ListItemText>{item.title}</ListItemText>
      </MenuItem>
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
