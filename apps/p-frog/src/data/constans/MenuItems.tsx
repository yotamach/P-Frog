import { lazy } from 'react';
import {NavMenuItem} from "../../types";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChartBar, faListCheck, faFolder, faGear, faSun, faMoon, faMagnifyingGlass, faChevronRight, faUsers } from '@fortawesome/free-solid-svg-icons'
import { TasksList } from "@pages/tasks/components";
import { ProjectsGrid } from "@pages/projects/components";
import { SystemRole } from '@p-frog/data';

const Dashboard = lazy(() => import('@pages/dashboard/dashboard.component'));
const Settings = lazy(() => import('@pages/settings/settings.component'));
const Tasks = lazy(() => import('@pages/tasks/tasks.component'));
const Projects = lazy(() => import('@pages/projects/projects.component'));
const Users = lazy(() => import('@pages/users/users.component'));

library.add(faChartBar, faListCheck, faFolder, faGear, faSun, faMoon, faMagnifyingGlass, faChevronRight, faUsers);

export const menuItems: NavMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'chart-bar',
    link: '/home',
    path: '/',
    component: <Dashboard />
  },
  {
    title: 'Tasks',
    icon: 'list-check',
    link: '/home/tasks',
    path: 'tasks/*',
    component: <Tasks />
  },
  {
    title: 'Projects',
    icon: 'folder',
    link: '/home/projects',
    path: 'projects',
    component: <Projects />
  },
  {
    title: 'Settings',
    icon: 'gear',
    link: '/home/settings',
    path: 'settings',
    component: <Settings />
  },
  {
    title: 'Users',
    icon: 'users',
    link: '/home/users',
    path: 'users',
    component: <Users />,
    requiredRole: SystemRole.ADMIN
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
