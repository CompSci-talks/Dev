# Tasks: Admin Attendance Emailing

**Input**: Design documents from `specs/008-admin-attendance-email/`
**Prerequisites**: [plan.md](file:///d:/website/compscitalks/specs/008-admin-attendance-email/plan.md), [spec.md](file:///d:/website/compscitalks/specs/008-admin-attendance-email/spec.md), [research.md](file:///d:/website/compscitalks/specs/008-admin-attendance-email/research.md), [data-model.md](file:///d:/website/compscitalks/specs/008-admin-attendance-email/data-model.md), [contracts/email-service.md](file:///d:/website/compscitalks/specs/008-admin-attendance-email/contracts/email-service.md)

**Tests**: Standard Angular unit tests for services and components.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create directory structure for admin attendance feature in `src/app/admin/`
- [ ] T002 Update `tailwind.config.js` with semantic admin tokens (e.g., `admin-primary`) to avoid ad-hoc styling
- [ ] T003 Install `ngx-quill` and `quill` dependencies via npm

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure and service ports

- [ ] T004 [P] Create `EmailService` port (interface) in `src/app/admin/services/email.service.ts`
- [ ] T005 [P] Create `AttendanceService` port (interface) in `src/app/admin/services/attendance.service.ts`
- [ ] T006 [P] Create `MockEmailAdapter` in `src/app/core/adapters/email/mock-email.adapter.ts`
- [ ] T007 Extend `MockSeminarService` in `src/app/core/services/mock-seminar.service.ts` with `getAttendees()` method
- [ ] T008 Configure providers for `EmailService` and `AttendanceService` in `src/app/app.config.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Viewing Seminar Attendance (Priority: P1) 🎯 MVP

**Goal**: Admins can see who marked attendance for a seminar.

**Independent Test**: Navigate to `/admin/seminar/:id/attendance` and see a table of users.

### Implementation for User Story 1

- [ ] T009 [P] [US1] Create `Attendee` model in `src/app/core/models/attendance.model.ts` (Standardize name per dev plan)
- [ ] T010 [US1] Implement `AttendanceService` in `src/app/admin/services/attendance.service.ts` (consuming `MockSeminarService`)
- [ ] T011 [US1] Create `AttendancePageComponent` in `src/app/admin/pages/attendance/attendance.page.ts`
- [ ] T012 [US1] Build `AttendancePageComponent` template with attendee table in `src/app/admin/pages/attendance/attendance.page.html`
- [ ] T013 [US1] Add attendance route to admin routing configuration
- [ ] T014 [US1] Add "Attendance" button to seminar management view to link to this page

**Checkpoint**: User Story 1 fully functional and testable independently.

---

## Phase 4: User Story 2 - Sending Emails to Attendees (Priority: P2)

**Goal**: Admins can filter attendees and send rich-text emails.

**Independent Test**: Filter the list, compose a formatted message, and verify console log delivery via Mock adapter.

### Implementation for User Story 2

- [ ] T015 [US2] Implement filtering logic in `AttendancePageComponent` (by name/email/date)
- [ ] T016 [US2] Add checkbox selection and "Select All" functionality to `AttendancePageComponent`
- [ ] T017 [US2] Create `EmailComposerComponent` in `src/app/admin/components/email-composer/email-composer.component.ts`
- [ ] T018 [US2] Integrate `ngx-quill` editor into `EmailComposerComponent` template
- [ ] T019 [US2] Connect `EmailComposerComponent` to `EmailService` for sending
- [ ] T020 [US2] Trigger `EmailComposerComponent` from the attendance list with selected recipients

**Checkpoint**: User Stories 1 AND 2 working together.

---

## Phase 5: User Story 3 - Provider-Agnostic Implementation (Priority: P3)

**Goal**: Ensure easy swapping of email providers.

**Independent Test**: Switch from `MockEmailAdapter` to a (future) real adapter without UI changes.

### Implementation for User Story 3

- [ ] T021 [US3] Verify correct dependency injection of `EmailService` across all components
- [ ] T022 [US3] Add unit tests for `EmailStatus` handling and verify exclusion logic (SC-004) in `EmailComposerComponent`

---

## Phase N: Polish & Cross-Cutting Concerns

- [ ] T023 [P] Add success/error toast notifications after email sending
- [ ] T024 [P] Add loading indicators to attendance list fetching
- [ ] T025 Run `quickstart.md` validation and verify click-path efficiency (SC-002: <3 clicks)
- [ ] T026 Final code cleanup and documentation update

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 - BLOCKS US1.
- **User Stories (Phase 3+)**: Depend on Phase 2. US1 before US2 (composition needs attendees).

### Parallel Opportunities

- T004, T005, T006 can be done in parallel (Foundational ports).
- T009 [US1 Models] can start as soon as Foundation begins.
- T017 [US2 Composer UI] can be built in parallel with T011 [US1 Table UI].

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and Foundational services.
2. Implement User Story 1 (List viewing).
3. **VALIDATE**: Ensure admin can see attendees for a seminar.

### Incremental Delivery

1. Foundation ready.
2. Add Attendance List (US1) → Demo.
3. Add Filtering & Emailing (US2) → Demo.
