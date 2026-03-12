# Tasks: Phase 2 — Admin Dashboard

## Phase 1: Models & Contracts (Setup)

**Purpose**: Define the data structures and interfaces for administrative capabilities.

- [x] T001 Create `Semester` model in `src/app/core/models/semester.model.ts`
- [x] T003 Create `ISemesterService` contract in `src/app/core/contracts/semester.interface.ts`
- [x] T004 Update `ISeminarService` contract in `src/app/core/contracts/seminar.interface.ts` with CRUD methods

---

## Phase 2: Services & Auth (Foundational)

**Purpose**: Implement the business logic and security required for admin access.

- [x] T005 Implement `MockSemesterService` in `src/app/core/services/mock-semester.service.ts`
- [x] T006 Implement `SupabaseSemesterService` in `src/app/supabase-adapters/supabase-semester.service.ts`
- [x] T007 Update `MockSeminarService` in `src/app/core/services/mock-seminar.service.ts` for CRUD
- [x] T010 Update `SupabaseSeminarService` in `src/app/supabase-adapters/supabase-seminar.service.ts` for CRUD
- [x] T011 Create `AdminGuard` in `src/app/core/admin.guard.ts`

---

## Phase 3: Infrastructure & Routing

**Purpose**: Set up the admin routing and layout.

- [x] T012 Configure `/admin` parent and child routes in `src/app/app.routes.ts`
- [x] T013 Create `AdminLayoutComponent` in `src/app/admin/components/admin-layout/`

---

## Phase 4: Semester Management

**Purpose**: Implement the UI for managing academic terms.

- [x] T014 Create `SemesterListComponent` in `src/app/admin/pages/semester-manager/`
- [x] T015 Create `SemesterFormComponent` for Create/Edit operations
- [x] T016 Implement "Set as Active" logic and verify date-range filtering in the public portal `SeminarService`

---

## Phase 5: Seminar Management

**Purpose**: Implement the UI for scheduling and material management.

- [x] T017 Create `SeminarListComponent` (Admin view with total RSVPs)
- [x] T018 Create `SeminarFormComponent` (CRUD)
- [x] T019 Implement Hybrid Material management (Upload, Manual Google Drive ID, or URL entry) with progress tracking and iframe/embed adapter support

---

## Phase 6: Comment Moderation

**Purpose**: Implement moderation tools for the discussion system.

- [x] T020 Create `CommentModerationComponent` in `src/app/admin/pages/comment-moderation/`
- [x] T021 Implement "Hide" and "Delete" actions for individual comments

---

## Phase 7: Polish & Verification

- [ ] T022 Final build verification (`npm run build`)
- [ ] T023 Manual E2E walkthrough of all Admin scenarios
