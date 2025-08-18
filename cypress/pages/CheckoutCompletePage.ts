import { BasePage } from './BasePage';

/**
 * Checkout Complete Page Object Model (Order Confirmation)
 */
export class CheckoutCompletePage extends BasePage {
  // Selectors
  private readonly selectors = {
    checkoutCompleteContainer: '.checkout_complete_container',
    completeHeader: '.complete-header',
    completeText: '.complete-text',
    ponyExpressImg: '.pony_express',
    backHomeButton: '[data-test="back-to-products"]',
    pageTitle: '.title',
    shoppingCartLink: '.shopping_cart_link',
    shoppingCartBadge: '.shopping_cart_badge'
  };
  
  /**
   * Navigate to checkout complete page
   */
  navigateToCheckoutComplete(): void {
    this.visit('/checkout-complete.html');
    this.waitForPageLoad();
  }
  
  /**
   * Verify checkout complete page is loaded
   */
  verifyCheckoutCompletePageLoaded(): void {
    cy.get(this.selectors.pageTitle).should('contain', 'Checkout: Complete!');
    this.verifyUrl('/checkout-complete.html');
  }
  
  /**
   * Get completion header text
   */
  getCompletionHeader(): Cypress.Chainable<string> {
    return this.getElementText(this.selectors.completeHeader);
  }
  
  /**
   * Get completion message text
   */
  getCompletionMessage(): Cypress.Chainable<string> {
    return this.getElementText(this.selectors.completeText);
  }
  
  /**
   * Click Back Home button
   */
  clickBackHome(): void {
    this.clickElement(this.selectors.backHomeButton);
  }
  
  /**
   * Verify order completion message
   */
  verifyOrderCompletionMessage(): void {
    this.getCompletionHeader().should('contain', 'Thank you for your order!');
    this.getCompletionMessage().should('contain', 'Your order has been dispatched');
  }
  
  /**
   * Verify pony express image is displayed
   */
  verifyPonyExpressImage(): void {
    cy.get(this.selectors.ponyExpressImg).should('be.visible');
  }
  
  /**
   * Verify back home button is visible and clickable
   */
  verifyBackHomeButton(): void {
    cy.get(this.selectors.backHomeButton).should('be.visible').and('be.enabled');
  }
  
  /**
   * Verify cart is empty after order completion
   */
  verifyCartIsEmpty(): void {
    cy.get('body').then($body => {
      if ($body.find(this.selectors.shoppingCartBadge).length > 0) {
        cy.get(this.selectors.shoppingCartBadge).should('not.exist');
      }
    });
  }
  
  /**
   * Verify back home redirects to inventory
   */
  verifyBackHomeRedirect(): void {
    this.clickBackHome();
    this.verifyUrl('/inventory.html');
  }
  
  /**
   * Verify all completion elements are displayed
   */
  verifyCompletionElementsDisplayed(): void {
    cy.get(this.selectors.checkoutCompleteContainer).should('be.visible');
    cy.get(this.selectors.completeHeader).should('be.visible');
    cy.get(this.selectors.completeText).should('be.visible');
    this.verifyPonyExpressImage();
    this.verifyBackHomeButton();
  }
  
  /**
   * Verify successful order completion
   */
  verifySuccessfulOrderCompletion(): void {
    this.verifyCheckoutCompletePageLoaded();
    this.verifyOrderCompletionMessage();
    this.verifyCompletionElementsDisplayed();
    this.verifyCartIsEmpty();
  }
  
  /**
   * Complete the order flow and return to inventory
   */
  completeOrderAndReturnHome(): void {
    this.verifySuccessfulOrderCompletion();
    this.clickBackHome();
    this.verifyUrl('/inventory.html');
  }
  
  /**
   * Verify order complete (alias for verifySuccessfulOrderCompletion)
   */
  verifyOrderComplete(): void {
    this.verifySuccessfulOrderCompletion();
  }
  
  /**
   * Get success message (alias for getCompletionHeader)
   */
  getSuccessMessage(): Cypress.Chainable<string> {
    return this.getCompletionHeader();
  }
}

