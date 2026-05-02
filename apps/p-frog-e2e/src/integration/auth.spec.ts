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
      cy.contains('label', 'Username').should('be.visible');
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
    userName: 'testuser_' + Date.now(),
    email: 'test_' + Date.now() + '@example.com',
    password: 'TestPassword123!',
  };

  beforeEach(() => {
    // Clear localStorage and cookies before each test
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  describe('Registration Flow', () => {
    it('should allow a new user to register', () => {
      // Navigate to registration page
      cy.visit('/registration');

      // Fill out the registration form using label-based selectors
      cy.contains('label', 'First Name').parent().find('input').type(testUser.firstName);
      cy.contains('label', 'Last Name').parent().find('input').type(testUser.lastName);
      cy.contains('label', 'Username').parent().find('input').type(testUser.userName);
      cy.contains('label', 'Email').parent().find('input').type(testUser.email);
      cy.contains('label', 'Password').parent().find('input').type(testUser.password);
      cy.contains('label', 'Confirm Password').parent().find('input').type(testUser.password);

      // Submit the form
      cy.get('button[type="submit"]').click();

      // Should redirect to login page after successful registration
      cy.url().should('include', '/login');
      
      // Should show success notification
      cy.contains(/registration successful/i, { timeout: 5000 }).should('be.visible');
    });

    it('should show validation errors for invalid input', () => {
      cy.visit('/registration');

      // Try to submit empty form
      cy.get('button[type="submit"]').click();

      // Should show validation errors
      cy.contains(/first name is required/i).should('be.visible');
      cy.contains(/last name is required/i).should('be.visible');
      cy.contains(/username is required/i).should('be.visible');
    });

    it('should validate password matching', () => {
      cy.visit('/registration');

      // Fill form with non-matching passwords
      cy.contains('label', 'First Name').parent().find('input').type('Test');
      cy.contains('label', 'Last Name').parent().find('input').type('User');
      cy.contains('label', 'Username').parent().find('input').type('testuser');
      cy.contains('label', 'Email').parent().find('input').type('test@example.com');
      cy.contains('label', 'Password').parent().find('input').type('password123');
      cy.contains('label', 'Confirm Password').parent().find('input').type('different123');

      cy.get('button[type="submit"]').click();

      // Should show password mismatch error
      cy.contains(/passwords do not match/i).should('be.visible');
    });

    it('should prevent duplicate username registration', () => {
      cy.visit('/registration');

      // Try to register with existing username (assuming testUser was created)
      cy.contains('label', 'First Name').parent().find('input').type(testUser.firstName);
      cy.contains('label', 'Last Name').parent().find('input').type(testUser.lastName);
      cy.contains('label', 'Username').parent().find('input').type(testUser.userName);
      cy.contains('label', 'Email').parent().find('input').type('another@example.com');
      cy.contains('label', 'Password').parent().find('input').type(testUser.password);
      cy.contains('label', 'Confirm Password').parent().find('input').type(testUser.password);

      cy.get('button[type="submit"]').click();

      // Should show error about existing user
      cy.contains(/already/i, { timeout: 5000 }).should('be.visible');
    });
  });

  describe('Login Flow', () => {
    it('should allow registered user to login', () => {
      // Navigate to login page
      cy.visit('/login');

      // Fill in credentials using label-based selectors
      cy.contains('label', 'Username').parent().find('input').type(testUser.userName);
      cy.contains('label', 'Password').parent().find('input').type(testUser.password);

      // Submit login form
      cy.get('button[type="submit"]').click();

      // Should redirect away from login
      cy.url({ timeout: 5000 }).should('not.include', '/login');

      // Should show success notification
      cy.contains(/success/i).should('be.visible');

      // Should show user info in header
      cy.get('header').should('contain', testUser.firstName);
    });

    it('should allow login with email instead of username', () => {
      cy.visit('/login');

      // Use email instead of username
      cy.contains('label', 'Username').parent().find('input').type(testUser.email);
      cy.contains('label', 'Password').parent().find('input').type(testUser.password);

      cy.get('button[type="submit"]').click();

      // Should successfully login
      cy.url({ timeout: 5000 }).should('not.include', '/login');
    });

    it('should show error for invalid credentials', () => {
      cy.visit('/login');

      // Enter wrong credentials
      cy.contains('label', 'Username').parent().find('input').type('wronguser');
      cy.contains('label', 'Password').parent().find('input').type('wrongpassword');

      cy.get('button[type="submit"]').click();

      // Should remain on login page
      cy.url().should('include', '/login');
    });

    it('should show validation errors for empty fields', () => {
      cy.visit('/login');

      // Try to submit empty form
      cy.get('button[type="submit"]').click();

      // Should show validation errors
      cy.contains(/username is required/i).should('be.visible');
      cy.contains(/password is required/i).should('be.visible');
    });
  });

  describe('Protected Routes - With Authentication', () => {
    it('should redirect unauthenticated users to login', () => {
      // Try to access protected route
      cy.visit('/home');

      // Should redirect to login
      cy.url({ timeout: 5000 }).should('include', '/login');
    });

    it('should allow access to protected routes after login', () => {
      // Login first
      cy.visit('/login');
      cy.contains('label', 'Username').parent().find('input').type(testUser.userName);
      cy.contains('label', 'Password').parent().find('input').type(testUser.password);
      cy.get('button[type="submit"]').click();

      // Wait for redirect away from login
      cy.url({ timeout: 5000 }).should('not.include', '/login');

      // User info should be visible in header (proving authentication persisted)
      cy.get('header').should('contain', testUser.firstName);
      
      // Try navigating to root - should stay authenticated
      cy.visit('/');
      cy.url().should('not.include', '/login');
      cy.get('header').should('be.visible');
    });

    it('should redirect logged-in users away from login page', () => {
      // Login first
      cy.visit('/login');
      cy.contains('label', 'Username').parent().find('input').type(testUser.userName);
      cy.contains('label', 'Password').parent().find('input').type(testUser.password);
      cy.get('button[type="submit"]').click();
      cy.url({ timeout: 5000 }).should('not.include', '/login');

      // Try to visit login page again
      cy.visit('/login');

      // Should redirect to home
      cy.url({ timeout: 3000 }).should('not.include', '/login');
    });
  });

  describe('Logout Flow', () => {
    beforeEach(() => {
      // Login before each test
      cy.visit('/login');
      cy.contains('label', 'Username').parent().find('input').type(testUser.userName);
      cy.contains('label', 'Password').parent().find('input').type(testUser.password);
      cy.get('button[type="submit"]').click();
      cy.url({ timeout: 5000 }).should('not.include', '/login');
    });

    it('should allow user to logout', () => {
      // Click on user avatar/dropdown
      cy.get('[data-testid="user-avatar"]').click();

      // Click logout option
      cy.contains(/logout/i).click();

      // Should redirect to login page
      cy.url({ timeout: 5000 }).should('include', '/login');
    });

    it('should clear authentication after logout', () => {
      // Logout
      cy.get('[data-testid="user-avatar"]').click();
      cy.contains(/logout/i).click();
      cy.url({ timeout: 5000 }).should('include', '/login');

      // Try to access protected route
      cy.visit('/home');

      // Should redirect back to login
      cy.url().should('include', '/login');
    });
  });

  describe('Session Persistence', () => {
    it('should persist login after page reload', () => {
      // Login
      cy.visit('/login');
      cy.contains('label', 'Username').parent().find('input').type(testUser.userName);
      cy.contains('label', 'Password').parent().find('input').type(testUser.password);
      cy.get('button[type="submit"]').click();
      cy.url({ timeout: 5000 }).should('not.include', '/login');

      // Reload page
      cy.reload();

      // Should still be logged in
      cy.url().should('not.include', '/login');
      cy.get('header').should('contain', testUser.firstName);
    });

    it('should maintain session across navigation', () => {
      // Login
      cy.visit('/login');
      cy.contains('label', 'Username').parent().find('input').type(testUser.userName);
      cy.contains('label', 'Password').parent().find('input').type(testUser.password);
      cy.get('button[type="submit"]').click();
      cy.url({ timeout: 5000 }).should('not.include', '/login');

      // Navigate around the app
      cy.visit('/');
      cy.url().should('not.include', '/login');
      
      // Reload again to verify session truly persists
      cy.reload();
      cy.url().should('not.include', '/login');

      // Should still be authenticated
      cy.get('header').should('contain', testUser.firstName);
    });
  });
});
