import { defineConfig } from 'cypress';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import createEsbuildPlugin from '@badeball/cypress-cucumber-preprocessor/esbuild';

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
    videoCompression: false,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: [
      'cypress/e2e/**/*.cy.ts',
      'cypress/e2e/**/*.feature'
    ],
    setupNodeEvents(on, config) {
      const cucumberConfig = addCucumberPreprocessorPlugin(on, config);
      
      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      try {
        require('cypress-mochawesome-reporter/plugin')(on);
      } catch (error: any) {
        console.log('Mochawesome reporter plugin not available:', error.message);
      }

      on('task', {
        customLog(message) {
          console.log(message);
          return null;
        },
        customTable(message) {
          console.table(message);
          return null;
        }
      });

      return cucumberConfig || config;
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
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack'
    }
  }
});

