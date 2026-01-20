import App from './app';

jest.mock('@data/services/auth.service', () => ({
  AuthAPI: jest.fn().mockImplementation(() => ({
    login: jest.fn(),
    register: jest.fn(),
    getProfile: jest.fn(),
  })),
}));

jest.mock('@data/queries/auth.queries', () => ({
  useLogin: jest.fn(),
  useRegister: jest.fn(),
  useProfile: jest.fn(),
}));

describe('App', () => {
  it('should export App component', () => {
    expect(App).toBeDefined();
    expect(typeof App).toBe('function');
  });
});
