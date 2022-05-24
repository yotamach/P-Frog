import Box from "@mui/material/Box";
import { Route, Link } from 'react-router-dom';

import './home.component.module.scss';
import Typography from '@mui/material/Typography';
import { Divider, Paper } from "@mui/material";
import { Fragment } from "react";
import { menuItems } from "@data/index";
import { Footer, Header, Main, SideNav } from "@components/index";

/* eslint-disable-next-line */
export interface HomeProps {}

export function Home(props: HomeProps) {
  return (
    <Fragment>
      <Header title={'LOGO'} />
      <SideNav menuItems={menuItems} color={'white'} />
      <Main/>
      <Footer />
    </Fragment>
  );
}

export default Home;
