import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

export interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();

  return (
    <div 
      key={location.pathname}
      className="page-fade-in"
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </div>
  );
}

export default PageTransition;
