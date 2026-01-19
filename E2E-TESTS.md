# E2E Test Execution Guide

## Quick Start

### 1. Start All Services

Run these commands in separate terminals:

**Terminal 1 - MongoDB:**
\`\`\`bash
docker-compose up -d
\`\`\`

**Terminal 2 - Backend API:**
\`\`\`bash
yarn start:server-dev
\`\`\`

**Terminal 3 - Frontend:**
\`\`\`bash
yarn start
\`\`\`

### 2. Run E2E Tests

**Terminal 4 - E2E Tests:**
\`\`\`bash
# Run all tests headless
yarn e2e:headless

# Run with Cypress UI (interactive)
yarn e2e:watch

# Run all tests (default)
yarn e2e
\`\`\`

## Test Suites Overview

| Suite | File | Tests | Description |
|-------|------|-------|-------------|
| **Application** | app.spec.ts | 15+ | Smoke tests, performance, security, accessibility |
| **Authentication** | auth.spec.ts | 20+ | Login, registration, logout, protected routes |
| **Tasks** | tasks.spec.ts | 25+ | Task CRUD, filtering, searching, validation |
| **Projects** | projects.spec.ts | 25+ | Project CRUD, cards, task relationships |
| **Navigation** | navigation.spec.ts | 30+ | Sidebar, header, routing, responsive design |
| **Dashboard** | dashboard.spec.ts | 20+ | Statistics, widgets, charts, quick actions |
| **Settings** | settings.spec.ts | 25+ | Profile, account, preferences |

**Total:** ~160+ end-to-end tests

## Running Specific Test Suites

\`\`\`bash
# Authentication tests only
yarn nx e2e p-frog-e2e --spec="src/integration/auth.spec.ts"

# Tasks tests only
yarn nx e2e p-frog-e2e --spec="src/integration/tasks.spec.ts"

# Projects tests only
yarn nx e2e p-frog-e2e --spec="src/integration/projects.spec.ts"

# Navigation tests only
yarn nx e2e p-frog-e2e --spec="src/integration/navigation.spec.ts"

# Dashboard tests only
yarn nx e2e p-frog-e2e --spec="src/integration/dashboard.spec.ts"

# Settings tests only
yarn nx e2e p-frog-e2e --spec="src/integration/settings.spec.ts"

# Application tests only
yarn nx e2e p-frog-e2e --spec="src/integration/app.spec.ts"
\`\`\`

## Running Tests by Category

### Smoke Tests
\`\`\`bash
yarn nx e2e p-frog-e2e --spec="src/integration/app.spec.ts" --grep="Smoke Tests"
\`\`\`

### CRUD Operations
\`\`\`bash
# Task CRUD
yarn nx e2e p-frog-e2e --spec="src/integration/tasks.spec.ts" --grep="Create Task|Edit Task|Delete Task"

# Project CRUD
yarn nx e2e p-frog-e2e --spec="src/integration/projects.spec.ts" --grep="Create Project|Edit Project|Delete Project"
\`\`\`

### Authentication Flow
\`\`\`bash
yarn nx e2e p-frog-e2e --spec="src/integration/auth.spec.ts"
\`\`\`

### UI/UX Tests
\`\`\`bash
yarn nx e2e p-frog-e2e --spec="src/integration/navigation.spec.ts"
\`\`\`

## Test Execution Options

### Headless Mode (CI/CD)
\`\`\`bash
yarn e2e:headless
\`\`\`

### Interactive Mode (Development)
\`\`\`bash
yarn e2e:watch
\`\`\`

### Specific Browser
\`\`\`bash
# Chrome
yarn nx e2e p-frog-e2e --browser chrome

# Firefox
yarn nx e2e p-frog-e2e --browser firefox

# Edge
yarn nx e2e p-frog-e2e --browser edge
\`\`\`

### Record Videos
\`\`\`bash
yarn nx e2e p-frog-e2e --record
\`\`\`

### Generate Reports
\`\`\`bash
yarn nx e2e p-frog-e2e --reporter junit --reporter-options "mochaFile=results/e2e-results.xml"
\`\`\`

## Test Coverage Areas

### ✅ Authentication & Authorization
- User registration with validation
- User login with error handling
- Logout functionality
- Protected route access
- Session persistence
- Token management

### ✅ Task Management
- Create tasks with all fields
- Edit task details
- Delete tasks with confirmation
- Filter tasks by status
- Search tasks by title
- Task-project relationships
- Date validation

### ✅ Project Management
- Create projects
- Edit project details
- Delete projects
- View project cards with task counts
- Task status badges
- Search and filter projects
- Due date management

### ✅ Navigation & Layout
- Sidebar navigation
- Header with user menu
- Breadcrumbs
- Footer
- Responsive design (mobile, tablet, desktop)
- Page transitions
- 404 pages
- Browser navigation (back/forward)

### ✅ Dashboard
- Statistics cards
- Recent tasks widget
- Recent projects widget
- Quick actions
- Activity feed
- Charts and visualizations
- Real-time updates

### ✅ Settings
- Profile management
- Password change
- Account deletion
- Theme preferences
- Notification settings
- Language selection
- Date format preferences
- Form validation

### ✅ Cross-cutting Concerns
- Performance (load times)
- Security (XSS, headers)
- Accessibility (ARIA, keyboard navigation)
- Error handling
- Data persistence
- Browser compatibility
- SEO meta tags

## Debugging Tests

### Open Cypress UI
\`\`\`bash
yarn e2e:watch
\`\`\`

### View Test Videos
Videos are saved to:
\`\`\`
dist/cypress/apps/p-frog-e2e/videos/
\`\`\`

### View Screenshots
Screenshots (on failure) are saved to:
\`\`\`
dist/cypress/apps/p-frog-e2e/screenshots/
\`\`\`

### Enable Debug Logging
\`\`\`bash
DEBUG=cypress:* yarn e2e
\`\`\`

## Troubleshooting

### Problem: Tests fail with connection errors

**Solution:**
1. Verify MongoDB is running: \`docker ps\`
2. Verify backend is running: \`curl http://localhost:3333/api/health\`
3. Verify frontend is running: \`curl http://localhost:4200\`

### Problem: Tests timeout

**Solution:**
- Increase timeout in \`cypress.config.ts\`
- Check network speed
- Ensure services aren't under heavy load

### Problem: Flaky tests

**Solution:**
- Check for race conditions
- Add explicit waits for API responses
- Verify element visibility before interaction
- Use \`cy.intercept()\` to mock slow API calls

### Problem: Database state conflicts

**Solution:**
- Each test should create its own test data
- Use unique identifiers (timestamps)
- Clean up test data after tests (if possible)

## CI/CD Integration

### GitHub Actions Example

\`\`\`yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:7.0
        ports:
          - 27017:27017
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: yarn install
      
      - name: Start backend
        run: yarn start:server-dev &
      
      - name: Start frontend
        run: yarn start &
      
      - name: Wait for services
        run: |
          npx wait-on http://localhost:3333
          npx wait-on http://localhost:4200
      
      - name: Run E2E tests
        run: yarn e2e:headless
      
      - name: Upload videos
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: cypress-videos
          path: dist/cypress/apps/p-frog-e2e/videos
      
      - name: Upload screenshots
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: cypress-screenshots
          path: dist/cypress/apps/p-frog-e2e/screenshots
\`\`\`

## Best Practices

1. **Write Atomic Tests**: Each test should be independent
2. **Use Custom Commands**: Reuse common operations
3. **Leverage Page Objects**: Maintain clean, readable tests
4. **Avoid Hard Waits**: Use Cypress's built-in retry logic
5. **Clean Test Data**: Create fresh data for each test
6. **Test User Flows**: Test complete user journeys, not just features
7. **Mock External Services**: Use \`cy.intercept()\` for third-party APIs
8. **Keep Tests Fast**: Parallelize when possible

## Maintenance

### Adding New Tests

1. Create test file in \`src/integration/\`
2. Follow existing naming conventions
3. Use page objects from \`src/support/app.po.ts\`
4. Add custom commands if needed
5. Update this guide

### Updating Tests

1. Run affected tests after changes
2. Update page objects if UI changes
3. Update custom commands if API changes
4. Maintain backward compatibility

## Support

For issues or questions:
- Check \`apps/p-frog-e2e/README.md\`
- Review Cypress docs: https://docs.cypress.io
- Check test files for examples
