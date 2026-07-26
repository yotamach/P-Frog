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

// Match the page's own protocol so a production HTTPS deploy never silently
// falls back to a plaintext-HTTP auth origin (which would also leak the session cookie).
const getDefaultProtocol = () => (typeof window !== 'undefined' && window.location?.protocol) || 'http:';

// better-auth client requires the server base URL (without /api path).
// Internally it appends /api/auth to form endpoint URLs like /api/auth/sign-in/email.
const baseURL = `${getDefaultProtocol()}//${getEnvVar('VITE_SERVER_HOST', 'localhost')}:${getEnvVar('VITE_SERVER_PORT', '3333')}`;

export const authClient = createAuthClient({
  baseURL,
  plugins: [
    twoFactorClient(),
    magicLinkClient(),
  ],
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
