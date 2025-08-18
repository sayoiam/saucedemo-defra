/**
 * Enhanced reporting configuration for SauceDemo Cypress tests
 */

import { config } from './config';

// Custom command to add test context information
Cypress.Commands.add('addTestContext', (context: string) => {
  cy.task('log', `Test Context: ${context}`);
});

// Custom command to log test steps
Cypress.Commands.add('logStep', (step: string) => {
  cy.task('log', `Step: ${step}`);
});

// Custom command to capture performance metrics
Cypress.Commands.add('capturePerformanceMetrics', (testName: string) => {
  cy.window().then((win) => {
    const performance = win.performance;
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    const metrics = {
      testName,
      timestamp: new Date().toISOString(),
      loadTime: navigation.loadEventEnd - navigation.loadEventStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      networkTime: navigation.responseEnd - navigation.requestStart,
      renderTime: navigation.loadEventEnd - navigation.responseEnd
    };
    
    cy.task('log', `Performance Metrics for ${testName}:`);
    cy.task('table', metrics);
    
    // Store metrics for reporting
    cy.writeFile('cypress/reports/performance-metrics.json', metrics, { flag: 'a+' });
  });
});

// Custom command to generate test summary
Cypress.Commands.add('generateTestSummary', (testResults: any) => {
  const summary = {
    timestamp: new Date().toISOString(),
    totalTests: testResults.totalTests,
    passed: testResults.totalPassed,
    failed: testResults.totalFailed,
    skipped: testResults.totalSkipped,
    duration: testResults.totalDuration,
    browser: Cypress.browser.name,
    viewport: `${Cypress.config('viewportWidth')}x${Cypress.config('viewportHeight')}`,
    baseUrl: Cypress.config('baseUrl')
  };
  
  cy.writeFile('cypress/reports/test-summary.json', summary);
  cy.task('log', 'Test Summary Generated');
  cy.task('table', summary);
});

// Enhanced screenshot command with metadata
Cypress.Commands.add('screenshotWithMetadata', (name: string, options?: any) => {
  const metadata = {
    testName: Cypress.currentTest.title,
    specName: Cypress.spec.name,
    timestamp: new Date().toISOString(),
    viewport: `${Cypress.config('viewportWidth')}x${Cypress.config('viewportHeight')}`,
    browser: Cypress.browser.name,
    url: window.location.href
  };
  
  cy.screenshot(name, {
    ...options,
    onAfterScreenshot: (el, props) => {
      cy.writeFile(`cypress/screenshots/metadata/${name}-metadata.json`, metadata);
      if (options?.onAfterScreenshot) {
        options.onAfterScreenshot(el, props);
      }
    }
  });
});

// Custom command for accessibility report generation
Cypress.Commands.add('generateAccessibilityReport', (violations: any[]) => {
  const report = {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    testName: Cypress.currentTest.title,
    totalViolations: violations.length,
    violations: violations.map(violation => ({
      id: violation.id,
      impact: violation.impact,
      description: violation.description,
      help: violation.help,
      helpUrl: violation.helpUrl,
      nodes: violation.nodes.length
    }))
  };
  
  cy.writeFile('cypress/reports/accessibility-report.json', report, { flag: 'a+' });
  
  if (violations.length > 0) {
    cy.task('log', `Accessibility violations found: ${violations.length}`);
    violations.forEach(violation => {
      cy.task('log', `- ${violation.id}: ${violation.description}`);
    });
  }
});

// Custom command for security test reporting
Cypress.Commands.add('generateSecurityReport', (testType: string, results: any) => {
  const report = {
    timestamp: new Date().toISOString(),
    testType,
    url: window.location.href,
    testName: Cypress.currentTest.title,
    results,
    status: results.passed ? 'PASS' : 'FAIL'
  };
  
  cy.writeFile('cypress/reports/security-report.json', report, { flag: 'a+' });
  cy.task('log', `Security test ${testType}: ${report.status}`);
});

// Custom command for responsive test reporting
Cypress.Commands.add('generateResponsiveReport', (viewport: string, results: any) => {
  const report = {
    timestamp: new Date().toISOString(),
    viewport,
    url: window.location.href,
    testName: Cypress.currentTest.title,
    results,
    screenshots: results.screenshots || []
  };
  
  cy.writeFile('cypress/reports/responsive-report.json', report, { flag: 'a+' });
  cy.task('log', `Responsive test for ${viewport} completed`);
});

// Enhanced error reporting
Cypress.on('fail', (error, runnable) => {
  const errorReport = {
    timestamp: new Date().toISOString(),
    testName: runnable.title,
    specName: Cypress.spec.name,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    },
    browser: Cypress.browser.name,
    viewport: `${Cypress.config('viewportWidth')}x${Cypress.config('viewportHeight')}`,
    url: window.location.href
  };
  
  cy.writeFile('cypress/reports/error-report.json', errorReport, { flag: 'a+' });
  throw error;
});

// Test execution hooks for reporting
beforeEach(() => {
  // Clear previous test artifacts
  cy.task('log', `Starting test: ${Cypress.currentTest.title}`);
  
  // Capture initial state
  cy.url().then(url => {
    cy.task('log', `Test URL: ${url}`);
  });
});

afterEach(() => {
  // Capture final state and metrics
  cy.task('log', `Completed test: ${Cypress.currentTest.title}`);
  
  // Generate performance metrics for all tests
  cy.capturePerformanceMetrics(Cypress.currentTest.title);
});

// Export reporting utilities
export const reportingUtils = {
  /**
   * Generate consolidated test report
   */
  generateConsolidatedReport: () => {
    cy.task('log', 'Generating consolidated test report...');
    
    // This would combine all individual reports into a single comprehensive report
    cy.readFile('cypress/reports/test-summary.json').then((summary) => {
      cy.readFile('cypress/reports/performance-metrics.json').then((performance) => {
        cy.readFile('cypress/reports/accessibility-report.json').then((accessibility) => {
          cy.readFile('cypress/reports/security-report.json').then((security) => {
            const consolidatedReport = {
              generatedAt: new Date().toISOString(),
              summary: summary || {},
              performance: performance || {},
              accessibility: accessibility || {},
              security: security || {},
              framework: {
                cypress: Cypress.version,
                browser: Cypress.browser.name,
                baseUrl: Cypress.config('baseUrl')
              }
            };
            
            cy.writeFile('cypress/reports/consolidated-report.json', consolidatedReport);
            cy.task('log', 'Consolidated report generated successfully');
          });
        });
      });
    });
  },
  
  /**
   * Clean up old reports
   */
  cleanupReports: () => {
    cy.task('log', 'Cleaning up old reports...');
    // This would remove old report files to prevent accumulation
  }
};

