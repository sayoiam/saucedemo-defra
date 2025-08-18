Feature: Complete Purchase Flow
  As a customer of the SauceDemo application
  I want to complete a full purchase from login to order confirmation
  So that I can buy products successfully

  Background:
    Given I am on the SauceDemo login page
    And I login as "standard_user"

  @smoke @e2e @multi-page
  Scenario: Complete purchase flow with single product
    Given I am on the inventory page
    When I add "Sauce Labs Backpack" to the cart
    And I navigate to the cart page
    Then I should see "Sauce Labs Backpack" in the cart
    When I proceed to checkout
    And I fill in the customer information:
      | firstName | lastName | postalCode |
      | John      | Doe      | 12345      |
    And I continue to checkout overview
    Then I should see the order summary with correct details
    And I should see payment information "SauceCard #31337"
    And I should see shipping information "Free Pony Express Delivery!"
    When I finish the order
    Then I should see the order confirmation page
    And I should see "Thank you for your order!" message
    And the cart should be empty
    When I click back to products
    Then I should be redirected to the inventory page

  @e2e @multi-page
  Scenario: Complete purchase flow with multiple products
    Given I am on the inventory page
    When I add the following products to the cart:
      | Sauce Labs Backpack     |
      | Sauce Labs Bike Light   |
      | Sauce Labs Bolt T-Shirt |
    And I navigate to the cart page
    Then I should see 3 items in the cart
    And I should see all selected products in the cart
    When I proceed to checkout
    And I fill in the customer information:
      | firstName | lastName | postalCode |
      | Jane      | Smith    | 54321      |
    And I continue to checkout overview
    Then I should see the order summary with 3 items
    And the item total should match the sum of individual prices
    And the total should include tax calculation
    When I finish the order
    Then I should see the order confirmation page
    And the cart should be empty

  @negative @e2e
  Scenario: Purchase flow with incomplete customer information
    Given I am on the inventory page
    When I add "Sauce Labs Backpack" to the cart
    And I navigate to the cart page
    And I proceed to checkout
    When I attempt to continue without filling customer information
    Then I should see a validation error for required fields
    And I should remain on the customer information page

  @performance @e2e
  Scenario: Purchase flow performance with performance glitch user
    Given I logout from the application
    And I login as "performance_glitch_user"
    When I complete a purchase flow with performance monitoring
    Then the purchase should complete successfully
    And performance metrics should be within acceptable limits

