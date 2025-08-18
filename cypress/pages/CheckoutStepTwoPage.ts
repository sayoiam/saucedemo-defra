import { BasePage } from './BasePage';

/**
 * Checkout Step Two Page Object Model (Order Overview)
 */
export class CheckoutStepTwoPage extends BasePage {
  // Selectors
  private readonly selectors = {
    checkoutSummaryContainer: '.checkout_summary_container',
    cartList: '.cart_list',
    cartItem: '.cart_item',
    cartItemName: '.inventory_item_name',
    cartItemDesc: '.inventory_item_desc',
    cartItemPrice: '.inventory_item_price',
    cartQuantity: '.cart_quantity',
    paymentInfo: '.summary_info_label:contains("Payment Information:")',
    paymentValue: '.summary_value_label',
    shippingInfo: '.summary_info_label:contains("Shipping Information:")',
    shippingValue: '.summary_value_label',
    itemTotal: '.summary_subtotal_label',
    tax: '.summary_tax_label',
    total: '.summary_total_label',
    cancelButton: '[data-test="cancel"]',
    finishButton: '[data-test="finish"]',
    pageTitle: '.title'
  };
  
  /**
   * Navigate to checkout step two page
   */
  navigateToCheckoutStepTwo(): void {
    this.visit('/checkout-step-two.html');
    this.waitForPageLoad();
  }
  
  /**
   * Verify checkout step two page is loaded
   */
  verifyCheckoutStepTwoPageLoaded(): void {
    cy.get(this.selectors.pageTitle).should('contain', 'Checkout: Overview');
    this.verifyUrl('/checkout-step-two.html');
  }
  
  /**
   * Get all items in checkout overview
   */
  getCheckoutItems(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.cartItem);
  }
  
  /**
   * Get checkout item count
   */
  getCheckoutItemCount(): Cypress.Chainable<number> {
    return cy.get(this.selectors.cartItem).its('length');
  }
  
  /**
   * Get all product names in checkout
   */
  getCheckoutProductNames(): Cypress.Chainable<string[]> {
    return cy.get(this.selectors.cartItemName).then($elements => {
      return Array.from($elements, el => el.innerText);
    });
  }
  
  /**
   * Get product price by name
   * @param productName - Name of the product
   */
  getProductPrice(productName: string): Cypress.Chainable<string> {
    return cy.get(this.selectors.cartItem)
      .contains(this.selectors.cartItemName, productName)
      .parents(this.selectors.cartItem)
      .find(this.selectors.cartItemPrice)
      .invoke('text');
  }
  
  /**
   * Get product quantity by name
   * @param productName - Name of the product
   */
  getProductQuantity(productName: string): Cypress.Chainable<string> {
    return cy.get(this.selectors.cartItem)
      .contains(this.selectors.cartItemName, productName)
      .parents(this.selectors.cartItem)
      .find(this.selectors.cartQuantity)
      .invoke('text');
  }
  
  /**
   * Get payment information
   */
  getPaymentInfo(): Cypress.Chainable<string> {
    return cy.get('.summary_info').then($summaryInfo => {
      return cy.wrap($summaryInfo).find('.summary_value_label').first().invoke('text');
    });
  }
  
  /**
   * Get shipping information
   */
  getShippingInfo(): Cypress.Chainable<string> {
    return cy.get('.summary_info').then($summaryInfo => {
      return cy.wrap($summaryInfo).find('.summary_value_label').last().invoke('text');
    });
  }
  
  /**
   * Get item total (subtotal)
   */
  getItemTotal(): Cypress.Chainable<string> {
    return this.getElementText(this.selectors.itemTotal);
  }
  
  /**
   * Get tax amount
   */
  getTax(): Cypress.Chainable<string> {
    return this.getElementText(this.selectors.tax);
  }
  
  /**
   * Get total amount
   */
  getTotal(): Cypress.Chainable<string> {
    return this.getElementText(this.selectors.total);
  }
  
  /**
   * Get item total as number
   */
  getItemTotalAsNumber(): Cypress.Chainable<number> {
    return this.getItemTotal().then(text => {
      return parseFloat(text.replace('Item total: $', ''));
    });
  }
  
  /**
   * Get tax as number
   */
  getTaxAsNumber(): Cypress.Chainable<number> {
    return this.getTax().then(text => {
      return parseFloat(text.replace('Tax: $', ''));
    });
  }
  
  /**
   * Get total as number
   */
  getTotalAsNumber(): Cypress.Chainable<number> {
    return this.getTotal().then(text => {
      return parseFloat(text.replace('Total: $', ''));
    });
  }
  
  /**
   * Click Cancel button
   */
  clickCancel(): void {
    this.clickElement(this.selectors.cancelButton);
  }
  
  /**
   * Click Finish button
   */
  clickFinish(): void {
    this.clickElement(this.selectors.finishButton);
  }
  
  /**
   * Verify product is in checkout overview
   * @param productName - Name of the product
   */
  verifyProductInCheckout(productName: string): void {
    cy.get(this.selectors.cartItemName).should('contain', productName);
  }
  
  /**
   * Verify payment information is displayed
   */
  verifyPaymentInfoDisplayed(): void {
    this.getPaymentInfo().should('not.be.empty');
  }
  
  /**
   * Verify shipping information is displayed
   */
  verifyShippingInfoDisplayed(): void {
    this.getShippingInfo().should('not.be.empty');
  }
  
  /**
   * Verify price calculation is correct
   */
  verifyPriceCalculation(): void {
    this.getItemTotalAsNumber().then(itemTotal => {
      this.getTaxAsNumber().then(tax => {
        this.getTotalAsNumber().then(total => {
          const expectedTotal = itemTotal + tax;
          expect(total).to.be.closeTo(expectedTotal, 0.01);
        });
      });
    });
  }
  
  /**
   * Verify cancel redirects to inventory
   */
  verifyCancelRedirect(): void {
    this.clickCancel();
    this.verifyUrl('/inventory.html');
  }
  
  /**
   * Verify finish redirects to checkout complete
   */
  verifyFinishRedirect(): void {
    this.clickFinish();
    this.verifyUrl('/checkout-complete.html');
  }
  
  /**
   * Calculate expected item total from individual prices
   */
  calculateExpectedItemTotal(): Cypress.Chainable<number> {
    return cy.get(this.selectors.cartItemPrice).then($prices => {
      let total = 0;
      $prices.each((index, element) => {
        const priceText = element.innerText.replace('$', '');
        total += parseFloat(priceText);
      });
      return total;
    });
  }
  
  /**
   * Verify item total matches sum of individual prices
   */
  verifyItemTotalCalculation(): void {
    this.calculateExpectedItemTotal().then(expectedTotal => {
      this.getItemTotalAsNumber().then(actualTotal => {
        expect(actualTotal).to.be.closeTo(expectedTotal, 0.01);
      });
    });
  }
  
  /**
   * Verify all summary information is displayed
   */
  verifySummaryInfoDisplayed(): void {
    cy.get(this.selectors.itemTotal).should('be.visible');
    cy.get(this.selectors.tax).should('be.visible');
    cy.get(this.selectors.total).should('be.visible');
    this.verifyPaymentInfoDisplayed();
    this.verifyShippingInfoDisplayed();
  }
  
  /**
   * Verify order summary (alias for verifySummaryInfoDisplayed)
   */
  verifyOrderSummary(): void {
    this.verifySummaryInfoDisplayed();
    this.verifyItemTotalCalculation();
    this.verifyPriceCalculation();
  }
}

