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
  },
});
