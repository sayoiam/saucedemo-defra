// Configuration file for SauceDemo test framework
export const config = {
  // Base URL for the application
  baseUrl: 'https://www.saucedemo.com',
  
  // Test users configuration
  users: {
    standard: 'standard_user',
    lockedOut: 'locked_out_user',
    problem: 'problem_user',
    performanceGlitch: 'performance_glitch_user',
    error: 'error_user',
    visual: 'visual_user'
  },
  
  // Common password for all users
  password: 'secret_sauce',
  
  // Timeout configurations
  timeouts: {
    default: 10000,
    request: 10000,
    response: 10000,
    pageLoad: 30000
  },
  
  // Viewport configurations for responsive testing
  viewports: {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1280, height: 720 },
    largeDesktop: { width: 1920, height: 1080 }
  },
  
  // Test data
  testData: {
    customer: {
      firstName: 'John',
      lastName: 'Doe',
      postalCode: '12345'
    },
    products: {
      backpack: 'Sauce Labs Backpack',
      bikeLight: 'Sauce Labs Bike Light',
      boltTShirt: 'Sauce Labs Bolt T-Shirt',
      fleeceJacket: 'Sauce Labs Fleece Jacket',
      onesie: 'Sauce Labs Onesie',
      redTShirt: 'Test.allTheThings() T-Shirt (Red)'
    }
  },
  
  // Security test payloads
  security: {
    xssPayloads: [
      '<script>alert("XSS")</script>',
      '"><script>alert("XSS")</script>',
      'javascript:alert("XSS")',
      '<img src=x onerror=alert("XSS")>'
    ],
    sqlPayloads: [
      "' OR '1'='1",
      "'; DROP TABLE users; --",
      "' UNION SELECT * FROM users --",
      "admin'--"
    ]
  },
  
  // Accessibility testing configuration
  accessibility: {
    rules: {
      'color-contrast': { enabled: true },
      'keyboard-navigation': { enabled: true },
      'focus-management': { enabled: true },
      'aria-labels': { enabled: true }
    },
    tags: ['wcag2a', 'wcag2aa', 'wcag21aa']
  },
  
  // Performance testing thresholds
  performance: {
    pageLoadTime: 5000,
    apiResponseTime: 2000,
    renderTime: 3000
  },
  
  // Reporting configuration
  reporting: {
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    reportsFolder: 'cypress/reports',
    mochawesome: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: true,
      charts: true
    }
  }
};

