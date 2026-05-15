/**
 * E2E Tests for Authentication Flow
 *
 * Contains both basic navigation tests and comprehensive authentication tests
 */

describe('Authentication Flow - Basic Navigation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Welcome Page', () => {
    it('should redirect to welcome page from root', () => {
      cy.url().should('include', '/welcome');
      cy.contains('Welcome to P-Frog').should('be.visible');
    });

    it('should navigate to login page', () => {
      cy.contains('Sign In').click();
      cy.url().should('include', '/login');
    });

    it('should navigate to registration page', () => {
      cy.visit('/welcome');
      cy.contains('Sign Up').click();
      cy.url().should('include', '/registration');
    });
  });

  describe('Registration', () => {
    beforeEach(() => {
      cy.visit('/registration');
    });

    it('should display registration page', () => {
      cy.contains('Create Account').should('be.visible');
    });

    it('should show registration form fields', () => {
      cy.contains('label', 'First Name').should('be.visible');
      cy.contains('label', 'Last Name').should('be.visible');
      cy.contains('label', 'Email').should('be.visible');
      cy.contains('label', 'Password').should('be.visible');
      cy.contains('label', 'Confirm Password').should('be.visible');
    });
  });

  describe('Login', () => {
    beforeEach(() => {
      cy.visit('/login');
    });

    it('should display login page', () => {
      cy.contains('Sign in').should('be.visible');
    });
  });

  describe('Protected Routes', () => {
    it('should redirect to login when accessing protected route without auth', () => {
      cy.visit('/home');
      cy.url().should('include', '/login');
    });

    it('should redirect to login when accessing tasks without auth', () => {
      cy.visit('/home/tasks');
      cy.url().should('include', '/login');
    });

    it('should redirect to login when accessing projects without auth', () => {
      cy.visit('/home/projects');
      cy.url().should('include', '/login');
    });

    it('should redirect to login when accessing settings without auth', () => {
      cy.visit('/home/settings');
      cy.url().should('include', '/login');
    });
  });
});

