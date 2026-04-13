import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './globals.css';

import App from './app/app';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
