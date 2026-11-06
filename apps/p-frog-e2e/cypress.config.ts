import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    fileServerFolder: '.',
    fixturesFolder: './src/fixtures',
    specPattern: './src/integration/**/*.ts',
    supportFile: './src/support/index.ts',
    video: true,
    videosFolder: '../../dist/cypress/apps/p-frog-e2e/videos',
    screenshotsFolder: '../../dist/cypress/apps/p-frog-e2e/screenshots',
    chromeWebSecurity: false,
    baseUrl: 'http://localhost:4200',
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
  },
  // Use spec reporter which shows errors immediately after each failed test
  reporter: 'spec',
});
