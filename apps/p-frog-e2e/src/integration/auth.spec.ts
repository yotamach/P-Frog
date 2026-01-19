describe('Authentication Flow', () => {
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
      cy.contains('Create your account').should('be.visible');
    });

    it('should show account details section', () => {
      cy.contains('Account details').should('be.visible');
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
