Feature: User Authentication
  As a user of the SauceDemo application
  I want to be able to log in with valid credentials
  So that I can access the product inventory

  Background:
    Given I am on the SauceDemo login page

  @smoke @positive
  Scenario: Successful login with standard user
    When I enter username "standard_user" and password "secret_sauce"
    And I click the login button
    Then I should be redirected to the inventory page
    And I should see the products page title

  @positive
  Scenario Outline: Successful login with different user types
    When I enter username "<username>" and password "secret_sauce"
    And I click the login button
    Then I should be redirected to the inventory page
    And I should see the products page title

    Examples:
      | username                |
      | standard_user          |
      | performance_glitch_user |
      | error_user             |
      | visual_user            |

  @negative
  Scenario: Login attempt with locked out user
    When I enter username "locked_out_user" and password "secret_sauce"
    And I click the login button
    Then I should see an error message
    And I should remain on the login page
    And the error message should contain "Sorry, this user has been locked out"