# Tasks: Admin User Management

## Implementation Strategy
- **MVP First**: Establish the User Management list and pagination (US1) as the foundational increment.
- **Incremental Delivery**: Deliver Filtering (US2) and Role Management (US3) sequentially.
- **Shared Core**: Extraction of Pagination and Filter components is mandatory for reuse in other features (FR-003, FR-005).

## Phase 1: Setup
- [ ] T001 Initialize feature structure and routes in `src/app/admin/admin-routing.module.ts`
- [ ] T002 [P] Create admin bootstrap CLI script (Phase 0 logic) in `scripts/bootstrap-admin.ts`

## Phase 2: Foundational (Core & Shared)
- [ ] T003 [P] Update `src/app/core/models/user.model.ts` and `src/app/core/models/user-profile.model.ts` with new fields (attendanceCount, lastActiveTimestamp)
- [ ] T004 [P] Establish `src/app/core/contracts/user.service.interface.ts` and `src/app/core/contracts/user-activity.service.interface.ts`
- [ ] T005 [P] Create Reusable Pagination Component in `src/app/shared/components/pagination/`
- [ ] T006 [P] Create Reusable Text Filter Component in `src/app/shared/components/text-filter/`

## Phase 3: [US1] View All User Profiles (P1)
**Goal**: Display a paginated list of all users.
**Independent Test**: Navigate to `/admin/users` and verify 10+ users render with pagination controls.

- [ ] T007 [P] [US1] Implement `getUsers` in `src/app/firebase-adapters/firebase-user-profile.service.ts` using cursor pagination
- [ ] T008 [US1] Create `UserListComponent` (Dumb) in `src/app/admin/components/user-list/`
- [ ] T009 [US1] Create `UserManagementPage` (Smart) in `src/app/admin/pages/user-management-page/`
- [ ] T010 [US1] Integrate `PaginationComponent` into `UserManagementPage`

## Phase 4: [US2] Filter User List (P2)
**Goal**: Search users by name or email.
**Independent Test**: Enter partial name in filter and verify list matches.

- [ ] T011 [US2] Update `FirebaseUserProfileService` to handle `filter` parameter in `getUsers`
- [ ] T012 [US2] Integrate `TextFilterComponent` into `UserManagementPage`
- [ ] T013 [US2] Handle "No Users Found" state (FR-012) in `UserListComponent`

## Phase 5: [US3] Manage User Roles (P2)
**Goal**: Admin can toggle roles between 'admin' and 'authenticated'.
**Independent Test**: Change a user's role and verify real-time update in Firestore.

- [ ] T014 [US3] Implement `updateUserRole` in `FirebaseUserProfileService`
- [ ] T015 [US3] Create `RoleToggleComponent` in `src/app/admin/components/role-toggle/`
- [ ] T016 [US3] Add self-demotion guard in `RoleToggleComponent` (FR-015)

## Phase 6: [US5] User Profile Activity Detail (P2)
**Goal**: View summary of user activity.
**Independent Test**: Click user from list, verify detail page shows attendance and comments.

- [ ] T017 [P] [US5] Implement `FirebaseUserActivityService` in `src/app/firebase-adapters/firebase-user-activity.service.ts`
- [ ] T018 [US5] Create `UserDetailPage` (Smart) in `src/app/admin/pages/user-detail-page/`
- [ ] T019 [US5] Implement Skeleton Screens (FR-016) in `UserDetailPage`
- [ ] T020 [US5] Create `ActivityHistoryComponent` in `src/app/admin/components/user-activity/`
- [ ] T021 [US5] Implement specific error messages for partial activity load failures (FR-018)

## Phase 7: [US4] Multi-Select and Email (P3)
**Goal**: Bulk email users.
**Independent Test**: Select 2 users, click "Email", verify composer has 2 recipients.

- [ ] T022 [US4] Add multi-selection state to `UserManagementPage`
- [ ] T023 [US4] Integrate with `EmailService` with batch validation (min 1, max 50) (FR-014)

## Phase 8: Polish & Cross-Cutting
- [ ] T024 [P] Accessibility audit: ARIA labels and Keyboard navigation for user list
- [ ] T025 [P] Performance verification: Confirm <500ms filtering for 1k users (SC-001)

## Dependencies
- US1 is mandatory and blocks all subsequent User Stories.
- US2, US3, and US5 can be implemented in parallel after US1.
- US4 depends on US1.

## Parallel Execution Examples
- **Stream A**: T007 -> T008 -> T009 (US1 Implementation)
- **Stream B**: T003 -> T004 -> T005 (Foundational setup)
