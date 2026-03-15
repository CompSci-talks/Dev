# Implementation Plan: Firebase Backend Migration

**Branch**: `017-firebase-backend-migration` | **Date**: 2026-03-15 | **Spec**: [spec.md](spec.md)

## Summary

Migrate the CompSci Talks platform from Supabase/Mock backends to a unified Firebase ecosystem. This involves implementing AngularFire-based adapters for all core services, denormalizing the Firestore schema for high-performance seminar rendering, and extending the Admin Dashboard with enhanced attendance management and comment moderation.

## Technical Context

**Language/Version**: TypeScript 5.x / Angular 19+
**Primary Dependencies**: `@angular/fire` (v19+), `firebase` (v11+), `ngx-quill`
**Storage**: Google Cloud Firestore (Native Mode), Firebase Auth
**Testing**: Angular Testing Library, Jasmine, Manual verification via Browser
**Target Platform**: Web (SPA)
**Project Type**: web-application
**Performance Goals**: < 2s initial load for Archive, < 1.5s admin CRUD latency
**Constraints**: Zero-cost free tier, serverless only, no Storage bucket for now
**Scale/Scope**: ~100 seminars, ~1k users (projected), 12+ administrative screens

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Separation of Concerns**: System uses Injection Tokens and Adapter pattern. (PASS)
- **Interface-First**: All Firebase implementations satisfy existing `ICore*` interfaces. (PASS)
- **Centralized Styling**: Uses current Tailwind configuration. (PASS)
- **Strict Typing**: All Firebase DTOs and service signatures are typed. (PASS)

## Project Structure

### Documentation (this feature)

```text
specs/017-firebase-backend-migration/
├── plan.md              # This file
├── research.md          # Session persistence & Permission logic
├── data-model.md        # Firestore collection schemas & denormalization
├── quickstart.md        # Test scenarios
├── contracts/           # API/Service interface references
└── tasks.md             # Implementation tasks
```

### Source Code

```text
src/app/
├── core/
│   ├── contracts/        # Port definitions
│   └── models/           # Domain entities
├── firebase-adapters/    # Firebase concrete implementations
├── admin/
│   ├── pages/            # Attendance, Moderation, Speakers, Tags
│   └── services/         # Admin-specific logic
└── portal/
    ├── pages/            # Schedule, Archive, Seminar Details
    └── components/       # Seminar cards, Comments
```

**Structure Decision**: Vertical slicing by feature (Admin/Portal) with centralized platform adapters in `firebase-adapters/`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Denormalization | Performance | Joins in Firestore are expensive and slow for listing pages. |
| Mailto Adapter | Zero-cost | Server-side mailing requires a paid SMTP service or Cloud Function. |
