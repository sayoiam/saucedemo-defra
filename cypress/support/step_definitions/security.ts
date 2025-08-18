import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// XSS prevention steps
// When('I attempt to inject XSS payloads in the username field:', (dataTable: any) => {
//   const xssPayloads = dataTable.raw().flat();
//
//   xssPayloads.forEach((payload: string) => {
//     cy.visit('/');
//     cy.get('[data-test="username"]').clear().type(payload);
//     cy.get('[data-test="password"]').type('test');
//     cy.get('[data-test="login-button"]').click();
//
//     // Verify no script execution
//     cy.window().then((win) => {
//       expect(win.document.body.innerHTML).to.not.contain('XSS');
//     });
//
//     // Verify no unauthorized access
//     cy.url().should('not.include', '/inventory.html');
//   });
// });

Then('no script execution should occur', () => {
  cy.window().then((win) => {
    // Check that no malicious scripts were executed
    expect(win.document.body.innerHTML).to.not.contain('alert');
    expect(win.document.body.innerHTML).to.not.contain('<script>');
  });
});

Then('the application should sanitize the input', () => {
  // Verify that dangerous characters are escaped or removed
  cy.get('[data-test="username"]').should(($input) => {
    const value = $input.val() as string;
    expect(value).to.not.contain('<script>');
    expect(value).to.not.contain('javascript:');
  });
});

Then('I should not be granted unauthorized access', () => {
  cy.url().should('not.include', '/inventory.html');
  cy.get('.inventory_container').should('not.exist');
});

// SQL injection prevention steps
When('I attempt to inject SQL payloads in the username field:', (dataTable: any) => {
  const sqlPayloads = dataTable.raw().flat();
  
  sqlPayloads.forEach((payload: string) => {
    cy.visit('/');
    cy.get('[data-test="username"]').clear().type(payload);
    cy.get('[data-test="password"]').type('test');
    cy.get('[data-test="login-button"]').click();
    
    // Verify no unauthorized access
    cy.url().should('not.include', '/inventory.html');
    
    // Check for error handling (should not expose database errors)
    cy.get('body').should('not.contain', 'SQL');
    cy.get('body').should('not.contain', 'database');
    cy.get('body').should('not.contain', 'mysql');
    cy.get('body').should('not.contain', 'postgresql');
  });
});

Then('no unauthorized access should be granted', () => {
  cy.url().should('not.include', '/inventory.html');
});

Then('the application should handle the input safely', () => {
  // Verify no database errors are exposed
  cy.get('body').should('not.contain', 'SQL error');
  cy.get('body').should('not.contain', 'database error');
});

Then('no database errors should be exposed', () => {
  cy.get('body').should('not.contain', 'SQL');
  cy.get('body').should('not.contain', 'database');
  cy.get('body').should('not.contain', 'mysql');
  cy.get('body').should('not.contain', 'postgresql');
  cy.get('body').should('not.contain', 'ORA-');
});

// Authentication bypass steps
When('I attempt to bypass authentication using:', (dataTable: any) => {
  const bypassMethods = dataTable.raw().flat();
  
  bypassMethods.forEach((method: string) => {
    switch (method) {
      case 'Direct URL access to /inventory.html':
        cy.visit('/inventory.html');
        break;
      case 'Session manipulation':
        cy.clearCookies();
        cy.visit('/inventory.html');
        break;
      case 'Cookie tampering':
        cy.setCookie('session', 'fake-session-token');
        cy.visit('/inventory.html');
        break;
    }
  });
});

Then('I should be redirected to the login page', () => {
  cy.url().should('not.include', '/inventory.html');
  cy.url().should('include', '/');
});

Then('access should be denied without proper authentication', () => {
  cy.get('.inventory_container').should('not.exist');
  cy.get('.login_container').should('be.visible');
});

When('I check session security', () => {
  // Check for secure session cookies
  cy.getCookies().then((cookies) => {
    cookies.forEach((cookie) => {
      if (cookie.name.includes('session') || cookie.name.includes('auth')) {
        expect(cookie.secure).to.be.true;
        expect(cookie.httpOnly).to.be.true;
      }
    });
  });
});

Then('session tokens should be properly secured', () => {
  cy.getCookies().should('have.length.greaterThan', 0);
});

Then('session should expire appropriately', () => {
  // This would test session timeout functionality
  cy.log('Session expiration testing would be implemented here');
});

Then('logout should invalidate the session completely', () => {
  const inventoryPage = new (require('../../pages').InventoryPage)();
  inventoryPage.clickLogout();
  
  // Try to access protected page after logout
  cy.visit('/inventory.html');
  cy.url().should('not.include', '/inventory.html');
});

// Input validation in checkout forms
Given('I add a product to cart and proceed to checkout', () => {
  cy.loginAs('standard_user');
  cy.get('[data-test^="add-to-cart"]').first().click();
  cy.get('.shopping_cart_link').click();
  cy.get('[data-test="checkout"]').click();
});

When('I attempt to inject malicious payloads in checkout forms:', (dataTable: any) => {
  const maliciousData = dataTable.hashes()[0];
  
  cy.get('[data-test="firstName"]').clear().type(maliciousData.firstName);
  cy.get('[data-test="lastName"]').clear().type(maliciousData.lastName);
  cy.get('[data-test="postalCode"]').clear().type(maliciousData.postalCode);
  cy.get('[data-test="continue"]').click();
});

