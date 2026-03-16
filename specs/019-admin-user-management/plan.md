# Implementation Plan: Refactoring to Paginated Table and Grid Components

**Branch**: `019-admin-user-management` | **Date**: 2026-03-16 | **Spec**: [spec.md](file:///d:/website/compscitalks/specs/019-admin-user-management/spec.md)

## Summary
Refactor existing list implementations into reusable `PaginatedTableComponent` and `PaginatedGridComponent`. These components will handle pagination, filtering logic (generic search), and skeleton loading states, ensuring consistency across the Admin Dashboard and Public Schedule.

## Technical Context
- **Language/Version**: TypeScript 5.x / Angular 19+
- **Primary Dependencies**: Tailwind CSS, RxJS, Angular Common
- **Storage**: Firestore (via Firebase Adapters)
- **Testing**: Playwright/Cucumber (E2E), Jasmine/Karma (Unit)
- **Target Platform**: Web
- **Project Type**: Web Application
- **Performance Goals**: <500ms filtering for 1k users.
- **Constraints**: Premium aesthetics, accessibility-first, no `any`.

## Constitution Check
- **Principle I (Adapter Pattern)**: ✅ The components do not interact with Firebase directly; they consume data passed from parent containers.
- **Principle VII (Strict Typing)**: ✅ Uses specified interfaces and generics where possible.
- **Principle IX (Error Handling)**: ✅ Components include explicit empty states and will support partial error messaging.
- **Principle XI (Centralized Styling)**: ✅ Relies on Tailwind utility classes and theme tokens.
- **Principle XII (Shared Components)**: ✅ This entire task is to promote existing logic to `core/shared` (or `shared/components`).

## Project Structure
```text
src/app/shared/components/
├── paginated-table/
│   ├── paginated-table.component.ts
│   └── paginated-table.component.html (inline)
├── paginated-grid/
│   ├── paginated-grid.component.ts
│   └── paginated-grid.component.html (inline)
└── pagination/
    └── pagination.component.ts
```

## Proposed Changes

### [MODIFY] [PaginatedTableComponent](file:///d:/website/compscitalks/src/app/shared/components/paginated-table/paginated-table.component.ts)
- Add accessibility attributes (ARIA).
- Ensure consistent styling with platform (dark mode support).

### [MODIFY] [PaginatedGridComponent](file:///d:/website/compscitalks/src/app/shared/components/paginated-grid/paginated-grid.component.ts)
- Integrate with `SkeletonCardComponent` as the default skeleton if none provided.
- Add responsive grid gap tuning.

### [REFAC] Administrative Tables
- **User Management**: `src/app/admin/pages/user-management-page/user-management-page.component.ts`
- **Seminar Management**: `src/app/admin/pages/seminar-manager/seminar-manager.component.ts`
- **Semester Management**: `src/app/admin/pages/semester-manager/semester-manager.component.ts`
- **Speaker Management**: `src/app/admin/pages/speaker-manager/speaker-manager.component.ts`
- **Tag Management**: `src/app/admin/pages/tag-manager/tag-manager.component.ts`

### [REFAC] Public Grid Views
- **Upcoming Schedule**: `src/app/portal/pages/schedule/schedule.component.ts`
- **Archive**: `src/app/portal/pages/archive/archive.component.ts`

## Verification Plan

### Automated Tests
- Run `npm run test` (if available) or existing unit tests for components.
- playwright/cucumber tests for user list filtering and pagination.

### Manual Verification
- Verify loading states via "Fast 3G" network throttling in Chrome DevTools.
- Verify dark mode switch consistency.
