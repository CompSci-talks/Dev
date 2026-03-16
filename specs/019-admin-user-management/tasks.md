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

- [x] T001 Define User Management routes in `src/app/app.routes.ts`
- [x] T002 Register the new `admin/user-management` path in `src/app/app.routes.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T003 [P] Create `UserProfile` model interface in `src/app/core/models/user-profile.model.ts`
- [x] T004 [P] Create `UserActivity` model interface in `src/app/core/models/user-activity.model.ts`
- [x] T005 [P] Create reusable `PaginationComponent` (UI only) in `src/app/shared/components/pagination/`
- [x] T006 [P] Create reusable `TextFilterComponent` (UI only) in `src/app/shared/components/text-filter/`
- [x] T007 [P] Define `UserProfilePort` in `src/app/core/contracts/user.service.interface.ts`
- [x] T008 [P] Define `ActivityPort` in `src/app/core/contracts/user-activity.service.interface.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - View All Users (Priority: P1) 🎯 MVP

**Goal**: As an admin, I want to see a paginated list of all registered users.

**Independent Test**: Navigate to Admin > User Management and verify the table displays user data with working pagination buttons.

### Implementation for User Story 1

- [x] T009 [US1] Implement `FirebaseUserProfileService` adapter in `src/app/firebase-adapters/firebase-user-profile.service.ts` for `getUsers` with cursor pagination
- [x] T010 [US1] Create `UserListComponent` in `src/app/admin/components/user-list/` using `PaginationComponent`
- [x] T011 [US1] Create `UserManagementPage` in `src/app/admin/pages/user-management-page/` to host the list
- [x] T012 [US1] Implement cursor-based pagination logic in `UserManagementPageComponent`

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

- [x] T016 [US3] Implement `updateUserRole` in `FirebaseUserService`
- [x] T017 [US3] Create `RoleToggleComponent` in `src/app/admin/components/role-toggle/`
- [x] T018 [US3] Integrate `RoleToggleComponent` into `UserListComponent` rows
- [x] T019 [US3] Add success/error toast notifications using `ToastService` when role is updated
- [x] T033 [US3] Add client-side check to disable/hide role toggle for the currently logged-in Admin's own profile (FR-015) [NEW]

---

## Phase 6: User Story 5 - User Activity Detail (Priority: P2)

**Goal**: As an admin, I want to view a user's detailed activity (seminars, comments).

**Independent Test**: Click a user row and verify redirection to a detail page with attendance and comment history.

### Implementation for User Story 5

- [x] T020 [US5] Implement `FirebaseUserActivityService` in `src/app/firebase-adapters/firebase-user-activity.service.ts`
- [x] T021 [US5] Create `UserDetailComponent` in `src/app/admin/components/user-detail/` (with specific sub-views for Attendance and Comments history)
- [x] T022 [US5] Create `UserDetailPage` in `src/app/admin/pages/user-detail-page/`
- [x] T023 [US5] Implement navigation from `UserListComponent` rows to `UserDetailPage`
- [x] T034 [US5] Implement skeleton screen loaders for activity sections (FR-016) [NEW]
- [x] T035 [US5] Implement partial error states for activity history sections (FR-018) [NEW]

---

## Phase 7: User Story 4 - Multi-Select and Email (Priority: P3)

**Goal**: As an admin, I want to select multiple users and send them an email.

**Independent Test**: Check multiple users, click "Send Email", and verify the composer opens with selected recipients.

### Implementation for User Story 4

- [x] T024 [US4] Add checkbox selection logic to `UserListComponent`
- [x] T025 [US4] Implement "Email Selected" action that maps selected users to the `EmailService.openComposer` call
- [x] T032 [US4] Add validation for recipient count (min 1, max 50) and error feedback in email action [NEW]

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, performance checks, and consistency.

- [ ] T026 [P] Verify SC-001: Filtering 1,000 users performs under 500ms
- [ ] T027 [P] Verify SC-003: Re-use `PaginationComponent` and `TextFilterComponent` in the existing Attendees Page
- [ ] T028 [P] UI Polish: Ensure consistent dark mode and transition animations for dashboard views
- [ ] T029 [P] Final E2E verification using Cucumber in `tests/e2e/features/admin-user-management.feature`
- [ ] T030 [P] Verify SC-004: Multi-selection of 50 users performs with <100ms UI response time
- [ ] T036 [P] Audit and verify accessibility (ARIA roles, keyboard tab order) for new components (FR-017) [NEW]

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
