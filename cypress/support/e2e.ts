// Essential imports only
import './commands';
import './config';

// Import accessibility testing
import 'cypress-axe';

// Import real events for better interaction simulation
import 'cypress-real-events';

// Import mochawesome reporter
import 'cypress-mochawesome-reporter/register';

// Minimal global configuration
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing the test on uncaught exceptions
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  return false;
});

// Minimal beforeEach hook
beforeEach(() => {
  // Inject axe-core for accessibility testing
  cy.injectAxe();
});

// Global test configuration
Cypress.config('retries', {
  runMode: 2,
  openMode: 0
});

// Type declarations
declare global {
  namespace Cypress {
    interface Chainable {
      loginAs(userType: string): Chainable<void>;
      addProductToCart(productName: string): Chainable<void>;
      testResponsive(viewports: string[]): Chainable<void>;
      performSecurityTests(): Chainable<void>;
      addTestContext(context: string): Chainable<void>;
      logStep(step: string): Chainable<void>;
      capturePerformanceMetrics(testName: string): Chainable<void>;
      generateTestSummary(testResults: any): Chainable<void>;
      screenshotWithMetadata(name: string, options?: any): Chainable<void>;
      generateAccessibilityReport(violations: any[]): Chainable<void>;
      generateSecurityReport(testType: string, results: any): Chainable<void>;
      generateResponsiveReport(viewport: string, results: any): Chainable<void>;
    }
  }
}

