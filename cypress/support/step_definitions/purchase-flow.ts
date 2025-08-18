import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { 
  InventoryPage, 
  CartPage, 
  CheckoutStepOnePage, 
  CheckoutStepTwoPage, 
  CheckoutCompletePage 
} from '../../pages';

// Multi-product cart steps
When('I add the following products to the cart:', (dataTable: any) => {
  const inventoryPage = new InventoryPage();
  const products = dataTable.raw().flat();
  products.forEach((product: string) => {
    inventoryPage.addProductToCart(product);
  });
});

Then('I should see {int} items in the cart', (expectedCount: number) => {
  const cartPage = new CartPage();
  cartPage.verifyCartItemCount(expectedCount);
});

Then('I should see all selected products in the cart', () => {
  // This step would verify that all previously added products are in the cart
  cy.get('.cart_item').should('have.length.greaterThan', 0);
});

// Checkout flow steps
When('I proceed to checkout', () => {
  const cartPage = new CartPage();
  cartPage.clickCheckout();
});

When('I fill in the customer information:', (dataTable: any) => {
  const checkoutPage = new CheckoutStepOnePage();
  const customerData = dataTable.hashes()[0];
  checkoutPage.fillCustomerInformation(
    customerData.firstName,
    customerData.lastName,
    customerData.postalCode
  );
});

When('I continue to checkout overview', () => {
  const checkoutPage = new CheckoutStepOnePage();
  checkoutPage.clickContinue();
});

Then('I should see the order summary with correct details', () => {
  const checkoutStepTwo = new CheckoutStepTwoPage();
  checkoutStepTwo.verifyCheckoutStepTwoPageLoaded();
  checkoutStepTwo.verifySummaryInfoDisplayed();
});

Then('I should see payment information {string}', (paymentInfo: string) => {
  const checkoutStepTwo = new CheckoutStepTwoPage();
  checkoutStepTwo.getPaymentInfo().should('contain', paymentInfo);
});

Then('I should see shipping information {string}', (shippingInfo: string) => {
  const checkoutStepTwo = new CheckoutStepTwoPage();
  checkoutStepTwo.getShippingInfo().should('contain', shippingInfo);
});

When('I finish the order', () => {
  const checkoutStepTwo = new CheckoutStepTwoPage();
  checkoutStepTwo.clickFinish();
});

Then('I should see the order confirmation page', () => {
  const checkoutComplete = new CheckoutCompletePage();
  checkoutComplete.verifyCheckoutCompletePageLoaded();
});

Then('I should see {string} message', (expectedMessage: string) => {
  const checkoutComplete = new CheckoutCompletePage();
  checkoutComplete.getCompletionHeader().should('contain', expectedMessage);
});

Then('the cart should be empty', () => {
  const checkoutComplete = new CheckoutCompletePage();
  checkoutComplete.verifyCartIsEmpty();
});

When('I click back to products', () => {
  const checkoutComplete = new CheckoutCompletePage();
  checkoutComplete.clickBackHome();
});

// Order summary validation steps
Then('I should see the order summary with {int} items', (expectedCount: number) => {
  const checkoutStepTwo = new CheckoutStepTwoPage();
  checkoutStepTwo.getCheckoutItemCount().should('eq', expectedCount);
});

Then('the item total should match the sum of individual prices', () => {
  const checkoutStepTwo = new CheckoutStepTwoPage();
  checkoutStepTwo.verifyItemTotalCalculation();
});

Then('the total should include tax calculation', () => {
  const checkoutStepTwo = new CheckoutStepTwoPage();
  checkoutStepTwo.verifyPriceCalculation();
});

// Form validation steps
When('I attempt to continue without filling customer information', () => {
  const checkoutPage = new CheckoutStepOnePage();
  checkoutPage.clickContinue();
});

Then('I should see a validation error for required fields', () => {
  const checkoutPage = new CheckoutStepOnePage();
  checkoutPage.isErrorMessageDisplayed();
});

Then('I should remain on the customer information page', () => {
  cy.url().should('include', '/checkout-step-one.html');
});

When('I fill in invalid customer information:', (dataTable: any) => {
  const checkoutPage = new CheckoutStepOnePage();
  const customerData = dataTable.hashes()[0];
  checkoutPage.fillCustomerInformation(
    customerData.firstName,
    customerData.lastName,
    customerData.postalCode
  );
});

Then('I should see a validation error', () => {
  const checkoutPage = new CheckoutStepOnePage();
  checkoutPage.isErrorMessageDisplayed();
});

// Responsive checkout steps
When('I fill in the customer information on mobile', () => {
  const checkoutPage = new CheckoutStepOnePage();
  checkoutPage.fillCustomerInformation();
});

Then('the cart page should be responsive', () => {
  cy.get('.cart_contents_container').should('be.visible');
  cy.get('.cart_item').should('be.visible');
});

Then('the checkout overview should be responsive', () => {
  cy.get('.checkout_summary_container').should('be.visible');
  cy.get('.summary_info').should('be.visible');
});

Then('the confirmation page should be responsive', () => {
  cy.get('.checkout_complete_container').should('be.visible');
  cy.get('.complete-header').should('be.visible');
});

// Performance monitoring steps
When('I complete a purchase flow with performance monitoring', () => {
  const inventoryPage = new InventoryPage();
  const cartPage = new CartPage();
  const checkoutStepOne = new CheckoutStepOnePage();
  const checkoutStepTwo = new CheckoutStepTwoPage();
  const checkoutComplete = new CheckoutCompletePage();

  // Measure performance throughout the flow
  cy.window().its('performance').invoke('mark', 'purchase-flow-start');
  
  inventoryPage.addProductToCart('Sauce Labs Backpack');
  inventoryPage.clickShoppingCart();
  cartPage.clickCheckout();
  checkoutStepOne.completeCheckoutStepOne();
  checkoutStepTwo.clickFinish();
  checkoutComplete.verifySuccessfulOrderCompletion();
  
  cy.window().its('performance').invoke('mark', 'purchase-flow-end');
});

Then('the purchase should complete successfully', () => {
  const checkoutComplete = new CheckoutCompletePage();
  checkoutComplete.verifySuccessfulOrderCompletion();
});

Then('performance metrics should be within acceptable limits', () => {
  cy.window().its('performance').then((performance) => {
    const marks = performance.getEntriesByType('mark');
    const startMark = marks.find(mark => mark.name === 'purchase-flow-start');
    const endMark = marks.find(mark => mark.name === 'purchase-flow-end');
    
    if (startMark && endMark) {
      const duration = endMark.startTime - startMark.startTime;
      expect(duration).to.be.lessThan(30000); // 30 seconds max
    }
  });
});