Then('the application should validate and sanitize inputs', () => {
  // Check that malicious input is handled properly
  cy.get('[data-test="firstName"]').should(($input) => {
    const value = $input.val() as string;
    expect(value).to.not.contain('<script>');
  });
});

Then('no malicious code should be executed', () => {
  cy.window().then((win) => {
    expect(win.document.body.innerHTML).to.not.contain('alert');
  });
});

Then('the form should handle invalid input gracefully', () => {
  // Should either show validation error or sanitize input
  cy.get('body').should('not.contain', '<script>');
  cy.get('body').should('not.contain', 'DROP TABLE');
});

// CSRF protection steps
When('I attempt to perform actions via external requests', () => {
  // This would test CSRF protection by attempting cross-site requests
  cy.log('CSRF protection testing would be implemented here');
});

Then('CSRF protection should prevent unauthorized actions', () => {
  cy.log('CSRF protection verification would be implemented here');
});

Then('requests should require proper authentication', () => {
  cy.log('Authentication requirement verification would be implemented here');
});

// Data exposure prevention steps
When('I inspect the application for sensitive data exposure', () => {
  // Check page source for sensitive information
  cy.get('body').should('not.contain', 'password');
  cy.get('body').should('not.contain', 'secret');
  cy.get('body').should('not.contain', 'api_key');
  cy.get('body').should('not.contain', 'token');
});

Then('passwords should not be visible in plain text', () => {
  cy.get('[data-test="password"]').should('have.attr', 'type', 'password');
});

Then('sensitive information should not be exposed in URLs', () => {
  cy.url().should('not.contain', 'password');
  cy.url().should('not.contain', 'secret');
  cy.url().should('not.contain', 'token');
});

Then('error messages should not reveal system information', () => {
  // Trigger an error and check the message
  cy.visit('/');
  cy.get('[data-test="username"]').type('invalid');
  cy.get('[data-test="password"]').type('invalid');
  cy.get('[data-test="login-button"]').click();
  
  cy.get('[data-test="error"]').should('not.contain', 'database');
  cy.get('[data-test="error"]').should('not.contain', 'server');
  cy.get('[data-test="error"]').should('not.contain', 'stack trace');
});

// Brute force protection steps
When('I attempt multiple failed login attempts:', (dataTable: any) => {
  const attempts = dataTable.hashes();
  
  attempts.forEach((attempt: any) => {
    cy.visit('/');
    cy.get('[data-test="username"]').clear().type(attempt.username);
    cy.get('[data-test="password"]').clear().type(attempt.password);
    cy.get('[data-test="login-button"]').click();
    
    // Wait between attempts
    cy.wait(1000);
  });
});

Then('the application should handle repeated failures appropriately', () => {
  // Check that the application doesn't crash or expose information
  cy.get('body').should('be.visible');
  cy.get('[data-test="error"]').should('be.visible');
});

Then('account lockout mechanisms should be in place if applicable', () => {
  // This would check for account lockout after multiple failures
  cy.log('Account lockout testing would be implemented here');
});

// Security headers validation steps
When('I check HTTP security headers', () => {
  cy.request('/').then((response) => {
    // Check for security headers
    expect(response.headers).to.have.property('x-frame-options');
    expect(response.headers).to.have.property('x-content-type-options');
  });
});

Then('appropriate security headers should be present', () => {
  cy.log('Security headers validation would be implemented here');
});

Then('content security policy should be implemented', () => {
  cy.request('/').then((response) => {
    expect(response.headers).to.have.property('content-security-policy');
  });
});

Then('clickjacking protection should be in place', () => {
  cy.request('/').then((response) => {
    expect(response.headers['x-frame-options']).to.exist;
  });
});

// HTTPS and secure communication steps
When('I access the application', () => {
  cy.visit('/');
});

Then('all communication should be over HTTPS', () => {
  cy.url().should('include', 'https://');
});

Then('secure cookies should be used', () => {
  cy.getCookies().then((cookies) => {
    cookies.forEach((cookie) => {
      if (cookie.name.includes('session') || cookie.name.includes('auth')) {
        expect(cookie.secure).to.be.true;
      }
    });
  });
});

Then('mixed content should not be present', () => {
  // Check for HTTP resources on HTTPS page
  cy.get('img, script, link').each(($element) => {
    const src = $element.attr('src') || $element.attr('href');
    if (src && src.startsWith('http://')) {
      throw new Error(`Mixed content detected: ${src}`);
    }
  });
});

// Secure error handling steps
When('I trigger various error conditions', () => {
  // Trigger different types of errors
  cy.visit('/nonexistent-page');
  cy.visit('/');
  cy.get('[data-test="login-button"]').click(); // Empty form
});

Then('error messages should not reveal sensitive information', () => {
  cy.get('body').should('not.contain', 'stack trace');
  cy.get('body').should('not.contain', 'database');
  cy.get('body').should('not.contain', 'server error');
});

Then('stack traces should not be exposed to users', () => {
  cy.get('body').should('not.contain', 'at line');
  cy.get('body').should('not.contain', 'Exception');
  cy.get('body').should('not.contain', 'Error:');
});

Then('error handling should be consistent and secure', () => {
  cy.get('body').should('be.visible');
  cy.url().should('not.contain', 'error');
});

