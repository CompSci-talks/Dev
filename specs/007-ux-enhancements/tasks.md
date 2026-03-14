# Tasks: UX Enhancements: Loaders, Placeholders, and Admin Navigation

**Input**: Design documents from `/specs/007-ux-enhancements/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and design tokens

- [x] T001 Configure Tailwind CSS tokens for indeterminate progress and skeletons in `tailwind.config.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure for state management

- [x] T002 Implement/Verify global `isLoading$` reactive state in `src/app/app.component.ts`. Ensure logic allows for <100ms state updates (SC-001).

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Seamless Page Navigation (Priority: P1) 🎯 MVP

**Goal**: Show a global navigation loader during route changes and handle slow network timeouts.

**Independent Test**: Throttle network to "Slow 3G" in browser dev tools, navigate between Schedule and Archive, verify loader appears and after 10s a "Slow connection" message appears.

### Implementation for User Story 1

- [x] T003 [US1] Refine global progress bar styles in `src/app/app.component.ts` using Tailwind tokens defined in T001 (e.g., `bg-primary`, `h-progress`).
- [x] T004 [US1] Implement 10s timeout logic for `isLoading$` state in `src/app/app.component.ts`
- [x] T005 [US1] Update `AppComponent` template to handle and display slow network warnings in `src/app/app.component.ts`

**Checkpoint**: User Story 1 functional and testable independently.

---

## Phase 4: User Story 3 - Admin Entry Experience (Priority: P1)

**Goal**: Automatically redirect admins to the dashboard and provide a persistent navigation link.

**Independent Test**: Login as admin and verify redirection to `/admin`. Navigate to a specific seminar via URL and verify NO redirection occurs (deep-link preservation).

### Implementation for User Story 3

- [x] T006 [US3] Implement refined redirection logic in `AppComponent.ngOnInit` with deep-link exclusion in `src/app/app.component.ts`
- [x] T007 [P] [US3] Finalize semantic styles for "Admin Dashboard" navigation link in `src/app/app.component.ts` using the global semantic palette (Principle XI).

**Checkpoint**: Admin entry flow verified.

---

## Phase 5: User Story 2 - Smooth Content Loading (Priority: P2)

**Goal**: Display skeleton cards for seminar lists and placeholders for speaker images.

**Independent Test**: Navigate to Archive while offline or slow; verify 6 skeleton cards appear. Verify CLS is minimal when data arrives.

### Implementation for User Story 2

- [x] T008 [P] [US2] Refine `SkeletonCardComponent` dimensions to match `SeminarCardComponent` exactly in `src/app/portal/components/skeleton-card/skeleton-card.component.ts`
- [x] T009 [US2] Implement `(load)` and `(error)` event handlers for speaker images in `src/app/portal/components/seminar-card/seminar-card.component.ts`
- [x] T010 [US2] Add image skeleton and fallback icon to `SeminarCardComponent` template in `src/app/portal/components/seminar-card/seminar-card.component.html`
- [x] T011 [P] [US2] Ensure all seminar lists use standardized skeleton placeholders in `src/app/portal/pages/archive/archive.component.html` and `src/app/portal/pages/schedule/schedule.component.html`

**Checkpoint**: Content loading experience fully enhanced.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and styling polish

- [x] T012 [P] Verify SC-002 (CLS < 0.1) using browser performance tools
- [x] T013 Verify SC-001 (<100ms feedback) for all navigation actions
- [x] T014 Run cross-browser verification for indeterminate progress animation

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on T001
- **User Stories (Phases 3/4/5)**: Depend on Phase 2 completion
- **Polish (Phase 6)**: Depends on all stories completion

### User Story Dependencies
- **US1 (P1)**: Independent of US2/US3
- **US3 (P1)**: Independent of US1/US2
- **US2 (P2)**: Independent of US1/US3

### Parallel Opportunities
- T007 [US3] can run in parallel with US1 tasks
- T008 [US2] and T011 [US2] can run in parallel if multiple developers are available
- All Phase 6 verification tasks marked [P] can run in parallel

---

## Implementation Strategy

### MVP First
1. Complete Phase 1 & 2
2. Complete US1 (Seamless Navigation)
3. Complete US3 (Admin Redirection)
4. Validate P1 requirements

### Incremental Delivery
1. Add US2 (Skeleton Loading) after P1 is stable
2. Final polish and performance verification
