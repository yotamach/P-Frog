# P-Frog E2E Tests

Comprehensive end-to-end test suite for the P-Frog application using Cypress.

## Test Structure

### Test Suites

- **app.spec.ts** - Application-level tests (smoke tests, performance, security, accessibility)
- **auth.spec.ts** - Authentication flow tests (login, registration, logout, protected routes)
- **tasks.spec.ts** - Task management tests (CRUD operations, filtering, searching, task-project integration)
- **projects.spec.ts** - Project management tests (CRUD operations, project cards, task relationships)
- **navigation.spec.ts** - Navigation and layout tests (sidebar, header, breadcrumbs, responsive design)
- **dashboard.spec.ts** - Dashboard tests (statistics, widgets, charts, quick actions)
- **settings.spec.ts** - Settings page tests (profile, account, preferences)

## Running Tests

### Prerequisites

1. Start MongoDB:
   \`\`\`bash
   docker-compose up -d
   \`\`\`

2. Start the backend API:
   \`\`\`bash
   yarn start:server-dev
   \`\`\`

3. Start the frontend development server:
   \`\`\`bash
   yarn start
   \`\`\`

### Run All Tests

\`\`\`bash
# Headless mode
yarn nx e2e p-frog-e2e

# Interactive mode with Cypress UI
yarn nx e2e p-frog-e2e --watch
\`\`\`

### Run Specific Test Suite

\`\`\`bash
# Run authentication tests only
yarn nx e2e p-frog-e2e --spec="**/auth.spec.ts"

# Run tasks tests only
yarn nx e2e p-frog-e2e --spec="**/tasks.spec.ts"

# Run projects tests only
yarn nx e2e p-frog-e2e --spec="**/projects.spec.ts"
\`\`\`

## Custom Commands

The test suite includes custom Cypress commands for common operations:

### Authentication Commands

\`\`\`typescript
cy.login(email, password)           // Login with credentials
cy.logout()                          // Logout current user
cy.createTestUser()                  // Create a test user via API
cy.deleteTestUser(email)             // Clean up test user
\`\`\`

### Data Creation Commands

\`\`\`typescript
cy.createTask({
  title: 'Task Title',
  description: 'Task Description',
  status: 'In Progress',
  endDate: '2026-12-31',
  project: 'Project Name'
})

cy.createProject({
  title: 'Project Title',
  description: 'Project Description',
  dueDate: '2026-12-31'
})
\`\`\`

## Page Object Model

Page objects are available in \`src/support/app.po.ts\`:

\`\`\`typescript
import { loginPage, tasksPage, projectsPage, dashboardPage } from '../support/app.po';

// Use page objects in tests
loginPage.visit();
loginPage.login('user@example.com', 'password123');

tasksPage.visit();
tasksPage.clickCreateTask();
\`\`\`

## Test Data

Test fixtures are located in \`src/fixtures/\`:

- \`users.json\` - Sample user data
- \`tasks.json\` - Sample task data
- \`projects.json\` - Sample project data

## Best Practices

1. **Isolation**: Each test should be independent and not rely on other tests
2. **Clean Up**: Use \`beforeEach\` and \`afterEach\` to set up and tear down test data
3. **Waiting**: Use Cypress's built-in retry logic instead of arbitrary waits
4. **Selectors**: Prefer \`data-testid\` attributes over CSS classes or text content
5. **Custom Commands**: Reuse common operations through custom commands
6. **Page Objects**: Use page objects for better maintainability

## Coverage

The test suite covers:

- ✅ Authentication and authorization
- ✅ CRUD operations for tasks and projects
- ✅ Form validation
- ✅ Navigation and routing
- ✅ Responsive design
- ✅ Error handling
- ✅ User settings
- ✅ Data persistence
- ✅ Task-project relationships
- ✅ Search and filtering
- ✅ Security (XSS prevention, secure headers)
- ✅ Accessibility (ARIA labels, keyboard navigation)
- ✅ Performance (load times)

## Configuration

Cypress configuration is in \`cypress.config.ts\`:

- Base URL: \`http://localhost:4200\`
- Spec pattern: \`./src/integration/**/*.ts\`
- Videos: Enabled (saved to \`dist/cypress/apps/p-frog-e2e/videos\`)
- Screenshots: Enabled (saved to \`dist/cypress/apps/p-frog-e2e/screenshots\`)

## Troubleshooting

### Tests Failing Due to Network Issues

Ensure all services are running:
- MongoDB (port 27017)
- Backend API (port 3333)
- Frontend dev server (port 4200)

### Timeouts

Increase timeout in test if operations are slow:

\`\`\`typescript
cy.get('[data-testid="element"]', { timeout: 10000 })
\`\`\`

### Flaky Tests

- Check for race conditions
- Ensure proper waiting for API responses
- Verify element visibility before interaction

## CI/CD Integration

To run tests in CI:

\`\`\`bash
# Headless mode with video recording
yarn nx e2e p-frog-e2e --headless --record

# Generate JUnit reports
yarn nx e2e p-frog-e2e --reporter junit --reporter-options "mochaFile=results/test-results.xml"
\`\`\`

## Contributing

When adding new tests:

1. Follow existing naming conventions
2. Use appropriate test suite file
3. Add custom commands for reusable operations
4. Update page objects as needed
5. Document complex test scenarios
