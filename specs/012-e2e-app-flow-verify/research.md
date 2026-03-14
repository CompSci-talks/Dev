# Research: E2E Verification & BDD Reporting

## Decision 1: Test Runner
- **Chosen**: Playwright + Cucumber.js
- **Rationale**: Playwright is the gold standard for modern web apps, handles auto-waiting (loaders/async state) perfectly, and integrates seamlessly with Cucumber for Gherkin output.
- **Alternatives**: 
    - Cypress: Rejected due to slower parallelization and more complex CI setup.
    - Vitest Browser Mode: Rejected as it's less mature for full-page E2E flows.

## Decision 2: Report Format
- **Chosen**: Markdown-wrapped Gherkin BDD
- **Rationale**: User explicitly requested BDD format and high-level reports. Generating a `verification_report.md` with Playwright output in Gherkin syntax satisfies both.

## Decision 3: Auth Handling
- **Chosen**: Reusable setup script for Admin login.
- **Rationale**: To test CRUD and moderation, we need an admin session. We'll use the existing `supbase-utils.js` or a Playwright global setup to establish sessions once per run.

## Phase 0 Resolution
- **[Playwright Setup]**: Use `npm install playwright-core` to keep it lightweight.
- **[Cucumber Integration]**: Use `cucumber-js` for scenario management.
