import {NavMenuItem} from "../../types";
import fontawesome from '@fortawesome/fontawesome'
import { faCheckSquare, faChartArea } from '@fortawesome/fontawesome-free-solid'
import { Dashboard, Settings, Tasks } from "@pages/index";
import { TasksList } from "@pages/tasks/components";

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
    link: '/tasks/',
    path: 'tasks/*',
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


export const tasksMenuItems: NavMenuItem[] = [
  {
    title: 'Tasks list',
    icon: 'comments',
    link: '',
    path: '',
    component: <TasksList />
  },
  {
    title: 'Create Task',
    icon: 'archive',
    link: 'create-task',
    path: 'create-task',
    component: <TasksList />
  }
  ,{
    title: 'Edit Task',
    icon: 'archive',
    link: 'edit-task',
    path: 'edit-task',
    component: <TasksList />
  }
];
