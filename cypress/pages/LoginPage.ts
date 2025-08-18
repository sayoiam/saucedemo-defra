import { BasePage } from './BasePage';
import { config } from '../support/config';

/**
 * Login Page Object Model
 */
export class LoginPage extends BasePage {
  // Selectors
  private readonly selectors = {
    usernameField: '[data-test="username"]',
    passwordField: '[data-test="password"]',
    loginButton: '[data-test="login-button"]',
    errorMessage: '[data-test="error"]',
    errorButton: '[data-test="error-button"]',
    loginLogo: '.login_logo',
    loginCredentials: '.login_credentials',
    loginPassword: '.login_password'
  };
  
  /**
   * Navigate to login page
   */
  navigateToLogin(): void {
    this.visit('/');
    this.waitForPageLoad();
  }
  
  /**
   * Enter username
   * @param username - Username to enter
   */
  enterUsername(username: string): void {
    this.typeText(this.selectors.usernameField, username);
  }
  
  /**
   * Enter password
   * @param password - Password to enter
   */
  enterPassword(password: string): void {
    this.typeText(this.selectors.passwordField, password);
  }
  
  /**
   * Click login button
   */
  clickLogin(): void {
    this.clickElement(this.selectors.loginButton);
  }
  
  /**
   * Perform complete login
   * @param username - Username
   * @param password - Password
   */
  login(username: string, password: string = config.password): void {
    this.enterUsername(username);
    this.enterPassword(password);
    this.clickLogin();
  }
  
  /**
   * Login with standard user
   */
  loginAsStandardUser(): void {
    this.login(config.users.standard);
  }
  
  /**
   * Login with locked out user
   */
  loginAsLockedOutUser(): void {
    this.login(config.users.lockedOut);
  }
  
  /**
   * Login with problem user
   */
  loginAsProblemUser(): void {
    this.login(config.users.problem);
  }
  
  /**
   * Login with performance glitch user
   */
  loginAsPerformanceGlitchUser(): void {
    this.login(config.users.performanceGlitch);
  }
  
  /**
   * Login with error user
   */
  loginAsErrorUser(): void {
    this.login(config.users.error);
  }
  
  /**
   * Login with visual user
   */
  loginAsVisualUser(): void {
    this.login(config.users.visual);
  }
  
  /**
   * Get error message text
   */
  getErrorMessage(): Cypress.Chainable<string> {
    return this.getElementText(this.selectors.errorMessage);
  }
  
  /**
   * Check if error message is displayed
   */
  isErrorMessageDisplayed(): void {
    cy.get(this.selectors.errorMessage).should('be.visible');
  }
  
  /**
   * Click error close button
   */
  closeErrorMessage(): void {
    this.clickElement(this.selectors.errorButton);
  }
  
  /**
   * Verify login page is loaded
   */
  verifyLoginPageLoaded(): void {
    cy.get(this.selectors.loginLogo).should('be.visible');
    cy.get(this.selectors.usernameField).should('be.visible');
    cy.get(this.selectors.passwordField).should('be.visible');
    cy.get(this.selectors.loginButton).should('be.visible');
  }
  
  /**
   * Verify accepted usernames are displayed
   */
  verifyAcceptedUsernames(): void {
    cy.get(this.selectors.loginCredentials).should('be.visible');
    cy.get(this.selectors.loginCredentials).should('contain', 'standard_user');
    cy.get(this.selectors.loginCredentials).should('contain', 'locked_out_user');
    cy.get(this.selectors.loginCredentials).should('contain', 'problem_user');
  }
  
  /**
   * Verify password information is displayed
   */
  verifyPasswordInfo(): void {
    cy.get(this.selectors.loginPassword).should('be.visible');
    cy.get(this.selectors.loginPassword).should('contain', 'secret_sauce');
  }
  
  /**
   * Clear username field
   */
  clearUsername(): void {
    cy.get(this.selectors.usernameField).clear();
  }
  
  /**
   * Clear password field
   */
  clearPassword(): void {
    cy.get(this.selectors.passwordField).clear();
  }
  
  /**
   * Clear both fields
   */
  clearFields(): void {
    this.clearUsername();
    this.clearPassword();
  }
  
  /**
   * Verify successful login by checking URL
   */
  verifySuccessfulLogin(): void {
    this.verifyUrl('/inventory.html');
  }
  
  /**
   * Verify failed login by checking error message
   * @param expectedError - Expected error message
   */
  verifyFailedLogin(expectedError?: string): void {
    this.isErrorMessageDisplayed();
    if (expectedError) {
      this.getErrorMessage().should('contain', expectedError);
    }
  }
}

