# Tasks: Full Application Flow Verification

**Input**: Design documents from `/specs/012-e2e-app-flow-verify/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

## Phase 1: Setup

**Purpose**: Project initialization and base structure

- [x] T001 Initialize Node.js dependencies (`playwright-core`, `@cucumber/cucumber`) in `package.json`
- [x] T002 Create E2E directory structure in `scripts/e2e/`
- [x] T003 Configure Playwright browser instance and global setup in `scripts/e2e/playwright.config.js`

---

## Phase 2: Foundational

**Purpose**: Core utilities and shared helpers

- [x] T004 Implement Admin authentication helper in `scripts/e2e/helpers/auth-helper.js`
- [x] T005 Create base Page Object Models (POM) for Navigation and Admin Dashboard in `scripts/e2e/pom/`
- [x] T006 Implement world/context setup for Cucumber in `scripts/e2e/step_definitions/world.js`

**Checkpoint**: Foundation ready - Environment configured and auth helpers implemented.

---

## Phase 3: User Story 1 - End-to-End Content Lifecycle (Priority: P1)

**Goal**: Verify full CRUD for Semesters and Seminars

**Independent Test**: Run the Semester/Seminar feature tests and verify data persistence in the UI and DB.

- [x] T007 [US1] Create `scripts/e2e/features/semester_management.feature`
- [x] T008 [US1] Implement step definitions for Semester CRUD in `scripts/e2e/step_definitions/semester-steps.js`
- [x] T009 [US1] Create `scripts/e2e/features/seminar_management.feature`
- [x] T010 [US1] Implement step definitions for Seminar CRUD in `scripts/e2e/step_definitions/seminar-steps.js`
- [x] T011 [P] [US1] Create POM for Seminar list and detail views in `scripts/e2e/pom/seminar.pom.js` (including semester.pom.js)

**Checkpoint**: User Story 1 verified - Admin can manage the full content lifecycle.

---

## Phase 4: User Story 2 - Interaction and Moderation (Priority: P2)

**Goal**: Verify comments, nesting, and admin moderation

**Independent Test**: Post a comment/reply and verify an Admin can delete it.

- [x] T012 [US2] Create `scripts/e2e/features/comments_moderation.feature`
- [x] T013 [US2] Implement step definitions for commenting and moderation in `scripts/e2e/step_definitions/comment-steps.js`
- [x] T014 [P] [US2] Implement POM for Comment section and moderation controls in `scripts/e2e/pom/comments.pom.js`

**Checkpoint**: User Story 2 verified - Social features and moderation are functional.

---

## Phase 5: User Story 3 - UI/UX Feedback and Performance (Priority: P3)

**Goal**: Verify clear loading states and smooth transitions

**Independent Test**: Navigate through routes and verify global loader visibility.

- [x] T015 [US3] Create `scripts/e2e/features/ux_feedback.feature`
- [x] T016 [US3] Implement step definitions for checking loader visibility and toast notifications in `scripts/e2e/step_definitions/ux-steps.js`
- [x] T017 [US3] Create `scripts/e2e/features/edge_cases.feature` covering invalid dates and empty states
- [x] T018 [US3] Implement step definitions for data validation and empty state verification

**Checkpoint**: User Story 3 verified - UX enhancements and edge cases are correctly handled.

---

## Phase 6: Reporting & Polish

**Purpose**: BDD report generation and final cleanup

- [x] T019 Implement custom Gherkin reporter to generate `specs/012-e2e-app-flow-verify/walkthrough.md`
- [x] T020 Implement main entry runner `scripts/e2e/verify-app.js`
- [ ] T021 Run full verification loop and generate the final BDD status report
- [ ] T022 Review and optimize step definition reusability

---

## Dependencies & Execution Order

- **Phase 3** depends on **Phase 2 (Auth Helper)**.
- **Phase 4** depends on **Phase 3 (Active Seminar)**.
- **Phase 6** depends on all implementation tasks (T007-T016).

---

## Parallel Opportunities

- T011 and T014 (POM creation) can be done in parallel once features are defined.
- Step implementation for US1 (T008, T010) and US2 (T013) can run in parallel if using separate test tags.
