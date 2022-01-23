import {NavMenuItem} from "../../types";
import fontawesome from '@fortawesome/fontawesome'
import { faCheckSquare, faChartArea } from '@fortawesome/fontawesome-free-solid'

fontawesome.library.add(faCheckSquare, faChartArea);

export const menuItems: NavMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'chart-area'
  },
  {
    title: 'Settings',
    icon: 'wrench'
  }
];
