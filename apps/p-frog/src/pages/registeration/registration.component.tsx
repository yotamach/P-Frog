import RegistrationForm from './components/registration-form.component';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/use-auth/use-auth';

/* eslint-disable-next-line */
export interface RegistrationProps {}

export function Registration(props: RegistrationProps) {
  const { isAuth } = useAuth();
  const navigate = useNavigate();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuth) {
      navigate('/', { replace: true });
    }
  }, [isAuth, navigate]);

  return (
    <div 
      className="flex min-h-screen w-screen items-center justify-center px-4"
      style={{
        background: 'linear-gradient(135deg, hsl(var(--header-bg)), hsl(var(--header-bg-end)))'
      }}
    >
      <div className="w-full max-w-md">
        <RegistrationForm />
      </div>
    </div>
  );
}

export default Registration;
