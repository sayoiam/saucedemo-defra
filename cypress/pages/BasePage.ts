import { config } from '../support/config';

/**
 * Base Page class containing common functionality for all page objects
 */
export abstract class BasePage {
  protected baseUrl: string = config.baseUrl;
  
  /**
   * Navigate to a specific URL
   * @param url - The URL to navigate to
   */
  visit(url: string = ''): void {
    cy.visit(url);
  }
  
  /**
   * Wait for page to load completely
   */
  waitForPageLoad(): void {
    cy.get('body').should('be.visible');
  }
  
  /**
   * Get page title
   */
  getTitle(): Cypress.Chainable<string> {
    return cy.title();
  }
  
  /**
   * Get current URL
   */
  getCurrentUrl(): Cypress.Chainable<string> {
    return cy.url();
  }
  
  /**
   * Take screenshot with custom name
   * @param name - Screenshot name
   */
  takeScreenshot(name: string): void {
    cy.screenshot(name);
  }
  
  /**
   * Wait for element to be visible
   * @param selector - Element selector
   * @param timeout - Optional timeout
   */
  waitForElement(selector: string, timeout: number = config.timeouts.default): void {
    cy.get(selector, { timeout }).should('be.visible');
  }
  
  /**
   * Click element with retry logic
   * @param selector - Element selector
   */
  clickElement(selector: string): void {
    cy.get(selector).should('be.visible').click();
  }
  
  /**
   * Type text into element
   * @param selector - Element selector
   * @param text - Text to type
   */
  typeText(selector: string, text: string): void {
    cy.get(selector).should('be.visible').clear().type(text);
  }
  
  /**
   * Get element text
   * @param selector - Element selector
   */
  getElementText(selector: string): Cypress.Chainable<string> {
    return cy.get(selector).invoke('text');
  }
  
  /**
   * Check if element exists
   * @param selector - Element selector
   */
  elementExists(selector: string): Cypress.Chainable<boolean> {
    return cy.get('body').then($body => {
      return $body.find(selector).length > 0;
    });
  }
  
  /**
   * Scroll to element
   * @param selector - Element selector
   */
  scrollToElement(selector: string): void {
    cy.get(selector).scrollIntoView();
  }
  
  /**
   * Wait for specific amount of time
   * @param milliseconds - Time to wait
   */
  wait(milliseconds: number): void {
    cy.wait(milliseconds);
  }
  
  /**
   * Verify page URL contains expected path
   * @param expectedPath - Expected URL path
   */
  verifyUrl(expectedPath: string): void {
    cy.url().should('include', expectedPath);
  }
  
  /**
   * Verify page title
   * @param expectedTitle - Expected page title
   */
  verifyTitle(expectedTitle: string): void {
    cy.title().should('eq', expectedTitle);
  }
}

