# Implementation Plan: Firebase Backend Migration

**Branch**: `017-firebase-backend-migration` | **Date**: 2026-03-15 | **Spec**: [spec.md](file:///D:/website/compscitalks/specs/017-firebase-backend-migration/spec.md)

## Summary

Migrate the CompSci Talks backend from Supabase to Firebase using AngularFire. This involves replacing Authentication, Firestore data modeling (denormalized), and implementing all core services (Seminars, Semesters, Speakers, Tags, RSVPs, Comments) with Firebase adapters. The focus is on performance (denormalization), offline resilience, and fixing critical CRUD regressions.

## Technical Context

**Language/Version**: TypeScript 5.x, Angular 17.x/18.x
**Primary Dependencies**: @angular/fire, firebase, rxjs
**Storage**: Firebase Firestore (Denormalized), Firebase Authentication
**Testing**: Manual via Browser Subagent, documented in `verification_log.md`
**Target Platform**: Web (Vercel/Firebase Hosting compatible)
**Project Type**: Single Page Web Application (Angular)
**Performance Goals**: < 2s initial data load for Archive; < 1.5s CRUD operations.
**Constraints**: Zero regressions; must maintain feature parity; offline persistence enabled.
**Scale/Scope**: ~100+ seminars, tagging system, multi-speaker support, community interactions.

## Project Structure

### Documentation (this feature)

```text
specs/017-firebase-backend-migration/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Technical decisions and Firebase modeling
├── data-model.md        # Firestore collection structures
├── quickstart.md        # Integration scenarios and setup
└── tasks.md             # Implementation tasks
```

### Source Code

```text
src/app/
├── core/
│   ├── contracts/       # Service interfaces (IAuthService, ISeminarService, etc.)
│   └── models/          # Domain models (Seminar, Speaker, Tag)
├── firebase-adapters/   # Firebase-specific service implementations
├── admin/               # Admin dashboard features
│   └── pages/           # Manager components (Seminar, Speaker, Tag)
└── portal/              # Public facing features (Schedule, Archive)
```

**Structure Decision**: The project uses an Adapter pattern. New `Firebase*Service` classes are implemented in `src/app/firebase-adapters/` and wired in `app.config.ts`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Denormalization | O(1) read performance for list views | Direct references would require multiple joins/fetches, slowing down the UI significantly on slow networks. |
| Custom Sync Script | Fix random attendee counts | Manual fix via console is error-prone; script ensures data integrity post-migration. |
