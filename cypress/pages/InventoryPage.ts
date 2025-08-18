import { BasePage } from './BasePage';
import { config } from '../support/config';

/**
 * Inventory Page Object Model
 */
export class InventoryPage extends BasePage {
  // Selectors
  private readonly selectors = {
    inventoryContainer: '.inventory_container',
    inventoryList: '.inventory_list',
    inventoryItem: '.inventory_item',
    inventoryItemName: '.inventory_item_name',
    inventoryItemDesc: '.inventory_item_desc',
    inventoryItemPrice: '.inventory_item_price',
    inventoryItemImg: '.inventory_item_img',
    addToCartButton: '[data-test^="add-to-cart"]',
    removeButton: '[data-test^="remove"]',
    shoppingCartLink: '.shopping_cart_link',
    shoppingCartBadge: '.shopping_cart_badge',
    sortDropdown: '[data-test="product_sort_container"]',
    menuButton: '#react-burger-menu-btn',
    menuSidebar: '.bm-menu',
    allItemsLink: '#inventory_sidebar_link',
    aboutLink: '#about_sidebar_link',
    logoutLink: '#logout_sidebar_link',
    resetAppLink: '#reset_sidebar_link',
    closeMenuButton: '#react-burger-cross-btn',
    pageTitle: '.title',
    footer: '.footer'
  };
  
  /**
   * Navigate to inventory page
   */
  navigateToInventory(): void {
    this.visit('/inventory.html');
    this.waitForPageLoad();
  }
  
  /**
   * Verify inventory page is loaded
   */
  verifyInventoryPageLoaded(): void {
    cy.get(this.selectors.inventoryContainer).should('be.visible');
    cy.get(this.selectors.pageTitle).should('contain', 'Products');
    this.verifyUrl('/inventory.html');
  }
  
  /**
   * Get all product names
   */
  getAllProductNames(): Cypress.Chainable<string[]> {
    return cy.get(this.selectors.inventoryItemName).then($elements => {
      return Array.from($elements, el => el.innerText);
    });
  }
  
  /**
   * Get product count
   */
  getProductCount(): Cypress.Chainable<number> {
    return cy.get(this.selectors.inventoryItem).its('length');
  }
  
  /**
   * Add product to cart by name
   * @param productName - Name of the product to add
   */
  addProductToCart(productName: string): void {
    cy.get(this.selectors.inventoryItem)
      .contains(this.selectors.inventoryItemName, productName)
      .parents(this.selectors.inventoryItem)
      .find(this.selectors.addToCartButton)
      .click();
  }
  
  /**
   * Remove product from cart by name
   * @param productName - Name of the product to remove
   */
  removeProductFromCart(productName: string): void {
    cy.get(this.selectors.inventoryItem)
      .contains(this.selectors.inventoryItemName, productName)
      .parents(this.selectors.inventoryItem)
      .find(this.selectors.removeButton)
      .click();
  }
  
  /**
   * Add multiple products to cart
   * @param productNames - Array of product names to add
   */
  addMultipleProductsToCart(productNames: string[]): void {
    productNames.forEach(productName => {
      this.addProductToCart(productName);
    });
  }
  
  /**
   * Get product price by name
   * @param productName - Name of the product
   */
  getProductPrice(productName: string): Cypress.Chainable<string> {
    return cy.get(this.selectors.inventoryItem)
      .contains(this.selectors.inventoryItemName, productName)
      .parents(this.selectors.inventoryItem)
      .find(this.selectors.inventoryItemPrice)
      .invoke('text');
  }
  
  /**
   * Get product description by name
   * @param productName - Name of the product
   */
  getProductDescription(productName: string): Cypress.Chainable<string> {
    return cy.get(this.selectors.inventoryItem)
      .contains(this.selectors.inventoryItemName, productName)
      .parents(this.selectors.inventoryItem)
      .find(this.selectors.inventoryItemDesc)
      .invoke('text');
  }
  
  /**
   * Click on product name to view details
   * @param productName - Name of the product
   */
  clickProductName(productName: string): void {
    cy.get(this.selectors.inventoryItemName)
      .contains(productName)
      .click();
  }
  
