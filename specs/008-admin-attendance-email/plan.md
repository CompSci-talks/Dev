# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

## Summary

Implement a new "Attendance" section within the Admin Dashboard that allows administrators to view, filter, and email participants who have marked attendance for a seminar. The feature will use `ngx-quill` for rich-text composition and follow an interface-first approach (Principle III) for emailing and attendance data fetching.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5+, Angular 17+ (Standalone Components)
**Primary Dependencies**: Tailwind CSS, RxJS, Ng-Lucide, ngx-quill (Rich-Text Editor)
**Storage**: MockSeminarService (to be extended for attendance), LocalStorage/Memory for drafts
**Testing**: Angular Testing Library / Jasmine & Karma
**Target Platform**: Modern Browsers
**Project Type**: Progressive Web Application
**Performance Goals**: < 800ms to load 200 attendee records
**Constraints**: Zero-Cost Infrastructure (Principle VI), Interface-First (Principle III)
**Scale/Scope**: Admin Dashboard (Restricted to 'admin' role)

## Constitution Check

- [x] **Principle I (Adapter Pattern)**: Resolved - `EmailService` port defined in `contracts/`.
- [x] **Principle III (Interface-First)**: Resolved - `EmailService` and `AttendanceService` defined before implementation.
- [x] **Principle VI (Zero-Cost)**: Resolved - `ngx-quill` is open source; Mock Email adapter ensures zero cost during dev.
- [x] **Principle XI (Centralized Styling)**: Resolved - Progress bar and skeletons use `tailwind.config.js`.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/app/
├── admin/
│   ├── pages/
│   │   └── attendance/          # [NEW] Attendance list and filtering
│   ├── components/
│   │   └── email-composer/      # [NEW] Rich-text email composition
│   └── services/
│       ├── attendance.service.ts # [NEW] Fetches attendee data via interface
│       └── email.service.ts      # [NEW] Email port (interface)
└── core/
    └── adapters/
        └── email/               # [NEW] Email adapters (Mock, etc.)
```

**Structure Decision**: Vertical slicing (Principle II) within the `admin` feature slice. Adapters in `core/adapters` for global reuse.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
