# compsci-talks Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-11

## Active Technologies
- TypeScript, Angular 19 (Zoneless) + Tailwind CSS, Angular Router (004-global-layout-updates)
- N/A (Presentational changes) (004-global-layout-updates)
- [if applicable, e.g., PostgreSQL, CoreData, files or N/A] (003-refactor-qa-to-comments)
- TypeScript 5.4, Angular 19 + rxjs, @supabase/supabase-js, tailwindcss (003-refactor-qa-to-comments)
- Supabase Postgres (comments table) (003-refactor-qa-to-comments)
- Angular 19, TypeScript 5.4+ + RxJS, Supabase SDK (in adapters), Tailwind CSS (002-admin-dashboard)
- Supabase (Database), Google Drive / Supabase Storage (Materials) - **NEEDS CLARIFICATION on specific SDK patterns for serverless Drive upload** (002-admin-dashboard)
- TypeScript 5+, Angular 17+ (Standalone Components) + Tailwind CSS, RxJS, Ng-Lucide (for icons), [NEEDS CLARIFICATION: Rich-Text Editor choice] (008-admin-attendance-email)
- MockSeminarService (to be extended for attendance), LocalStorage/Memory for drafts (008-admin-attendance-email)
- TypeScript 5.9, Angular 21.2.0 + `@angular/core`, `@angular/router`, `@supabase/supabase-js`, `tailwindcss`, `rxjs` (007-ux-enhancements)
- Supabase (via adapters) (007-ux-enhancements)
- TypeScript / Angular 21 + `@supabase/supabase-js`, `rxjs` (009-supabase-integration)
- Supabase (PostgreSQL) (009-supabase-integration)
- JavaScript / Node.js + Playwright (for browser automation), Gherkin/Cucumber.js (for reporting) (012-e2e-app-flow-verify)
- N/A (Targets existing Supabase production/local DB) (012-e2e-app-flow-verify)

- [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION] + [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION] (001-attendees-portal)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

cd src; pytest; ruff check .

## Code Style

[e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]: Follow standard conventions

## Recent Changes
- 012-e2e-app-flow-verify: Added JavaScript / Node.js + Playwright (for browser automation), Gherkin/Cucumber.js (for reporting)
- 009-supabase-integration: Added TypeScript / Angular 21 + `@supabase/supabase-js`, `rxjs`
- 007-ux-enhancements: Added TypeScript 5.9, Angular 21.2.0 + `@angular/core`, `@angular/router`, `@supabase/supabase-js`, `tailwindcss`, `rxjs`


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