  /**
   * Click on product image to view details
   * @param productName - Name of the product
   */
  clickProductImage(productName: string): void {
    cy.get(this.selectors.inventoryItem)
      .contains(this.selectors.inventoryItemName, productName)
      .parents(this.selectors.inventoryItem)
      .find(this.selectors.inventoryItemImg)
      .click();
  }
  
  /**
   * Sort products by option
   * @param sortOption - Sort option (az, za, lohi, hilo)
   */
  sortProducts(sortOption: 'az' | 'za' | 'lohi' | 'hilo'): void {
    cy.get(this.selectors.sortDropdown).select(sortOption);
  }
  
  /**
   * Sort products by name A to Z
   */
  sortByNameAZ(): void {
    this.sortProducts('az');
  }
  
  /**
   * Sort products by name Z to A
   */
  sortByNameZA(): void {
    this.sortProducts('za');
  }
  
  /**
   * Sort products by price low to high
   */
  sortByPriceLowToHigh(): void {
    this.sortProducts('lohi');
  }
  
  /**
   * Sort products by price high to low
   */
  sortByPriceHighToLow(): void {
    this.sortProducts('hilo');
  }
  
  /**
   * Get cart item count
   */
  getCartItemCount(): Cypress.Chainable<number> {
    return cy.get('body').then($body => {
      if ($body.find(this.selectors.shoppingCartBadge).length > 0) {
        return cy.get(this.selectors.shoppingCartBadge).invoke('text').then(text => parseInt(text));
      } else {
        return cy.wrap(0);
      }
    });
  }
  
  /**
   * Click shopping cart
   */
  clickShoppingCart(): void {
    this.clickElement(this.selectors.shoppingCartLink);
  }
  
  /**
   * Click cart icon (alias for clickShoppingCart)
   */
  clickCartIcon(): void {
    this.clickShoppingCart();
  }
  
  /**
   * Open menu
   */
  openMenu(): void {
    this.clickElement(this.selectors.menuButton);
    cy.get(this.selectors.menuSidebar).should('be.visible');
  }
  
  /**
   * Close menu
   */
  closeMenu(): void {
    this.clickElement(this.selectors.closeMenuButton);
  }
  
  /**
   * Click All Items menu option
   */
  clickAllItems(): void {
    this.openMenu();
    this.clickElement(this.selectors.allItemsLink);
  }
  
  /**
   * Click About menu option
   */
  clickAbout(): void {
    this.openMenu();
    this.clickElement(this.selectors.aboutLink);
  }
  
  /**
   * Click Logout menu option
   */
  clickLogout(): void {
    this.openMenu();
    this.clickElement(this.selectors.logoutLink);
  }
  
  /**
   * Click Reset App State menu option
   */
  clickResetAppState(): void {
    this.openMenu();
    this.clickElement(this.selectors.resetAppLink);
  }
  
  /**
   * Verify product is added to cart
   * @param productName - Name of the product
   */
  verifyProductAddedToCart(productName: string): void {
    cy.get(this.selectors.inventoryItem)
      .contains(this.selectors.inventoryItemName, productName)
      .parents(this.selectors.inventoryItem)
      .find(this.selectors.removeButton)
      .should('be.visible');
  }
  
  /**
   * Verify product is removed from cart
   * @param productName - Name of the product
   */
  verifyProductRemovedFromCart(productName: string): void {
    cy.get(this.selectors.inventoryItem)
      .contains(this.selectors.inventoryItemName, productName)
      .parents(this.selectors.inventoryItem)
      .find(this.selectors.addToCartButton)
      .should('be.visible');
  }
  
  /**
   * Verify products are sorted correctly
   * @param sortType - Type of sorting to verify
   */
  verifySorting(sortType: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'): void {
    switch (sortType) {
      case 'name-asc':
        this.getAllProductNames().then(names => {
          const sortedNames = [...names].sort();
          expect(names).to.deep.equal(sortedNames);
        });
        break;
      case 'name-desc':
        this.getAllProductNames().then(names => {
          const sortedNames = [...names].sort().reverse();
          expect(names).to.deep.equal(sortedNames);
        });
        break;
      // Add price sorting verification logic here
    }
  }
}

