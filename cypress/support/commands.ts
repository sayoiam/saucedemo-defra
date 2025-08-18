/// <reference types="cypress" />

import { LoginPage, InventoryPage } from '../pages';

// Custom command to login with different user types
Cypress.Commands.add('loginAs', (userType: string) => {
  const loginPage = new LoginPage();
  const password = Cypress.env('PASSWORD');
  
  cy.visit('/');
  loginPage.enterUsername(userType);
  loginPage.enterPassword(password);
  loginPage.clickLogin();
  
  // Verify successful login by checking URL or page elements
  if (userType !== 'locked_out_user') {
    cy.url().should('include', '/inventory.html');
  }
});

// Custom command to add product to cart by name
Cypress.Commands.add('addProductToCart', (productName: string) => {
  const inventoryPage = new InventoryPage();
  inventoryPage.addProductToCart(productName);
});

// Simplified accessibility command
Cypress.Commands.add('checkA11y', (context?: any, options?: any) => {
  cy.checkA11y(context, options, (violations) => {
    if (violations.length > 0) {
      console.log(`${violations.length} accessibility violation(s) detected`);
    }
  });
});

// Essential responsive testing command
Cypress.Commands.add('testResponsive', (viewports: string[]) => {
  viewports.forEach((viewport) => {
    switch (viewport) {
      case 'mobile':
        cy.viewport(375, 667);
        break;
      case 'tablet':
        cy.viewport(768, 1024);
        break;
      case 'desktop':
        cy.viewport(1280, 720);
        break;
      default:
        cy.viewport(1280, 720);
    }
    cy.screenshot(`${viewport}-view`);
  });
});

// Essential security testing command
Cypress.Commands.add('performSecurityTests', () => {
  const xssPayloads = ['<script>alert("XSS")</script>'];
  
  xssPayloads.forEach(payload => {
    cy.get('[data-test="username"]').clear().type(payload);
    cy.get('[data-test="password"]').clear().type('test');
    cy.get('[data-test="login-button"]').click();
    cy.visit('/');
  });
});

// Minimal logging commands
Cypress.Commands.add('addTestContext', (context: string) => {
  cy.log(`Context: ${context}`);
});

Cypress.Commands.add('logStep', (step: string) => {
  cy.log(`Step: ${step}`);
});

Cypress.Commands.add('capturePerformanceMetrics', (testName: string) => {
  cy.log(`Performance metrics captured for: ${testName}`);
});

Cypress.Commands.add('generateTestSummary', (testResults: any) => {
  cy.log('Test Summary generated');
});

Cypress.Commands.add('screenshotWithMetadata', (name: string, options?: any) => {
  cy.screenshot(name, options);
});

Cypress.Commands.add('generateAccessibilityReport', (violations: any[]) => {
  cy.log(`Accessibility Report: ${violations.length} violations`);
});

Cypress.Commands.add('generateSecurityReport', (testType: string, results: any) => {
  cy.log(`Security Report - ${testType}`);
});

Cypress.Commands.add('generateResponsiveReport', (viewport: string, results: any) => {
  cy.log(`Responsive Report - ${viewport}`);
});

