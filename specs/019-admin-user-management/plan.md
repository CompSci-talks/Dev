# Implementation Plan: Admin User Management

**Branch**: `019-admin-user-management` | **Date**: 2026-03-16 | **Spec**: [spec.md](file:///D:/website/compscitalks/specs/019-admin-user-management/spec.md)
**Input**: Feature specification from `/specs/019-admin-user-management/spec.md`

## Summary

This feature implements a centralized Administrative User Management interface. The core technical approach centers on building reusable, accessible pagination and grid components in the shared domain (`PaginatedTableComponent`, `PaginatedGridComponent`) to be used across all administrative and public lists for UI/UX consistency. Additionally, a robust Firestore sanitization utility and name uniqueness validation ensure data integrity.

## Technical Context

**Language/Version**: TypeScript / Angular 17+
**Primary Dependencies**: Firebase SDK (Auth, Firestore), Tailwind CSS, RxJS, Lucide Angular
**Storage**: Firestore (User Profiles, Attendance, Activities)
**Testing**: Jasmine/Karma (Unit), Cucumber/Playwright (E2E)
**Target Platform**: Web
**Project Type**: Web application 
**Performance Goals**: <500ms filter latency for 1,000 users; <100ms multi-selection response
**Constraints**: Tailwind-only styling (semantic classes); No super-admin role; Self-demotion guard required.
**Scale/Scope**: ~1,000 initial users, 5-10 administrative entity types.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Separation via Adapters | ✅ PASS | Firebase adapters used exclusively; UI depends on ports. |
| II. Vertical Slicing | ✅ PASS | Feature logic encapsulated in `app/admin/pages/user-management-page`. |
| III. Interface-First | ✅ PASS | Service interfaces defined before implementations. |
| VII. Strict Typing | ✅ PASS | All models (UserProfile, SeminarAttendance) explicitly typed. |
| IX. Loading/Empty States | ✅ PASS | Skeleton screens (FR-016) and Empty states (FR-012) required. |
| XI. Centralized Styling | ✅ PASS | Using Tailwind semantic tokens exclusively. |
| XII. Reusable Components | ✅ PASS | `PaginatedTable` and `PaginatedGrid` moved to shared/core. |

## Project Structure

### Documentation (this feature)

```text
specs/019-admin-user-management/
├── spec.md              # Feature requirements and clarifications
├── plan.md              # This file (Technical strategy)
├── research.md          # Phase 0 output (Technical decisions)
├── data-model.md        # Phase 1 output (Entity definitions)
├── quickstart.md        # Phase 1 output (Developer setup)
├── contracts/           # Phase 1 output (Service interfaces)
└── tasks.md             # Implementation tasks (Generated via /speckit.tasks)
```

### Source Code (repository root)

```text
src/app/
├── admin/
│   ├── pages/
│   │   ├── user-management-page/
│   │   ├── user-detail-page/
│   │   └── email-composer-page/
│   ├── components/
│   │   ├── user-list/
│   │   └── activity-history/
│   └── services/
├── shared/
│   └── components/
│       ├── paginated-table/
│       └── paginated-grid/
├── core/
│   ├── utils/
│   │   └── firestore-utils.ts
│   └── models/
```

**Structure Decision**: Standard Angular feature-sliced structure. Shared components placed in `shared/components` for cross-feature availability.

## Complexity Tracking

*No violations identified.*
