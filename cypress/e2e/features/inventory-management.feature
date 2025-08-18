Feature: Inventory and Cart Management
  As a customer of the SauceDemo application
  I want to manage products in my cart
  So that I can select the items I want to purchase

  Background:
    Given I am on the SauceDemo login page
    And I login as "standard_user"
    And I am on the inventory page

  @smoke @positive
  Scenario: Add single product to cart
    When I add "Sauce Labs Backpack" to the cart
    Then the cart badge should show "1"
    And the "Add to cart" button should change to "Remove"
    And the product should be marked as added to cart

  @positive
  Scenario: Add multiple products to cart
    When I add the following products to the cart:
      | Sauce Labs Backpack   |
      | Sauce Labs Bike Light |
      | Sauce Labs Onesie     |
    Then the cart badge should show "3"
    And all selected products should be marked as added to cart

  @positive
  Scenario: Continue shopping from cart
    Given I have added "Sauce Labs Backpack" to the cart
    When I navigate to the cart page
    And I click "Continue Shopping"
    Then I should be redirected to the inventory page
    And the cart badge should still show "1"

  @positive
  Scenario: Product details verification
    Then I should see 6 products on the inventory page
    And each product should have:
      | name        |
      | description |
      | price       |
      | image       |
      | add button  |

  @negative
  Scenario: Cart persistence across pages
    Given I have added "Sauce Labs Backpack" to the cart
    When I navigate to different pages
    Then the cart should maintain the selected items
    And the cart badge should consistently show the correct count

  @responsive
  Scenario: Inventory page responsive design
    When I test the inventory page on different viewports:
      | mobile  |
      | tablet  |
      | desktop |
    Then the page layout should adapt appropriately
    And all functionality should remain accessible
    And product grid should adjust to viewport size