describe('Authentication E2E Tests - Comprehensive', () => {
  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test_' + Date.now() + '@example.com',
    password: 'TestPassword123!',
  };

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Registration Flow', () => {
    it('should allow a new user to register', () => {
      cy.visit('/registration');

      cy.contains('label', 'First Name').parent().find('input').type(testUser.firstName);
      cy.contains('label', 'Last Name').parent().find('input').type(testUser.lastName);
      cy.contains('label', 'Email').parent().find('input').type(testUser.email);
      cy.contains('label', 'Password').parent().find('input').type(testUser.password);
      cy.contains('label', 'Confirm Password').parent().find('input').type(testUser.password);

      cy.get('button[type="submit"]').click();

      cy.url().should('include', '/login');
      cy.contains(/registration successful/i, { timeout: 5000 }).should('be.visible');
    });

    it('should show validation errors for invalid input', () => {
      cy.visit('/registration');

      cy.get('button[type="submit"]').click();

      cy.contains(/first name is required/i).should('be.visible');
      cy.contains(/last name is required/i).should('be.visible');
      cy.contains(/email is required/i).should('be.visible');
    });

    it('should validate password matching', () => {
      cy.visit('/registration');

      cy.contains('label', 'First Name').parent().find('input').type('Test');
      cy.contains('label', 'Last Name').parent().find('input').type('User');
      cy.contains('label', 'Email').parent().find('input').type('test@example.com');
      cy.contains('label', 'Password').parent().find('input').type('password123');
      cy.contains('label', 'Confirm Password').parent().find('input').type('different123');

      cy.get('button[type="submit"]').click();

      cy.contains(/passwords do not match/i).should('be.visible');
    });

    it('should prevent duplicate email registration', () => {
      cy.visit('/registration');

      cy.contains('label', 'First Name').parent().find('input').type(testUser.firstName);
      cy.contains('label', 'Last Name').parent().find('input').type(testUser.lastName);
      cy.contains('label', 'Email').parent().find('input').type(testUser.email);
      cy.contains('label', 'Password').parent().find('input').type(testUser.password);
      cy.contains('label', 'Confirm Password').parent().find('input').type(testUser.password);

      cy.get('button[type="submit"]').click();

      cy.contains(/already/i, { timeout: 5000 }).should('be.visible');
    });
  });

  describe('Login Flow', () => {
    it('should allow registered user to login', () => {
      cy.visit('/login');

      cy.contains('label', 'Email').parent().find('input').type(testUser.email);
      cy.contains('label', 'Password').parent().find('input').type(testUser.password);

      cy.get('button[type="submit"]').click();

      cy.url({ timeout: 5000 }).should('not.include', '/login');
      cy.contains(/success/i).should('be.visible');
      cy.get('header').should('contain', testUser.firstName);
    });

    it('should show error for invalid credentials', () => {
      cy.visit('/login');

      cy.contains('label', 'Email').parent().find('input').type('wrong@example.com');
      cy.contains('label', 'Password').parent().find('input').type('wrongpassword');

      cy.get('button[type="submit"]').click();

      cy.url().should('include', '/login');
    });

    it('should show validation errors for empty fields', () => {
      cy.visit('/login');

      cy.get('button[type="submit"]').click();

      cy.contains(/email is required/i).should('be.visible');
      cy.contains(/password is required/i).should('be.visible');
    });
  });

  describe('Protected Routes - With Authentication', () => {
    it('should redirect unauthenticated users to login', () => {
      cy.visit('/home');
      cy.url({ timeout: 5000 }).should('include', '/login');
    });

    it('should allow access to protected routes after login', () => {
      cy.visit('/login');
      cy.contains('label', 'Email').parent().find('input').type(testUser.email);
      cy.contains('label', 'Password').parent().find('input').type(testUser.password);
      cy.get('button[type="submit"]').click();

      cy.url({ timeout: 5000 }).should('not.include', '/login');
      cy.get('header').should('contain', testUser.firstName);

      cy.visit('/');
      cy.url().should('not.include', '/login');
      cy.get('header').should('be.visible');
    });

    it('should redirect logged-in users away from login page', () => {
      cy.visit('/login');
      cy.contains('label', 'Email').parent().find('input').type(testUser.email);
      cy.contains('label', 'Password').parent().find('input').type(testUser.password);
      cy.get('button[type="submit"]').click();
      cy.url({ timeout: 5000 }).should('not.include', '/login');

      cy.visit('/login');
      cy.url({ timeout: 3000 }).should('not.include', '/login');
    });
  });

  describe('Logout Flow', () => {
    beforeEach(() => {
      cy.visit('/login');
      cy.contains('label', 'Email').parent().find('input').type(testUser.email);
      cy.contains('label', 'Password').parent().find('input').type(testUser.password);
      cy.get('button[type="submit"]').click();
      cy.url({ timeout: 5000 }).should('not.include', '/login');
    });

    it('should allow user to logout', () => {
      cy.get('[data-testid="user-avatar"]').click();
      cy.contains(/logout/i).click();
      cy.url({ timeout: 5000 }).should('include', '/login');
    });

    it('should clear authentication after logout', () => {
      cy.get('[data-testid="user-avatar"]').click();
      cy.contains(/logout/i).click();
      cy.url({ timeout: 5000 }).should('include', '/login');

      cy.visit('/home');
      cy.url().should('include', '/login');
    });
  });

  describe('Session Persistence', () => {
    it('should persist login after page reload', () => {
      cy.visit('/login');
      cy.contains('label', 'Email').parent().find('input').type(testUser.email);
      cy.contains('label', 'Password').parent().find('input').type(testUser.password);
      cy.get('button[type="submit"]').click();
      cy.url({ timeout: 5000 }).should('not.include', '/login');

      cy.reload();

      cy.url().should('not.include', '/login');
      cy.get('header').should('contain', testUser.firstName);
    });

    it('should maintain session across navigation', () => {
      cy.visit('/login');
      cy.contains('label', 'Email').parent().find('input').type(testUser.email);
      cy.contains('label', 'Password').parent().find('input').type(testUser.password);
      cy.get('button[type="submit"]').click();
      cy.url({ timeout: 5000 }).should('not.include', '/login');

      cy.visit('/');
      cy.url().should('not.include', '/login');

      cy.reload();
      cy.url().should('not.include', '/login');
      cy.get('header').should('contain', testUser.firstName);
    });
  });
});
