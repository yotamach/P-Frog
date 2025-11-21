import { Grid } from '@mui/material';
import LoginForm from './components/login-form.component';
import { Box } from '@mui/system';

/* eslint-disable-next-line */
interface LoginProps {}

function Login(props: LoginProps) {
  return (
  <Box bgcolor={'primary.main'} className="flex w-screen h-screen justify-center items-center">
    <Box width={500}>
      <LoginForm />
    </Box>
  </Box>
);
}

export default Login;
