# Implementation Plan: ContactUsModeration Dashboard

**Branch**: `029-admin-contact-dashboard` | **Date**: 2026-04-10 | **Spec**: [spec.md](../029-admin-contact-dashboard/spec.md)
**Input**: Feature specification from `/specs/029-admin-contact-dashboard/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a secure Admin ContactUsModeration dashboard at `/admin/feedback` to read, manage, and follow up on messages submitted via the "Contact Us" public form. Admins can view up to 50 active submissions.
- Fetches data via the adapter.
- Manages UI state for the detail slide-over.
- **Side Effects**: Automatically calls `updateStatus` ('read') when a 'new' submission is viewed, and `updateStatus` ('resolved') when 'Reply' is clicked.

## Technical Context

**Language/Version**: TypeScript / Angular  
**Primary Dependencies**: Angular, Firebase/Firestore, Tailwind CSS  
**Storage**: Firestore (collection: `contact_submissions`)  
**Testing**: Vitest (Unit), Playwright (E2E), and standard `ng test`  
**Target Platform**: Web Browser
**Project Type**: Front-end Web Application (Admin Feature Slice)
**Performance Goals**: Detail view loads < 500ms (perceived); UI feedback < 1s; initial list load < 2s.  
**Constraints**: 
- Must use existing Tailwind glassmorphism design tokens.
- **Palette Alignment**: Use `admin.DEFAULT` (#2563eb) for primary actions, `surface.elevated` (#f1f5f9) for containers, and `status.*` tokens for badges.
- **Components**: Strict Smart/Dumb separation (Principle IV).
- **Data**: Must follow Adapter pattern for Firestore (Principle IX).  
**Scale/Scope**: Max list render is 50 items.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Separation of Concerns via Adapter Pattern**: Pass. Spec dictates using the Adapter pattern for consuming `contact_submissions`.
- **II. Clean Architecture**: Pass. Will be placed inside the `admin` feature slice.
- **III. Interface-First Development**: Pass. Will define `ContactSubmission` port interface.
- **IV. Smart vs. Dumb Component Boundary**: Pass. Spec explicitly dictates UI state separation.
- **V. Authentication-Gated Content**: Pass. Protected by `AdminGuard`.
- **VII. Strict Typing**: Pass. Strict interfaces will be created.
- **VIII. Reactive Data Flow**: Pass. Firestore adapter will return observables.
- **XI & XII. Reusable Shared Components & Styling**: Pass. Uses existing Tailwind UI structures for list/table and slide-over panels.

No violations found.

## Project Structure

### Documentation (this feature)

```text
specs/029-admin-contact-dashboard/
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
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/

```text
src/app/
├── admin/
│   ├── pages/
│   │   └── contact-us-moderation/   # Smart component & Routing
│   ├── components/
│   │   ├── feedback-list/           # Dumb: Table UI
│   │   └── feedback-detail/         # Dumb: Slide-over UI
│   └── services/
│       # Implementation of moderation adapter logic
├── core/
│   ├── contracts/
│   │   └── contact-submission.interface.ts # Port definition
│   └── models/
│       └── user.model.ts                   # Used for bridge mapping
```

**Structure Decision**: Standard Angular feature-slice structure (Feature: Admin). Follows the component-per-folder convention.

## Email Bridge Implementation
- **Mapping**: `ContactSubmission` -> `User` model mapping occurs in the Smart component.
- **Return Path**: `EmailSelectionService` will be extended (or query params used) to support an optional `returnUrl`.
- **Default**: Composer will fall back to `/admin/feedback` when initiated from this dashboard.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
