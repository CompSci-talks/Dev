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
- TypeScript 5.9, Angular 21.2.0 + `@angular/fire`, `firebase`, `rxjs` (017-firebase-backend-migration)
- Firebase Firestore, Firebase Authentication (017-firebase-backend-migration)
- TypeScript (Angular) + Angular, Firebase (Firestore, Auth), Tailwind CSS (019-admin-user-management)
- TypeScript / Angular 17+ + @angular/core, @angular/fire, Firebase (Auth, Firestore), RxJS, Tailwind CSS (019-admin-user-management)
- Cloud Firestore (019-admin-user-management)
- TypeScript / Angular 17+ + Firebase SDK (Auth, Firestore), Tailwind CSS, RxJS, Lucide Angular (019-admin-user-management)
- Firestore (User Profiles, Attendance, Activities) (019-admin-user-management)
- TypeScript / Angular 17+ + @angular/fire (Firebase v10+), RxJS (026-auth-flow-enhancement)
- Firebase Authentication, Firestore (for user profile) (026-auth-flow-enhancement)

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
- 026-auth-flow-enhancement: Added TypeScript / Angular 17+ + @angular/fire (Firebase v10+), RxJS
- 019-admin-user-management: Added TypeScript / Angular 17+ + Firebase SDK (Auth, Firestore), Tailwind CSS, RxJS, Lucide Angular
- 019-admin-user-management: Added TypeScript / Angular 17+ + @angular/core, @angular/fire, Firebase (Auth, Firestore), RxJS, Tailwind CSS


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
