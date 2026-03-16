# Tasks: Admin User Management

This document outlines the implementation tasks for the Admin User Management feature.

## Phase 1: Setup

- [x] T001 Initialize feature organization and technical plan
- [x] T002 Implement Firestore sanitization utility and integration in `src/app/core/utils/firestore-utils.ts`
- [x] T003 Implement name uniqueness validation for administrative entities (FR-025)

## Phase 2: Foundational Components

- [x] T004 Implement base `PaginatedTableComponent` with template projection support in `src/app/shared/components/paginated-table/`
- [x] T005 Implement base `PaginatedGridComponent` with template projection support in `src/app/shared/components/paginated-grid/`
- [x] T006 Add ARIA labels and roles to paginated components (FR-017)
- [x] T007 Implement recursive Firestore sanitization in Firebase adapters (FR-024)

## Phase 3: User Story 1-3 - User Management Dashboard (MVP)

- [x] T008 Refactor `UserManagementPageComponent` to use `PaginatedTableComponent` in `src/app/admin/pages/user-management-page/`
- [x] T009 Implement multi-select checkboxes in the user list table
- [x] T010 Integrate `RoleToggleComponent` into user list rows (FR-006, FR-013)
- [x] T011 Implement "Email Selected" button logic: always visible, disabled if selection count is 0 (FR-014)
- [x] T012 Verify pagination and text-based filtering functionality in the user dashboard

## Phase 4: User Story 4 - Email Composer (Quill Integration)

**Story Goal**: Select multiple users and send collective emails via a dedicated composer.
**Test Criteria**: Navigate to composer with selected user IDs, draft email with Quill editor, send, and verify audit record in Firestore.

- [ ] T013 Create `EmailSelectionService` to share selected UIDs between list and composer in `src/app/admin/services/email-selection.service.ts`
- [ ] T014 [P] [US4] Implement `EmailComposerComponent` skeleton with Quill editor (`ngx-quill`) in `src/app/admin/pages/email-composer-page/`
- [ ] T015 [US4] Implement recipient indicator (list/chip count) in `EmailComposerComponent` using selected data from state service
- [ ] T016 [US4] Implement `SentEmails` Firestore persistence layer (FR-026)
- [ ] T017 [US4] Develop and integrate email sending logic in `EmailComposerComponent`
- [ ] T018 [US4] Add "Go Back" navigation and verify persistence of selection during drafting

## Phase 5: User Story 5 - User Detail & Activity

**Story Goal**: View detailed activity history and profile metadata for individual users.
**Test Criteria**: Click user from list, view detail page with profile info, attendance history, and skeleton loading states.

- [ ] T019 [P] [US5] Create `UserDetailPageComponent` with route definition in `src/app/admin/pages/user-detail-page/`
- [ ] T020 [US5] Implement `ActivityHistoryComponent` with support for seminar list and comments in `src/app/admin/components/activity-history/`
- [ ] T021 [US5] Implement skeleton loading screens for activity data in `UserDetailPageComponent` (FR-016)
- [ ] T022 [US5] Display profile metadata: Enrollment Date, Last Active, and Preferred Topic Areas (FR-011)
- [ ] T023 [US5] Implement granular error handling for partial data failure in activity view (FR-018)

## Phase 6: System-wide Refactoring (Reusable Components)

- [ ] T024 [P] Refactor Semester list to use `PaginatedTableComponent` in `src/app/admin/pages/semester-management-page/`
- [ ] T025 [P] Refactor Speaker management to use `PaginatedTableComponent` in `src/app/admin/pages/speaker-management-page/`
- [ ] T026 [P] Refactor Tag management to use `PaginatedTableComponent` in `src/app/admin/pages/tag-management-page/`
- [ ] T027 Refactor Public Seminar Archive to use `PaginatedGridComponent` in `src/app/portal/pages/archive/`
- [ ] T028 Refactor Upcoming Seminars to use `PaginatedGridComponent` in `src/app/portal/pages/schedule/`

## Phase 7: Polish & Cross-Cutting Concerns

- [ ] T029 Perform final accessibility audit on all refactored tables and grids
- [ ] T030 Update `quickstart.md` with final route details and operational notes

## Dependencies

1. **Foundational (Ph1-2)**: MUST complete before any User Story.
2. **Phase 3 (MVP)**: Prerequisite for Phase 4 (Selection logic).
3. **Phase 4 & 5**: Can be worked on in parallel once Phase 3 is stable.

## Implementation Strategy

- **Incremental Delivery**: Start with the Foundational refactors (Phase 6) to dogfood the new pagination components.
- **State Management**: Favor the `EmailSelectionService` (in-memory) for communication between User Management and Email Composer.
- **Data Integrity**: Ensure the Firestore sanitization and name uniqueness validators are applied to all new and refactored forms.
