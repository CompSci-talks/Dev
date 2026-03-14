# Tasks: Supabase Integration

**Input**: Design documents from `/specs/009-supabase-integration/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Supabase project via CLI per `quickstart.md`
- [x] T002 Configure environment credentials in `src/environments/environment.ts`
- [x] T003 Create `.specify/` metadata and initial spec documents

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure and Service Adapters

- [x] T004 [P] Create initial SQL migration in `supabase/migrations/20260314000000_initial_schema.sql`
- [x] T005 [P] Implement `SupabaseSpeakerService` in `src/app/supabase-adapters/supabase-speaker.service.ts`
- [x] T006 [P] Implement `SupabaseTagService` in `src/app/supabase-adapters/supabase-tag.service.ts`
- [x] T007 Implement `getAttendees` in `src/app/supabase-adapters/supabase-seminar.service.ts`
- [x] T008 Update service providers in `src/app/app.config.ts`
- [x] T009 Execute database migration using `npx supabase db push`
- [x] T024 Document the format/mapping for external Material IDs (e.g., Google Drive IDs) to satisfy Principle VI

**Checkpoint**: Foundation ready - Adapters implemented, schema configured, and external asset mapping defined.

---

## Phase 3: User Story 1 - Data Persistence (Priority: P1) 🎯 MVP

**Goal**: Ensure comments, RSVPs, and profiles are persisted in Supabase.

**Independent Test**: Submit a comment as a logged-in user, refresh, and verify it remains visible and exists in the DB.

### Implementation for User Story 1

- [x] T010 [US1] Create test users and verify `auth.users` -> `public.users` sync via trigger
- [ ] T011 [US1] Verify comment submission persistence in `comments` table
- [ ] T012 [US1] Verify RSVP status persistence in `rsvps` table
- [ ] T013 [P] [US1] Fix any RxJS reactivity issues in comment/rsvp flows when using real API

**Checkpoint**: User Story 1 fully functional on production backend.

---

## Phase 4: User Story 2 - Real Authentication (Priority: P1)

**Goal**: Secure account management via Supabase Auth.

**Independent Test**: Sign up a new user, log out, log in, and verify the session persists across tabs.

### Implementation for User Story 2

- [ ] T014 [US2] Verify signup/login flow with real Supabase Auth provider
- [ ] T015 [US2] Verify session persistence and guard behavior in `src/app/core/guards/`
- [ ] T016 [US2] Verify user profile metadata loading from `public.users` table

---

## Phase 5: User Story 3 - Admin Data Management (Priority: P2)

**Goal**: Manage seminars, semesters, speakers, and tags via Admin Dashboard.

**Independent Test**: Create a new Seminar in Admin UI and verify its appearance in the Portal UI.

### Implementation for User Story 3

- [x] T017 [US3] Verify semester CRUD and activation (using `set_active_semester` RPC)
- [x] T018 [US3] Verify seminar CRUD operations (including material IDs)
- [ ] T019 [P] [US3] Verify speaker and tag management in Admin UI

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Production readiness and cleanup

- [ ] T020 [P] Implement production-ready `EmailService` (FR-006)
- [ ] T021 [P] Optimize data fetching (add indexes if needed based on query performance)
- [ ] T022 Clean up all "Mock" references in production injection tokens
- [ ] T023 Run final verification walkthrough and document in `walkthrough.md`
- [ ] T025 Verify system behavior during network disconnection (Network Reliability edge case)
- [ ] T026 Verify session recovery and redirect logic upon Auth expiry (Authentication Expiry edge case)

---

## Dependencies & Execution Order

- **Phase 3-5** can run in parallel once **T009 (Migration)** is complete.
- **T020 (Email)** is prioritized for the final polish phase but could start earlier if provider is chosen.

### Parallel Opportunities
- T010-T012 can be verified in parallel.
- Admin management tasks (T017-T019) are independent.
