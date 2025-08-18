import { BasePage } from './BasePage';

/**
 * Cart Page Object Model
 */
export class CartPage extends BasePage {
  // Selectors
  private readonly selectors = {
    cartContainer: '.cart_contents_container',
    cartList: '.cart_list',
    cartItem: '.cart_item',
    cartItemName: '.inventory_item_name',
    cartItemDesc: '.inventory_item_desc',
    cartItemPrice: '.inventory_item_price',
    cartQuantity: '.cart_quantity',
    removeButton: '[data-test^="remove"]',
    continueShoppingButton: '[data-test="continue-shopping"]',
    checkoutButton: '[data-test="checkout"]',
    pageTitle: '.title',
    shoppingCartLink: '.shopping_cart_link',
    shoppingCartBadge: '.shopping_cart_badge'
  };
  
  /**
   * Navigate to cart page
   */
  navigateToCart(): void {
    this.visit('/cart.html');
    this.waitForPageLoad();
  }
  
  /**
   * Verify cart page is loaded
   */
  verifyCartPageLoaded(): void {
    cy.get(this.selectors.pageTitle).should('contain', 'Your Cart');
    this.verifyUrl('/cart.html');
  }
  
  /**
   * Get all items in cart
   */
  getCartItems(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.cartItem);
  }
  
  /**
   * Get cart item count
   */
  getCartItemCount(): Cypress.Chainable<number> {
    return cy.get('body').then($body => {
      if ($body.find(this.selectors.cartItem).length > 0) {
        return cy.get(this.selectors.cartItem).its('length');
      } else {
        return cy.wrap(0);
      }
    });
  }
  
  /**
   * Get cart badge count
   */
  getCartBadgeCount(): Cypress.Chainable<number> {
    return cy.get('body').then($body => {
      if ($body.find(this.selectors.shoppingCartBadge).length > 0) {
        return cy.get(this.selectors.shoppingCartBadge).invoke('text').then(text => parseInt(text));
      } else {
        return cy.wrap(0);
      }
    });
  }
  
  /**
   * Get all product names in cart
   */
  getCartProductNames(): Cypress.Chainable<string[]> {
    return cy.get(this.selectors.cartItemName).then($elements => {
      return Array.from($elements, el => el.innerText);
    });
  }
  
  /**
   * Remove product from cart by name
   * @param productName - Name of the product to remove
   */
  removeProductFromCart(productName: string): void {
    cy.get(this.selectors.cartItem)
      .contains(this.selectors.cartItemName, productName)
      .parents(this.selectors.cartItem)
      .find(this.selectors.removeButton)
      .click();
  }
  
  /**
   * Remove all products from cart
   */
  removeAllProductsFromCart(): void {
    cy.get('body').then($body => {
      if ($body.find(this.selectors.removeButton).length > 0) {
        cy.get(this.selectors.removeButton).each($button => {
          cy.wrap($button).click();
        });
      }
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
   * Get product description by name
   * @param productName - Name of the product
   */
  getProductDescription(productName: string): Cypress.Chainable<string> {
    return cy.get(this.selectors.cartItem)
      .contains(this.selectors.cartItemName, productName)
      .parents(this.selectors.cartItem)
      .find(this.selectors.cartItemDesc)
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
   * Click Continue Shopping button
   */
  clickContinueShopping(): void {
    this.clickElement(this.selectors.continueShoppingButton);
  }
  
  /**
   * Click Checkout button
   */
  clickCheckout(): void {
    this.clickElement(this.selectors.checkoutButton);
  }
  
  /**
   * Verify product is in cart
   * @param productName - Name of the product
   */
  verifyProductInCart(productName: string): void {
    cy.get(this.selectors.cartItemName).should('contain', productName);
  }
  
  /**
   * Verify product is not in cart
   * @param productName - Name of the product
   */
  verifyProductNotInCart(productName: string): void {
    cy.get('body').then($body => {
      if ($body.find(this.selectors.cartItemName).length > 0) {
        cy.get(this.selectors.cartItemName).should('not.contain', productName);
      }
    });
  }
  
  /**
   * Verify cart is empty
   */
  verifyCartIsEmpty(): void {
    cy.get('body').then($body => {
      if ($body.find(this.selectors.cartItem).length === 0) {
        cy.get(this.selectors.cartList).should('not.contain', this.selectors.cartItem);
      }
    });
  }
  
  /**
   * Verify cart has items
   */
  verifyCartHasItems(): void {
    cy.get(this.selectors.cartItem).should('have.length.greaterThan', 0);
  }
  
  /**
   * Verify specific number of items in cart
   * @param expectedCount - Expected number of items
   */
  verifyCartItemCount(expectedCount: number): void {
    if (expectedCount === 0) {
      this.verifyCartIsEmpty();
    } else {
      cy.get(this.selectors.cartItem).should('have.length', expectedCount);
    }
  }
  
  /**
   * Verify cart badge count
   * @param expectedCount - Expected badge count
   */
  verifyCartBadgeCount(expectedCount: number): void {
    if (expectedCount === 0) {
      cy.get(this.selectors.shoppingCartBadge).should('not.exist');
    } else {
      cy.get(this.selectors.shoppingCartBadge).should('contain', expectedCount.toString());
    }
  }
  
  /**
   * Calculate total price of items in cart
   */
  calculateTotalPrice(): Cypress.Chainable<number> {
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
   * Verify continue shopping redirects to inventory
   */
  verifyContinueShoppingRedirect(): void {
    this.clickContinueShopping();
    this.verifyUrl('/inventory.html');
  }
  
  /**
   * Verify checkout redirects to checkout step one
   */
  verifyCheckoutRedirect(): void {
    this.clickCheckout();
    this.verifyUrl('/checkout-step-one.html');
  }
}

