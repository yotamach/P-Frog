import App from './app';

jest.mock('@lib/auth-client', () => ({
  useSession: jest.fn().mockReturnValue({ data: null, isPending: false }),
  signIn: { email: jest.fn() },
  signUp: { email: jest.fn() },
  signOut: jest.fn(),
  getSession: jest.fn(),
}));

jest.mock('@data/queries/auth.queries', () => ({
  useLogin: jest.fn(),
  useSignUp: jest.fn(),
  useSignOut: jest.fn(),
  useLogout: jest.fn(),
  initializeAuth: jest.fn(),
}));

describe('App', () => {
  it('should export App component', () => {
    expect(App).toBeDefined();
    expect(typeof App).toBe('function');
  });
});
