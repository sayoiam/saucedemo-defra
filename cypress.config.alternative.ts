import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://www.saucedemo.com',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    video: true,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: [
      'cypress/e2e/**/*.cy.ts'
    ],
    setupNodeEvents(on, config) {
      // Mochawesome reporter only
      require('cypress-mochawesome-reporter/plugin')(on);

      // Simple custom tasks
      on('task', {
        log(message) {
          console.log(message);
          return null;
        }
      });

      return config;
    },
    env: {
      STANDARD_USER: 'standard_user',
      LOCKED_OUT_USER: 'locked_out_user',
      PROBLEM_USER: 'problem_user',
      PERFORMANCE_GLITCH_USER: 'performance_glitch_user',
      ERROR_USER: 'error_user',
      VISUAL_USER: 'visual_user',
      PASSWORD: 'secret_sauce'
    },
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      charts: true,
      reportPageTitle: 'SauceDemo Test Report',
      embeddedScreenshots: true,
      inlineAssets: true,
      saveAllAttempts: false,
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: true
    }
  }
});

