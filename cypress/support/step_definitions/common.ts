import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { LoginPage, InventoryPage, CartPage } from '@/pages';

// Common page navigation steps
Given('I am on the SauceDemo login page', () => {
  const loginPage = new LoginPage();
  loginPage.navigateToLogin();
  loginPage.verifyLoginPageLoaded();
});

Given('I am on the inventory page', () => {
  const inventoryPage = new InventoryPage();
  inventoryPage.verifyInventoryPageLoaded();
});

Given('I am on the cart page', () => {
  const cartPage = new CartPage();
  cartPage.verifyCartPageLoaded();
});

// Login steps
Given('I login as {string}', (userType: string) => {
  cy.loginAs(userType);
});

When('I enter username {string} and password {string}', (username: string, password: string) => {
  const loginPage = new LoginPage();
  loginPage.enterUsername(username);
  loginPage.enterPassword(password);
});

When('I click the login button', () => {
  const loginPage = new LoginPage();
  loginPage.clickLogin();
});

Then('I should be redirected to the inventory page', () => {
  const inventoryPage = new InventoryPage();
  inventoryPage.verifyInventoryPageLoaded();
});

Then('I should see the products page title', () => {
  cy.get('.title').should('contain', 'Products');
});

Then('I should remain on the login page', () => {
  cy.url().should('include', '/');
  cy.url().should('not.include', '/inventory.html');
});

// Error handling steps
Then('I should see an error message', () => {
  const loginPage = new LoginPage();
  loginPage.isErrorMessageDisplayed();
});

Then('the error message should contain {string}', (expectedError: string) => {
  const loginPage = new LoginPage();
  loginPage.getErrorMessage().should('contain', expectedError);
});

// Cart steps
When('I add {string} to the cart', (productName: string) => {
  const inventoryPage = new InventoryPage();
  inventoryPage.addProductToCart(productName);
});

When('I navigate to the cart page', () => {
  const inventoryPage = new InventoryPage();
  inventoryPage.clickShoppingCart();
});

Then('I should see {string} in the cart', (productName: string) => {
  const cartPage = new CartPage();
  cartPage.verifyProductInCart(productName);
});

Then('the cart badge should show {string}', (count: string) => {
  const inventoryPage = new InventoryPage();
  inventoryPage.getCartItemCount().should('eq', parseInt(count));
});

Then('the cart badge should not be visible', () => {
  cy.get('.shopping_cart_badge').should('not.exist');
});

// Logout steps
Given('I logout from the application', () => {
  const inventoryPage = new InventoryPage();
  inventoryPage.clickLogout();
});

// Viewport steps

Given('I am using a tablet viewport', () => {
  cy.viewport(768, 1024);
});

Given('I am using a desktop viewport', () => {
  cy.viewport(1280, 720);
});

// Accessibility steps
Then('the {word} page should be accessible', (pageName: string) => {
  cy.injectAxe();
  cy.checkA11y();
});

Then('all form elements should have proper labels', () => {
  cy.get('input').each($input => {
    cy.wrap($input).should('have.attr', 'placeholder');
  });
});

Then('the page should support keyboard navigation', () => {
  cy.get('body').realPress('Tab');
  cy.focused().should('be.visible');
});

// Security steps
When('I attempt to login with malicious input', () => {
  cy.performSecurityTests();
});

Then('the application should prevent security vulnerabilities', () => {
  cy.url().should('not.contain', 'javascript:');
  cy.get('body').should('not.contain', 'XSS');
});

// Responsive steps
When('I test the {word} page on different viewports:', (pageName: string, dataTable: any) => {
  const viewports = dataTable.raw().flat();
  cy.testResponsive(viewports);
});

Then('the page layout should adapt appropriately', () => {
  cy.get('body').should('be.visible');
  cy.get('.inventory_container, .cart_contents_container, .checkout_info_container').should('be.visible');
});

Then('all functionality should remain accessible', () => {
  cy.get('button, a, input, select').should('be.visible');
});

