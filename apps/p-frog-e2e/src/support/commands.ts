// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    login(email: string, password: string): Chainable<void>;
    logout(): Chainable<void>;
    createTestUser(): Chainable<{email: string; password: string; name: string}>;
    deleteTestUser(email: string): Chainable<void>;
    createTask(task: {title: string; description?: string; status?: string; endDate?: string; project?: string}): Chainable<void>;
    createProject(project: {title: string; description?: string; dueDate?: string}): Chainable<void>;
  }
}

// Login command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/home');
});

// Logout command
Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="user-avatar"]').click();
  cy.contains('Logout').click();
  cy.url().should('include', '/welcome');
});

// Create test user via better-auth API
Cypress.Commands.add('createTestUser', () => {
  const timestamp = Date.now();
  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: `test${timestamp}@example.com`,
    password: 'Test123!@#',
    name: `Test User ${timestamp}`
  };

  cy.request('POST', 'http://localhost:3333/api/auth/sign-up/email', {
    email: testUser.email,
    password: testUser.password,
    name: testUser.name,
    firstName: testUser.firstName,
    lastName: testUser.lastName,
  }).then((response) => {
    expect(response.status).to.eq(200);
  });

  return cy.wrap(testUser);
});

// Delete test user via API
Cypress.Commands.add('deleteTestUser', (email: string) => {
  // This would require admin endpoint or direct DB access
  // For now, we'll just log
  cy.log(`Test user ${email} should be cleaned up`);
});

// Create task command
Cypress.Commands.add('createTask', (task) => {
  cy.visit('/home/tasks');
  cy.contains('button', 'Create Task').click();
  
  cy.get('input[name="title"]').type(task.title);
  if (task.description) {
    cy.get('textarea[name="description"]').type(task.description);
  }
  if (task.status) {
    cy.get('input[name="status"]').parent().click();
    cy.contains(task.status).click();
  }
  if (task.endDate) {
    cy.get('input[name="endDate"]').type(task.endDate);
  }
  if (task.project) {
    cy.get('select[name="project"]').select(task.project);
  }
  
  cy.get('button[type="submit"]').click();
  cy.contains(task.title).should('be.visible');
});

// Create project command
Cypress.Commands.add('createProject', (project) => {
  cy.visit('/home/projects');
  cy.contains('button', 'Create Project').click();
  
  cy.get('input[name="title"]').type(project.title);
  if (project.description) {
    cy.get('textarea[name="description"]').type(project.description);
  }
  if (project.dueDate) {
    cy.get('input[name="dueDate"]').type(project.dueDate);
  }
  
  cy.get('button[type="submit"]').click();
  cy.contains(project.title).should('be.visible');
});
