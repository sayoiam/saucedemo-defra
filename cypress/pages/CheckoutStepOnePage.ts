import { BasePage } from './BasePage';
import { config } from '../support/config';

/**
 * Checkout Step One Page Object Model (Customer Information)
 */
export class CheckoutStepOnePage extends BasePage {
  // Selectors
  private readonly selectors = {
    checkoutContainer: '.checkout_info_container',
    firstNameField: '[data-test="firstName"]',
    lastNameField: '[data-test="lastName"]',
    postalCodeField: '[data-test="postalCode"]',
    cancelButton: '[data-test="cancel"]',
    continueButton: '[data-test="continue"]',
    errorMessage: '[data-test="error"]',
    errorButton: '[data-test="error-button"]',
    pageTitle: '.title'
  };
  
  /**
   * Navigate to checkout step one page
   */
  navigateToCheckoutStepOne(): void {
    this.visit('/checkout-step-one.html');
    this.waitForPageLoad();
  }
  
  /**
   * Verify checkout step one page is loaded
   */
  verifyCheckoutStepOnePageLoaded(): void {
    cy.get(this.selectors.pageTitle).should('contain', 'Checkout: Your Information');
    this.verifyUrl('/checkout-step-one.html');
  }
  
  /**
   * Enter first name
   * @param firstName - First name to enter
   */
  enterFirstName(firstName: string): void {
    this.typeText(this.selectors.firstNameField, firstName);
  }
  
  /**
   * Enter last name
   * @param lastName - Last name to enter
   */
  enterLastName(lastName: string): void {
    this.typeText(this.selectors.lastNameField, lastName);
  }
  
  /**
   * Enter postal code
   * @param postalCode - Postal code to enter
   */
  enterPostalCode(postalCode: string): void {
    this.typeText(this.selectors.postalCodeField, postalCode);
  }
  
  /**
   * Fill customer information form
   * @param firstName - First name
   * @param lastName - Last name
   * @param postalCode - Postal code
   */
  fillCustomerInformation(
    firstName: string = config.testData.customer.firstName,
    lastName: string = config.testData.customer.lastName,
    postalCode: string = config.testData.customer.postalCode
  ): void {
    this.enterFirstName(firstName);
    this.enterLastName(lastName);
    this.enterPostalCode(postalCode);
  }
  
  /**
   * Click Cancel button
   */
  clickCancel(): void {
    this.clickElement(this.selectors.cancelButton);
  }
  
  /**
   * Click Continue button
   */
  clickContinue(): void {
    this.clickElement(this.selectors.continueButton);
  }
  
  /**
   * Complete checkout step one with default data
   */
  completeCheckoutStepOne(): void {
    this.fillCustomerInformation();
    this.clickContinue();
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
  isErrorMessageDisplayed(): Cypress.Chainable<boolean> {
    return cy.get('body').then($body => {
      return $body.find(this.selectors.errorMessage).length > 0;
    });
  }
  
  /**
   * Fill first name only
   * @param firstName - First name to enter
   */
  fillFirstName(firstName: string): void {
    this.enterFirstName(firstName);
  }
  
  /**
   * Fill last name only
   * @param lastName - Last name to enter
   */
  fillLastName(lastName: string): void {
    this.enterLastName(lastName);
  }
  
  /**
   * Fill postal code only
   * @param postalCode - Postal code to enter
   */
  fillPostalCode(postalCode: string): void {
    this.enterPostalCode(postalCode);
  }
  
  /**
   * Close error message
   */
  closeErrorMessage(): void {
    this.clickElement(this.selectors.errorButton);
  }
  
  /**
   * Clear first name field
   */
  clearFirstName(): void {
    cy.get(this.selectors.firstNameField).clear();
  }
  
  /**
   * Clear last name field
   */
  clearLastName(): void {
    cy.get(this.selectors.lastNameField).clear();
  }
  
  /**
   * Clear postal code field
   */
  clearPostalCode(): void {
    cy.get(this.selectors.postalCodeField).clear();
  }
  
  /**
   * Clear all fields
   */
  clearAllFields(): void {
    this.clearFirstName();
    this.clearLastName();
    this.clearPostalCode();
  }
  
  /**
   * Verify form validation for empty first name
   */
  verifyFirstNameRequired(): void {
    this.clearFirstName();
    this.clickContinue();
    this.isErrorMessageDisplayed();
    this.getErrorMessage().should('contain', 'First Name is required');
  }
  
  /**
   * Verify form validation for empty last name
   */
  verifyLastNameRequired(): void {
    this.enterFirstName('John');
    this.clearLastName();
    this.clickContinue();
    this.isErrorMessageDisplayed();
    this.getErrorMessage().should('contain', 'Last Name is required');
  }
  
  /**
   * Verify form validation for empty postal code
   */
  verifyPostalCodeRequired(): void {
    this.enterFirstName('John');
    this.enterLastName('Doe');
    this.clearPostalCode();
    this.clickContinue();
    this.isErrorMessageDisplayed();
    this.getErrorMessage().should('contain', 'Postal Code is required');
  }
  
  /**
   * Verify cancel redirects to cart
   */
  verifyCancelRedirect(): void {
    this.clickCancel();
    this.verifyUrl('/cart.html');
  }
  
  /**
   * Verify continue with valid data redirects to step two
   */
  verifyContinueRedirect(): void {
    this.fillCustomerInformation();
    this.clickContinue();
    this.verifyUrl('/checkout-step-two.html');
  }
  
  /**
   * Test form with invalid data
   * @param firstName - First name (can be invalid)
   * @param lastName - Last name (can be invalid)
   * @param postalCode - Postal code (can be invalid)
   */
  testInvalidData(firstName: string, lastName: string, postalCode: string): void {
    this.fillCustomerInformation(firstName, lastName, postalCode);
    this.clickContinue();
  }
  
  /**
   * Verify all form fields are visible and enabled
   */
  verifyFormFieldsVisible(): void {
    cy.get(this.selectors.firstNameField).should('be.visible').and('be.enabled');
    cy.get(this.selectors.lastNameField).should('be.visible').and('be.enabled');
    cy.get(this.selectors.postalCodeField).should('be.visible').and('be.enabled');
    cy.get(this.selectors.cancelButton).should('be.visible').and('be.enabled');
    cy.get(this.selectors.continueButton).should('be.visible').and('be.enabled');
  }
}

