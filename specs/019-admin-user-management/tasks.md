# Tasks: Admin User Management

**Input**: Design documents from `/specs/019-admin-user-management/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are included as per the `plan.md` mentioning Cucumber and Angular Testing Library.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Define User Management routes in `src/app/features/admin/admin-routing.module.ts`
- [ ] T002 Register the new `admin/user-management` path in `src/app/features/admin/admin.module.ts` or equivalent routing config

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [ ] T003 [P] Create `UserProfile` model interface in `src/app/core/models/user.model.ts` based on `data-model.md`
- [ ] T004 [P] Create `ActivityLog` model interface in `src/app/core/models/activity.model.ts`
- [ ] T005 [P] Create reusable `PaginationComponent` (UI only) in `src/app/core/shared/components/pagination/`
- [ ] T006 [P] Create reusable `TextFilterComponent` (UI only) in `src/app/core/shared/components/text-filter/`
- [ ] T007 [P] Define `UserProfilePort` in `src/app/core/services/ports/user.port.ts` using `IUserService` contract
- [ ] T008 [P] Define `ActivityPort` in `src/app/core/services/ports/activity.port.ts` using `IUserActivityService` contract

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - View All Users (Priority: P1) 🎯 MVP

**Goal**: As an admin, I want to see a paginated list of all registered users.

**Independent Test**: Navigate to Admin > User Management and verify the table displays user data with working pagination buttons.

### Implementation for User Story 1

- [ ] T009 [US1] Implement `FirebaseUserProfileService` adapter in `src/app/core/services/adapters/firebase-user.service.ts` for `getUsers` with cursor pagination
- [ ] T010 [US1] Create `UserListComponent` in `src/app/features/admin/components/user-list/` using `PaginationComponent`
- [ ] T011 [US1] Create `UserManagementPage` in `src/app/features/admin/pages/user-management-page/` to host the list
- [ ] T012 [US1] Add unit test for `FirebaseUserService.getUsers` in `src/app/core/services/adapters/firebase-user.service.spec.ts`

**Checkpoint**: User Story 1 (MVP) is fully functional and testable.

---

## Phase 4: User Story 2 - Filter User List (Priority: P2)

**Goal**: As an admin, I want to filter the user list by name or email.

**Independent Test**: Enter text in the search box on the User Management page and verify the list filters accordingly.

### Implementation for User Story 2

- [ ] T013 [US2] Update `FirebaseUserService.getUsers` to support basic text filtering
- [ ] T014 [US2] Integrate `TextFilterComponent` into `UserManagementPage` and connect to `UserListComponent`
- [ ] T015 [US2] Add unit test for filtering logic in `src/app/core/services/adapters/firebase-user.service.spec.ts`
- [ ] T031 [US2] Implement "No Users Found" zero-state UI in `UserListComponent` [NEW]

---

## Phase 5: User Story 3 - Manage User Roles (Priority: P2)

**Goal**: As an admin, I want to toggle a user's role between 'User' and 'Admin'.

**Independent Test**: Use the role toggle on a user row and verify the role updates in Firestore.

### Implementation for User Story 3

- [ ] T016 [US3] Implement `updateUserRole` in `FirebaseUserService`
- [ ] T017 [US3] Create `RoleToggleComponent` in `src/app/features/admin/components/role-toggle/`
- [ ] T018 [US3] Integrate `RoleToggleComponent` into `UserListComponent` rows
- [ ] T019 [US3] Add success/error toast notifications using `ToastService` when role is updated

---

## Phase 6: User Story 5 - User Activity Detail (Priority: P2)

**Goal**: As an admin, I want to view a user's detailed activity (seminars, comments).

**Independent Test**: Click a user row and verify redirection to a detail page with attendance and comment history.

### Implementation for User Story 5

- [ ] T020 [US5] Implement `FirebaseUserActivityService` in `src/app/core/services/adapters/firebase-user-activity.service.ts`
- [ ] T021 [US5] Create `UserDetailComponent` in `src/app/features/admin/components/user-detail/` (with specific sub-views for Attendance and Comments history)
- [ ] T022 [US5] Create `UserDetailPage` in `src/app/features/admin/pages/user-detail-page/`
- [ ] T023 [US5] Implement navigation from `UserListComponent` rows to `UserDetailPage`

---

## Phase 7: User Story 4 - Multi-Select and Email (Priority: P3)

**Goal**: As an admin, I want to select multiple users and send them an email.

**Independent Test**: Check multiple users, click "Send Email", and verify the composer opens with selected recipients.

### Implementation for User Story 4

- [ ] T024 [US4] Add checkbox selection logic to `UserListComponent`
- [ ] T025 [US4] Implement "Email Selected" action that maps selected users to the `EmailService.openComposer` call
- [ ] T032 [US4] Add validation for recipient count (min 1, max 50) and error feedback in email action [NEW]

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, performance checks, and consistency.

- [ ] T026 [P] Verify SC-001: Filtering 1,000 users performs under 500ms
- [ ] T027 [P] Verify SC-003: Re-use `PaginationComponent` and `TextFilterComponent` in the existing Attendees Page
- [ ] T028 [P] UI Polish: Ensure consistent dark mode and transition animations for dashboard views
- [ ] T029 [P] Final E2E verification using Cucumber in `tests/e2e/features/admin-user-management.feature`
- [ ] T030 [P] Verify SC-004: Multi-selection of 50 users performs with <100ms UI response time

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Core components and interfaces. BLOCKS user story implementation.
- **User Stories (Phases 3-7)**: Depend on Phase 2. US1 is the highest priority (P1).
- **Polish (Phase 8)**: Depends on completion of all user stories.

### User Story Independence

- **US1** is the foundation for US2, US3, US4, and US5.
- **US2, US3, US4, US5** can be implemented in any order once US1 is functional, but follow priority (P2 before P3).

---

## Parallel Opportunities

- Phase 2 tasks (T003-T008) can largely run in parallel as they define different model/component interfaces.
- Once the `FirebaseUserService` (T009) is stable, US2, US3, and US5 can progress in parallel across different components/pages.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 & 2.
2. Complete Phase 3 (US1).
3. **STOP and VALIDATE**: Test basic user listing and pagination.

### Incremental Delivery

1. Add US2 (Filtering).
2. Add US3 (Roles).
3. Add US5 (Activity).
4. Add US4 (Emailing).
