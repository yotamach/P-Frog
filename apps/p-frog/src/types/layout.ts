import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { ReactNode } from "react";

export interface NavMenuItem {
  title: string;
  icon: IconProp;
  link: string;
  path: string;
  component: JSX.Element;
}
