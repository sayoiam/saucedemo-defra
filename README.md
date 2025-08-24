# SauceDemo Cypress Test Automation Framework

A comprehensive, enterprise-grade test automation framework built with Cypress, TypeScript, and BDD for SauceDemo application testing. Features accessibility testing, security validation, responsive design verification, and robust CI/CD integration.

## Quick Setup

### Prerequisites
- Node.js 16+ and npm 8+
- Git for version control
- Modern browser (Chrome, Firefox, or Edge)

### Installation
```bash
# Clone repository
git clone https://github.com/sayoiam/saucedemo-defra.git
cd saucedemo-defra

# Install dependencies
npm install

# Verify installation
npm run cy:verify
```

### First Test Run
```bash
# Run smoke tests
npm run test:smoke

# Open interactive mode
npm run test:open
```

## Test Execution Commands

### Core Test Commands
```bash
npm test                    # Run all tests headlessly
npm run test:open          # Open Cypress Test Runner (interactive)
npm run test:headed        # Run tests with browser visible
npm run test:headless      # Run tests in headless mode
```

### Test Categories by Tags
```bash
npm run test:smoke         # Quick validation tests (@smoke)
npm run test:regression    # Full regression suite (@regression)
npm run test:critical      # Critical path tests (@critical)
npm run test:accessibility # WCAG compliance tests (@accessibility)
npm run test:security      # Security vulnerability tests (@security)
npm run test:responsive    # Multi-viewport tests (@responsive)
npm run test:bdd          # All BDD feature files
npm run test:e2e          # End-to-end scenarios (@e2e)
npm run test:multi-page   # Multi-page flows (@multi-page)
npm run test:negative     # Negative test cases (@negative)
npm run test:positive     # Positive test cases (@positive)
```

### Browser-Specific Testing
```bash
npm run test:chrome        # Google Chrome
npm run test:firefox       # Mozilla Firefox
npm run test:edge          # Microsoft Edge
npm run test:all-browsers  # All browsers sequentially
```

### Viewport/Device Testing
```bash
npm run test:mobile        # Mobile viewport (375x667)
npm run test:tablet        # Tablet viewport (768x1024)
npm run test:desktop       # Desktop viewport (1280x720)
npm run test:all-viewports # All viewports sequentially
```

### Specific Test Files
```bash
# TypeScript test files
npx cypress run --spec "cypress/e2e/accessibility.cy.ts"
npx cypress run --spec "cypress/e2e/security.cy.ts"
npx cypress run --spec "cypress/e2e/responsive.cy.ts"

# BDD feature files
npx cypress run --spec "cypress/e2e/features/login.feature"
npx cypress run --spec "cypress/e2e/features/complete-purchase-flow.feature"
npx cypress run --spec "cypress/e2e/features/accessibility.feature"
npx cypress run --spec "cypress/e2e/features/security.feature"
npx cypress run --spec "cypress/e2e/features/inventory-management.feature"

# Pattern matching
npx cypress run --spec "cypress/e2e/**/*login*"
npx cypress run --spec "cypress/e2e/**/*cart*"
```

### Advanced Options
```bash
npm run test:debug         # Debug mode with browser visible
npm run test:parallel      # Parallel execution
npm run test:performance   # Performance tests (@performance)
```

## Report Generation and Viewing

### Generate Reports
```bash
# Run tests and auto-generate reports
npm test                   # Generates reports automatically
npm run test:smoke         # Smoke tests with reports
npm run test:accessibility # Accessibility tests with reports
```

### View Reports
```bash
# Open latest report
npm run report:open

# Merge multiple test reports and view
npm run report:merge

# Generate report from existing JSON files
npm run report:generate
```

### Report Management
```bash
npm run report:clean       # Clean old reports and artifacts
```

## GitHub Actions CI/CD

### Workflow Files
- `.github/workflows/ci.yml` - Main CI pipeline
- `.github/workflows/nightly.yml` - Scheduled nightly tests
- `.github/workflows/pr-validation.yml` - Pull request validation

### Automated Triggers
- **Push to main/develop**: Full test suite
- **Pull requests**: Validation tests
- **Daily schedule**: Comprehensive regression (2 AM UTC)
- **Manual dispatch**: Custom test execution

### Workflow Features
- Multi-browser testing (Chrome, Firefox, Edge)
- Parallel test execution
- Artifact collection (reports, screenshots, videos)
- Slack/email notifications
- Test result publishing

### Manual Workflow Dispatch
1. Go to GitHub Actions tab
2. Select "CI Pipeline" workflow
3. Click "Run workflow"
4. Choose browser and test suite
5. Monitor execution and download artifacts

## Framework Features

### Test Types Included
- **Authentication**: Login/logout with multiple user types
- **E-commerce Flow**: Complete purchase journey (6+ pages)
- **Accessibility**: WCAG 2.1 AA compliance validation
- **Security**: XSS, SQL injection, authentication bypass prevention
- **Responsive**: Cross-device compatibility testing

### Architecture
- **Page Object Model**: Structured, maintainable page classes
- **TypeScript**: Full type safety and IDE support
- **BDD/Gherkin**: Business-readable test scenarios
- **Configurable**: Environment-specific settings

### Supported Browsers
- Google Chrome (default)
- Mozilla Firefox
- Microsoft Edge
- Electron (headless)

### Supported Viewports
- Mobile: 375x667px (iPhone SE)
- Tablet: 768x1024px (iPad)
- Desktop: 1280x720px (Standard)
- Large Desktop: 1920x1080px

## Development Commands

### Validation and Maintenance
```bash
npm run validate           # TypeScript type checking
npm run type-check         # Verify TypeScript compilation
npm run setup              # Install and verify Cypress
npm run cy:info            # Cypress environment info
npm run cy:version         # Cypress version details
```

### Cleanup and Reset
```bash
npm run clean              # Remove reports and artifacts
npm run reinstall          # Clean reinstall of dependencies
```

## Getting Started Checklist

1. ✅ Clone repository and install dependencies
2. ✅ Run `npm run test:smoke` to verify setup
3. ✅ Explore tests with `npm run test:open`
4. ✅ Generate your first report with `npm run report:open`
5. ✅ Set up GitHub Actions for CI/CD
6. ✅ Customize tests for your needs
