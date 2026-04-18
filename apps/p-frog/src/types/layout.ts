import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { SystemRole } from "@p-frog/data";

export interface NavMenuItem {
  title: string;
  icon: IconProp;
  link: string;
  path: string;
  component: JSX.Element;
  requiredRole?: SystemRole;
}
