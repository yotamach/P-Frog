import Footer from './footer/footer';
import Header from './header/header';
import Loader from './loader/loader';
import Main from './main/main';
import * as Table from './table/table';
import SideNav from './side-nav/side-nav';
import PageTransition from './page-transition/page-transition';
import Dropdown from './dropdown/dropdown';
import TopBarTable from './top-bar-table/top-bar-table';
import { ProtectedRoute } from './auth/ProtectedRoute';

// Export UI components (shadcn)
export * from './ui/sidebar';
export * from './ui/dialog';
export * from './ui/drawer';
export * from './ui/button';
export * from './ui/input';
export * from './ui/card';

export {
  Header,
  Main,
  SideNav,
  Footer,
  Table,
  Loader,
  PageTransition,
  Dropdown,
  TopBarTable,
  ProtectedRoute,
}