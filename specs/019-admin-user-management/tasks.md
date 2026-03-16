# Tasks: Unified Paginated List Refactoring

**Feature**: Refactoring all list and grid views to use specialized `PaginatedTableComponent` and `PaginatedGridComponent`.
**Status**: In Progress

## Phase 1: Shared Components & User Management (MVP)
- [x] T001 [P] Implement base `PaginatedTableComponent` in `src/app/shared/components/paginated-table`
- [x] T002 [P] Implement base `PaginatedGridComponent` in `src/app/shared/components/paginated-grid`
- [ ] T003 [P] [US1] Add ARIA labels and accessibility attributes to `PaginatedTableComponent`
- [ ] T004 [P] [US1] Add ARIA labels and accessibility attributes to `PaginatedGridComponent`
- [ ] T005 [US1] Refactor `UserManagementPageComponent` to use `PaginatedTableComponent`
- [ ] T006 [US1] Verify User Management filtering and pagination functionality

## Phase 2: Administrative Tables Refactoring
- [ ] T007 [P] [US1] Refactor `SeminarManagementComponent` to use `PaginatedTableComponent`
- [ ] T008 [P] [US1] Refactor `SemesterManagementComponent` to use `PaginatedTableComponent`
- [ ] T009 [P] [US1] Refactor `SpeakerManagementComponent` to use `PaginatedTableComponent`
- [ ] T010 [P] [US1] Refactor `TagManagementComponent` to use `PaginatedTableComponent`

## Phase 3: Public Grid Views Refactoring
- [ ] T011 [P] [US2] Refactor `ScheduleComponent` (Upcoming) to use `PaginatedGridComponent`
- [ ] T012 [P] [US2] Refactor `ArchiveComponent` to use `PaginatedGridComponent`
- [ ] T013 [P] [US2] Implement specialized skeleton templates for Seminar cards in `PaginatedGridComponent`
- [ ] T017 [P] [US1] Implement specialized skeleton designs for User, Speaker, and Tag rows in `PaginatedTableComponent`
- [ ] T018 [P] [US2] Implement partial error states within `PaginatedTableComponent` and `PaginatedGridComponent` (FR-018)

## Phase 4: Polish & Performance
- [ ] T014 [P] Verify consistent dark mode styling across all refactored views
- [ ] T015 [P] Performance audit: verify <500ms transition/filter time for large lists
- [ ] T016 [P] Ensure all components handle "No Results" states gracefully

## Dependencies
- Phase 1 must complete before Phase 2 and 3.
- User Story 1 (Admin Tables) and User Story 2 (Public Grids) can be processed in parallel once Phase 1 is done.

## Implementation Strategy
- Start with `UserManagementPage` as it's the primary complex table.
- Use `ScheduleComponent` as the primary complex grid.
- Progressively migrate other management tables.
