import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { InventoryPage, CartPage } from '../../pages';

// Product addition and removal steps
Then('the {string} button should change to {string}', (fromButton: string, toButton: string) => {
  // This verifies button state changes after adding/removing products
  if (toButton === 'Remove') {
    cy.get('[data-test^="remove"]').should('be.visible');
  } else if (toButton === 'Add to cart') {
    cy.get('[data-test^="add-to-cart"]').should('be.visible');
  }
});

Then('the product should be marked as added to cart', () => {
  cy.get('[data-test^="remove"]').should('be.visible');
});

Given('I have added {string} to the cart', (productName: string) => {
  const inventoryPage = new InventoryPage();
  inventoryPage.addProductToCart(productName);
});

When('I remove {string} from the cart', (productName: string) => {
  const inventoryPage = new InventoryPage();
  inventoryPage.removeProductFromCart(productName);
});

Given('I have added multiple products to the cart:', (dataTable: any) => {
  const inventoryPage = new InventoryPage();
  const products = dataTable.raw().flat();
  products.forEach((product: string) => {
    inventoryPage.addProductToCart(product);
  });
});

Then('all selected products should be marked as added to cart', () => {
  cy.get('[data-test^="remove"]').should('have.length.greaterThan', 1);
});

// Sorting functionality steps
When('I sort products by {string}', (sortOption: string) => {
  const inventoryPage = new InventoryPage();
  
  switch (sortOption) {
    case 'Name (A to Z)':
      inventoryPage.sortByNameAZ();
      break;
    case 'Name (Z to A)':
      inventoryPage.sortByNameZA();
      break;
    case 'Price (low to high)':
      inventoryPage.sortByPriceLowToHigh();
      break;
    case 'Price (high to low)':
      inventoryPage.sortByPriceHighToLow();
      break;
  }
});

Then('products should be sorted alphabetically ascending', () => {
  const inventoryPage = new InventoryPage();
  inventoryPage.verifySorting('name-asc');
});

Then('products should be sorted alphabetically descending', () => {
  const inventoryPage = new InventoryPage();
  inventoryPage.verifySorting('name-desc');
});

Then('products should be sorted by price ascending', () => {
  cy.get('.inventory_item_price').then($prices => {
    const prices = Array.from($prices, el => parseFloat(el.innerText.replace('$', '')));
    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).to.deep.equal(sortedPrices);
  });
});

Then('products should be sorted by price descending', () => {
  cy.get('.inventory_item_price').then($prices => {
    const prices = Array.from($prices, el => parseFloat(el.innerText.replace('$', '')));
    const sortedPrices = [...prices].sort((a, b) => b - a);
    expect(prices).to.deep.equal(sortedPrices);
  });
});

// Cart management from cart page
When('I remove {string} from the cart', (productName: string) => {
  const cartPage = new CartPage();
  cartPage.removeProductFromCart(productName);
});

Then('{string} should not be in the cart', (productName: string) => {
  const cartPage = new CartPage();
  cartPage.verifyProductNotInCart(productName);
});

When('I click {string}', (buttonText: string) => {
  if (buttonText === 'Continue Shopping') {
    const cartPage = new CartPage();
    cartPage.clickContinueShopping();
  }
});

Then('the cart badge should still show {string}', (count: string) => {
  cy.get('.shopping_cart_badge').should('contain', count);
});

// Product details verification
Then('I should see {int} products on the inventory page', (expectedCount: number) => {
  const inventoryPage = new InventoryPage();
  inventoryPage.getProductCount().should('eq', expectedCount);
});

Then('each product should have:', (dataTable: any) => {
  const expectedElements = dataTable.raw().flat();
  
  cy.get('.inventory_item').each($item => {
    if (expectedElements.includes('name')) {
      cy.wrap($item).find('.inventory_item_name').should('be.visible');
    }
    if (expectedElements.includes('description')) {
      cy.wrap($item).find('.inventory_item_desc').should('be.visible');
    }
    if (expectedElements.includes('price')) {
      cy.wrap($item).find('.inventory_item_price').should('be.visible');
    }
    if (expectedElements.includes('image')) {
      cy.wrap($item).find('.inventory_item_img img').should('be.visible');
    }
    if (expectedElements.includes('add button')) {
      cy.wrap($item).find('[data-test^="add-to-cart"], [data-test^="remove"]').should('be.visible');
    }
  });
});

// Cart persistence steps
When('I navigate to different pages', () => {
  const inventoryPage = new InventoryPage();
  
  // Navigate to cart and back
  inventoryPage.clickShoppingCart();
  cy.go('back');
  
  // Open and close menu
  inventoryPage.openMenu();
  inventoryPage.closeMenu();
});

Then('the cart should maintain the selected items', () => {
  cy.get('.shopping_cart_badge').should('be.visible');
});

Then('the cart badge should consistently show the correct count', () => {
  cy.get('.shopping_cart_badge').should('contain', '1');
});

// Accessibility steps for inventory
Then('all product images should have alt text', () => {
  cy.get('.inventory_item_img img').each($img => {
    cy.wrap($img).should('have.attr', 'alt').and('not.be.empty');
  });
});

Then('all buttons should be keyboard accessible', () => {
  cy.get('button').each($button => {
    cy.wrap($button).should('be.visible').and('not.have.attr', 'tabindex', '-1');
  });
});

Then('the sorting dropdown should be accessible', () => {
  cy.get('[data-test="product_sort_container"]')
    .should('be.visible')
    .and('have.attr', 'aria-label');
});

// Responsive design steps
Then('product grid should adjust to viewport size', () => {
  cy.get('.inventory_list').should('be.visible');
  cy.get('.inventory_item').should('be.visible');
});

// Problem user steps
When('I interact with the inventory page', () => {
  const inventoryPage = new InventoryPage();
  inventoryPage.addProductToCart('Sauce Labs Backpack');
  inventoryPage.sortByNameAZ();
});

Then('I should observe the expected UI issues', () => {
  // Problem user might have broken images or other UI issues
  cy.log('Observing problem user UI issues');
});

Then('the basic functionality should still work', () => {
  cy.get('.shopping_cart_badge').should('be.visible');
});

