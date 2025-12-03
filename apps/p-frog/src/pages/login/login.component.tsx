import LoginForm from './components/login-form.component';

/* eslint-disable-next-line */
interface LoginProps {}

function Login(props: LoginProps) {
  return (
    <div 
      className="flex min-h-screen w-screen items-center justify-center px-4"
      style={{
        background: 'linear-gradient(135deg, hsl(var(--header-bg)), hsl(var(--header-bg-end)))'
      }}
    >
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
