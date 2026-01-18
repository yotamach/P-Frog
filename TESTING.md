# Authentication Testing Guide

This document provides instructions for running the comprehensive authentication tests.

## Test Coverage

### Backend Tests (`apps/api`)
- **Auth Service Unit Tests** (`src/services/tests/auth.service.spec.ts`)
  - User signup functionality
  - User login with username/email
  - Password validation
  - Error handling
  
- **Auth Routes Integration Tests** (`src/routes/tests/auth.route.spec.ts`)
  - POST `/auth/login` endpoint
  - POST `/auth/signup` endpoint
  - GET `/auth/profile` endpoint
  - Request/response validation

### Frontend Tests (`apps/p-frog`)
- **Auth Queries Tests** (`src/data/queries/auth.queries.spec.ts`)
  - `useLogin` hook
  - `useSignUp` hook
  - `useLogout` hook
  - `initializeAuth` function
  - Token persistence in localStorage
  
- **Login Form Tests** (`src/pages/login/components/login-form.spec.tsx`)
  - Form rendering
  - Field validation
  - Submission handling
  - Loading states
  
- **Registration Form Tests** (`src/pages/registeration/components/registration-form.spec.tsx`)
  - Form rendering
  - Field validation
  - Password matching
  - Email validation
  
- **Protected Route Tests** (`src/components/auth/ProtectedRoute.spec.tsx`)
  - Authenticated user access
  - Unauthenticated redirects
  - Location preservation

### E2E Tests (`apps/p-frog-e2e`)
- **Auth Flow Tests** (`src/integration/auth.spec.ts`)
  - Complete registration flow
  - Login with username/email
  - Logout functionality
  - Protected route access
  - Session persistence
  - Form validation
  - Error handling

## Running the Tests

### Run All Tests
```bash
# Run all tests in the monorepo
yarn test

# Run tests with coverage
yarn test --coverage
```

### Run Backend Tests
```bash
# Run all backend tests
yarn test:server

# Run specific test file
yarn nx test api --testFile=auth.service.spec.ts

# Run with watch mode
yarn nx test api --watch
```

### Run Frontend Tests
```bash
# Run all frontend tests
yarn client:test

# Run specific test file
yarn nx test p-frog --testFile=auth.queries.spec.ts

# Run with watch mode
yarn nx test p-frog --watch

# Run with coverage
yarn nx test p-frog --coverage
```

### Run E2E Tests
```bash
# Open Cypress test runner
yarn nx e2e p-frog-e2e --watch

# Run E2E tests headlessly
yarn nx e2e p-frog-e2e

# Run specific test file
yarn nx e2e p-frog-e2e --spec=src/integration/auth.spec.ts
```

## Test Requirements

### Prerequisites
1. **MongoDB** must be running for backend integration tests
   ```bash
   docker-compose up -d
   ```

2. **Backend server** must be running for E2E tests
   ```bash
   yarn start:server-dev
   ```

3. **Frontend dev server** must be running for E2E tests
   ```bash
   yarn start
   ```

## Test Data

### Test User Credentials
The tests use dynamically generated test users to avoid conflicts:
- Username: `testuser_<timestamp>`
- Email: `test_<timestamp>@example.com`
- Password: `TestPassword123!`
- First Name: `Test`
- Last Name: `User`

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:7.0
        ports:
          - 27017:27017
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: yarn install
      - run: yarn test:server

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: yarn install
      - run: yarn client:test --coverage

  e2e-tests:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:7.0
        ports:
          - 27017:27017
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: yarn install
      - run: yarn start:server-dev &
      - run: yarn start &
      - run: yarn nx e2e p-frog-e2e --headless
```

## Debugging Tests

### Backend Tests
```bash
# Run with verbose output
yarn nx test api --verbose

# Run single test
yarn nx test api --testNamePattern="should successfully create a new user"
```

### Frontend Tests
```bash
# Debug specific test
yarn nx test p-frog --testNamePattern="should login successfully"

# Run with debugging
node --inspect-brk node_modules/.bin/jest --runInBand
```

### E2E Tests
```bash
# Open Cypress with debug mode
DEBUG=cypress:* yarn nx e2e p-frog-e2e --watch

# Record video of test run
yarn nx e2e p-frog-e2e --record
```

## Coverage Reports

After running tests with coverage, view the reports:

```bash
# Backend coverage
open coverage/apps/api/lcov-report/index.html

# Frontend coverage
open coverage/apps/p-frog/lcov-report/index.html
```

## Common Issues

### Issue: MongoDB Connection Failed
**Solution:** Ensure MongoDB is running via Docker:
```bash
docker-compose up -d
docker ps  # Verify MongoDB container is running
```

### Issue: E2E Tests Timeout
**Solution:** Ensure both backend and frontend servers are running:
```bash
# Terminal 1
yarn start:server-dev

# Terminal 2
yarn start
```

### Issue: Module Not Found in Tests
**Solution:** Clear Jest cache:
```bash
yarn nx test p-frog --clearCache
yarn nx test api --clearCache
```

## Best Practices

1. **Run tests before committing**
   ```bash
   yarn test
   ```

2. **Keep tests isolated** - Each test should be independent

3. **Use descriptive test names** - Follow "should [expected behavior]" pattern

4. **Mock external dependencies** - Don't make real API calls in unit tests

5. **Test edge cases** - Include error scenarios and validation failures

6. **Maintain test data** - Use factories or fixtures for consistent test data

## Further Reading

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Cypress Documentation](https://docs.cypress.io/)
- [Nx Testing Guide](https://nx.dev/recipes/testing)
