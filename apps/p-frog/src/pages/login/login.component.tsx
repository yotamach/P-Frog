import classes from './login.component.module.scss';
import { Grid } from '@mui/material';
import LoginForm from './components/login-form.component';
import { Box } from '@mui/system';

/* eslint-disable-next-line */
interface LoginProps {}

function Login(props: LoginProps) {
  return (
  <Box bgcolor={'primary.main'} className={classes.loginBackground}>
    <Box width={500}>
      <LoginForm />
    </Box>
  </Box>
);
}

export default Login;
