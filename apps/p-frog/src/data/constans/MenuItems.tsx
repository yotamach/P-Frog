import { lazy } from 'react';
import {NavMenuItem} from "../../types";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheckSquare, faChartArea } from '@fortawesome/free-solid-svg-icons'
import { TasksList } from "@pages/tasks/components";
import { ProjectsGrid } from "@pages/projects/components";

const Dashboard = lazy(() => import('@pages/dashboard/dashboard.component'));
const Settings = lazy(() => import('@pages/settings/settings.component'));
const Tasks = lazy(() => import('@pages/tasks/tasks.component'));
const Projects = lazy(() => import('@pages/projects/projects.component'));

library.add(faCheckSquare, faChartArea);

export const menuItems: NavMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'chart-area',
    link: '/home',
    path: '/',
    component: <Dashboard />
  },
  {
    title: 'Tasks',
    icon: 'chart-area',
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
    icon: 'wrench',
    link: '/home/settings',
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
