Feature: Security Testing
  As a security-conscious user
  I want the SauceDemo application to be secure against common vulnerabilities
  So that my data and the application remain protected

  Background:
    Given I am on the SauceDemo login page

  @security @sql-injection @critical
  Scenario: SQL Injection prevention in login form
    When I attempt to inject SQL payloads in the username field:
      | ' OR '1'='1                                      |
      | '; DROP TABLE users; --                          |
      | ' UNION SELECT * FROM users --                   |
      | admin'--                                         |
      | ' OR 1=1 --                                      |
    Then no unauthorized access should be granted
    And the application should handle the input safely
    And no database errors should be exposed

  @security @csrf
  Scenario: Cross-Site Request Forgery (CSRF) protection
    Given I login as "standard_user"
    When I attempt to perform actions via external requests
    Then CSRF protection should prevent unauthorized actions
    And requests should require proper authentication

  @security @brute-force
  Scenario: Brute force attack protection
    When I attempt multiple failed login attempts:
      | username      | password    | attempt |
      | standard_user | wrong1      | 1       |
      | standard_user | wrong2      | 2       |
      | standard_user | wrong3      | 3       |
      | standard_user | wrong4      | 4       |
      | standard_user | wrong5      | 5       |
    Then the application should handle repeated failures appropriately
    And account lockout mechanisms should be in place if applicable

  @security @https
  Scenario: HTTPS and secure communication
    When I access the application
    Then all communication should be over HTTPS
    And secure cookies should be used
    And mixed content should not be present

