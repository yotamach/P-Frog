import Footer from './footer/footer';
import Header from './header/header';
import Loader from './loader/loader';
import Main from './main/main';
import SideNav from './side-nav/side-nav';
import PageTransition from './page-transition/page-transition';
import Dropdown from './dropdown/dropdown';
import TopBarTable from './top-bar-table/top-bar-table';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { IconRail } from './icon-rail/icon-rail';
import { ContentHeader } from './content-header/content-header';
import { ThemeToggle } from './theme-toggle/theme-toggle';

// Export UI components (shadcn)
export * from './ui/sidebar';
export * from './ui/dialog';
export * from './ui/drawer';
export * from './ui/button';
export * from './ui/input';
export * from './ui/label';
export * from './ui/textarea';
export * from './ui/select';
export * from './ui/card';
export * from './ui/table';

export {
  Header,
  Main,
  SideNav,
  Footer,
  Loader,
  PageTransition,
  Dropdown,
  TopBarTable,
  ProtectedRoute,
  IconRail,
  ContentHeader,
  ThemeToggle,
}