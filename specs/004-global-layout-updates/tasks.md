---
description: "Task list template for feature implementation"
---

# Tasks: Global Layout Updates

**Input**: Design documents from `/specs/004-global-layout-updates/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

*(No additional project setup required as we are integrating into the existing Angular architecture. We will use the Angular CLI for generation).*

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

*(No foundational data models or API services are required for this purely presentational feature).*

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Global Footer Navigation (Priority: P1) 🎯 MVP

**Goal**: Implement a comprehensive footer containing quick links, contact info, and social connections visible on all pages.

**Independent Test**: Navigate to the homepage (`http://localhost:4200/`), scroll to the bottom, and verify the presence of the new styled footer matching `oldExample`.

### Implementation for User Story 1

- [x] T001 [US1] Generate the `FooterComponent` using Angular CLI in `src/app/core/components/footer/`
- [x] T002 [US1] Migrate the HTML structure and Tailwind classes from `oldExample/index.html` to `src/app/core/components/footer/footer.component.html`
- [x] T003 [US1] Integrate `app-footer` into the main application layout (`src/app/app.component.html` or equivalent root wrapping template)

**Checkpoint**: At this point, User Story 1 should be fully functional and the footer should appear on all existing views.

---

## Phase 4: User Story 2 - Schedule Navigation (Priority: P1)

**Goal**: Add a "Schedule" link to the existing global navigation bar.

**Independent Test**: From the homepage, verify a "Schedule" link exists in the navbar. Clicking it should route to `/schedule`.

### Implementation for User Story 2

- [x] T004 [US2] Update `src/app/core/components/navbar/navbar.component.html` (or equivalent header file) to include the new "Schedule" link with `routerLink="/schedule"`

**Checkpoint**: The navigation link is present, though clicking it will currently fail or redirect until US3 is complete.

---

## Phase 5: User Story 3 - Exploring the Schedule Overview (Priority: P2)

**Goal**: Create a dedicated Schedule page outlining the next seminar and featured talks based on the provided reference layout.

**Independent Test**: Navigate to `http://localhost:4200/schedule` and verify the page structure contains a Hero section and placeholder blocks for seminars.

### Implementation for User Story 3

- [x] T005 [P] [US3] Generate the `ScheduleComponent` using Angular CLI in `src/app/portal/pages/schedule/`
- [x] T006 [P] [US3] Add the `/schedule` route to the application's routing configuration (e.g., `src/app/app.routes.ts` or `src/app/portal/portal.routes.ts`)
- [x] T007 [US3] Migrate the core structural HTML and Tailwind classes from `oldExample/schedule.html` (Hero, Next Seminar, Featured Talks blocks) to `src/app/portal/pages/schedule/schedule.component.html`

**Checkpoint**: All user stories should now be independently functional. The user can navigate to `/schedule` via the navbar and see the static layout.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T008 [P] Ensure mobile responsiveness for the Footer component.
- [x] T009 [P] Ensure mobile responsiveness for the Schedule component.
- [x] T010 Run local verification of routing and empty states.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Done
- **Foundational (Phase 2)**: Done
- **User Stories (Phase 3+)**: Can start immediately.
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Independent.
- **User Story 2 (P1)**: Independent, but links to US3.
- **User Story 3 (P2)**: Independent, provides the target for US2.
