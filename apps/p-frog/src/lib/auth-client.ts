import { createAuthClient } from 'better-auth/react';
import { twoFactorClient } from 'better-auth/client/plugins';
import { magicLinkClient } from 'better-auth/client/plugins';

// Helper to safely access import.meta.env (works in both Vite and Jest)
const getEnvVar = (key: string, defaultValue: string) => {
  try {
    return (import.meta.env as any)?.[key] || defaultValue;
  } catch {
    return defaultValue;
  }
};

// better-auth client requires the server base URL (without /api path).
// Internally it appends /api/auth to form endpoint URLs like /api/auth/sign-in/email.
const baseURL = `http://${getEnvVar('VITE_SERVER_HOST', 'localhost')}:${getEnvVar('VITE_SERVER_PORT', '3333')}`;

export const authClient = createAuthClient({
  baseURL,
  plugins: [
    twoFactorClient(),
    magicLinkClient(),
  ],
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
