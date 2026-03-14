# Quickstart: Full App Verification

This guide explains how to run the comprehensive E2E verification suite.

## 1. Prerequisites
- Node.js installed.
- Application running at `http://localhost:4200` (or your configured URL).
- (Optional) Playwright dependencies:
  ```bash
  npx playwright install chromium
  ```

## 2. Configuration
The verification suite uses the credentials defined in your `environment.ts`. Ensure you have an admin user created (use `scripts/supabase-utils.js` if needed).

## 3. Run Verification
Execute the main verification script:
```bash
node scripts/e2e/verify-app.js
```

## 4. Review Results
After completion, a detailed BDD report will be generated at:
`specs/012-e2e-app-flow-verify/walkthrough.md`

The report will categorize results in Gherkin format:
- ✅ **Passed**: Feature is fully functional.
- ❌ **Failed**: Bug detected (details in report).
