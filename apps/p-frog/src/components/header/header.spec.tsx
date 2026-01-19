import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './header';
import { useAuth } from '@hooks/use-auth/use-auth';

// Mock the useAuth hook
jest.mock('@hooks/use-auth/use-auth');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Mock the navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock the icons
jest.mock('../../assets/icons', () => ({
  FrogLogo: ({ className }: any) => <div data-testid="frog-logo" className={className}>Logo</div>,
  UserIcon: () => <div data-testid="user-icon">User</div>,
}));

// Mock Dropdown component
jest.mock('../dropdown/dropdown', () => ({
  __esModule: true,
  default: ({ trigger, items }: any) => (
    <div data-testid="dropdown">
      {trigger}
      <div data-testid="dropdown-items">
        {items?.map((item: any, i: number) => (
          <button key={i} onClick={item.onClick} data-testid={`dropdown-item-${i}`}>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  ),
}));

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render logo', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuth: false,
      logout: jest.fn(),
      login: jest.fn(),
    } as any);

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    expect(screen.getByTestId('frog-logo')).toBeTruthy();
  });

  it('should render default title "P-Frog"', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuth: false,
      logout: jest.fn(),
      login: jest.fn(),
    } as any);

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    expect(screen.getByText('P-Frog')).toBeTruthy();
  });

  it('should render custom title when provided', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuth: false,
      logout: jest.fn(),
      login: jest.fn(),
    } as any);

    render(
      <BrowserRouter>
        <Header title="Custom Title" />
      </BrowserRouter>
    );

    expect(screen.getByText('Custom Title')).toBeTruthy();
  });

  it('should display user information when authenticated', () => {
    const mockUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    };

    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuth: true,
      logout: jest.fn(),
      login: jest.fn(),
    } as any);

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    expect(screen.getByText('John')).toBeTruthy();
    expect(screen.getByText('john@example.com')).toBeTruthy();
  });

  it('should display user initials in avatar', () => {
    const mockUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    };

    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuth: true,
      logout: jest.fn(),
      login: jest.fn(),
    } as any);

    const { container } = render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    expect(screen.getByText('JD')).toBeTruthy();
  });

  it('should handle user with only name field', () => {
    const mockUser = {
      name: 'Jane Smith',
      email: 'jane@example.com',
    };

    mockUseAuth.mockReturnValue({
      user: mockUser as any,
      isAuth: true,
      logout: jest.fn(),
      login: jest.fn(),
    } as any);

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    expect(screen.getByText('Jane Smith')).toBeTruthy();
  });

  it('should show dropdown when authenticated', () => {
    const mockUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    };

    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuth: true,
      logout: jest.fn(),
      login: jest.fn(),
    } as any);

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    expect(screen.getByTestId('dropdown')).toBeTruthy();
  });

  it('should not show user info when not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuth: false,
      logout: jest.fn(),
      login: jest.fn(),
    } as any);

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    expect(screen.queryByTestId('dropdown')).toBeNull();
  });

  it('should have subtitle "| Project Management"', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuth: false,
      logout: jest.fn(),
      login: jest.fn(),
    } as any);

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    expect(screen.getByText('| Project Management')).toBeTruthy();
  });
});
