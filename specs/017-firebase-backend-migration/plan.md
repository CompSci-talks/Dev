# Implementation Plan: Firebase Backend Migration

**Branch**: `017-firebase-backend-migration` | **Date**: 2026-03-15 | **Spec**: [spec.md](file:///d:/website/compscitalks/specs/017-firebase-backend-migration/spec.md)
**Input**: Feature specification from `/specs/017-firebase-backend-migration/spec.md`

## Summary

This plan migrates the CompSci Talks platform from Supabase/Mocks to a native Firebase implementation using AngularFire. The migration follows the project's Adapter Pattern, replacing existing service implementations with Firestore and Firebase Auth equivalents without altering UI components. A denormalized NoSQL schema is adopted to optimize for read performance on schedule and archive views.

## Technical Context

**Language/Version**: TypeScript 5.9, Angular 21.2.0  
**Primary Dependencies**: `@angular/fire`, `firebase`, `rxjs`  
**Storage**: Firebase Firestore, Firebase Authentication  
**Testing**: Vitest (Unit), Playwright (E2E)  
**Target Platform**: Web Browser  
**Project Type**: Web Application  
**Performance Goals**: SC-002 (<2s Archive load), SC-003 (<1.5s Admin CRUD)  
**Constraints**: Zero-cost serverless (Constitution Principle VI), Reactive data flow  
**Scale/Scope**: Migration of 7 core services and associated data entities.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **Principle I: Adapter Pattern (NON-NEGOTIABLE)**: The Firebase implementation MUST be entirely self-contained within the `adapters` layer. No feature components or services may directly reference `Firestore` or `Auth` SDKs.
2. **Principle III: Interface-First**: Every new Firebase service MUST implement the existing TypeScript interfaces in `src/app/core/contracts`.
3. **Principle VI: Zero-Cost & Serverless-First**: The migration must utilize Firebase's free tier. All denormalization must be optimized to stay within read/write limits.
4. **Principle VII: Strict Typing (NON-NEGOTIABLE)**: Adapters must have 100% type coverage. `any` is strictly forbidden.
5. **Principle VIII: Reactive & Declarative**: The implementation must rely on AngularFire's observable streams, avoiding imperative data management.
6. **Principle IX: Graceful Error Handling**: Firestore query failures or Auth errors must be caught and categorized for user feedback.

## Project Structure

### Documentation (this feature)

```text
specs/017-firebase-backend-migration/
├── spec.md              # Requirements
├── plan.md              # This file
├── research.md          # Data Strategy & Denormalization logic
├── data-model.md        # Firestore Schema
├── quickstart.md        # Migration Verification tasks
└── tasks.md             # Implementation checklist
```

### Source Code (repository root)

```text
src/app/
├── core/
│   ├── contracts/       # Existing Interfaces (No changes)
│   └── services/        # Mock implementations
├── firebase-adapters/   # [NEW] Concrete Firebase implementations
│   ├── firebase-auth.service.ts
│   ├── firebase-seminar.service.ts
│   ├── firebase-semester.service.ts
│   └── ...
└── supabase-adapters/   # [LEGACY] (To be removed post-migration)

src/environments/        # [VERIFY] Firebase credentials in environment.ts
```

**Structure Decision**: A new `firebase-adapters` directory is created to house all Firebase-specific implementations. Legacy `supabase-adapters` and `services/` (Mocks) are preserved for rollback safety but their usage in `app.config.ts` is replaced.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*(No violations. Plan adheres strictly to all Constitution principles.)*
