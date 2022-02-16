import {NavMenuItem} from "../../types";
import fontawesome from '@fortawesome/fontawesome'
import { faCheckSquare, faChartArea } from '@fortawesome/fontawesome-free-solid'
import { Dashboard, Settings, Tasks } from "@pages";

fontawesome.library.add(faCheckSquare, faChartArea);

export const menuItems: NavMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'chart-area',
    link: '/',
    path: '/',
    component: <Dashboard />
  },
  {
    title: 'Tasks',
    icon: 'chart-area',
    link: '/tasks',
    path: 'tasks',
    component: <Tasks />
  },
  {
    title: 'Settings',
    icon: 'wrench',
    link: '/settings',
    path: 'settings',
    component: <Settings />
  }
];
