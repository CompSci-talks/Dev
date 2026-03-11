# Tasks: Phase 1 — Attendees Portal

**Input**: Design documents from `/specs/001-attendees-portal/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The platform relies on manual testing combined with interface-first mock injection for Phase 1. No automated unit/e2e tests are requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Angular 19 project `compsci-talks` with routing and SCSS in `.`
- [x] T002 Configure environment variables structure in `src/environments/`
- [x] T003 Configure application layout and base Tailwind styles with semantic palette in `src/styles.scss`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented
**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Copy interface definitions to `src/app/core/contracts/`
- [x] T005 [P] Implement core generic data models (User, Seminar, Speaker, Tag, Question, RSVP) in `src/app/core/models/`
- [x] T006 [P] Implement Supabase client initialization in `src/app/core/supabase.service.ts`
- [x] T007 Initialize feature modules / standalone app routes in `src/app/app.routes.ts` (portal, auth, seminar-room, dashboard)
- [x] T008 Provide mock service configuration explicitly for local development in `src/app/app.config.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Guest Browsing the Public Portal (Priority: P1) 🎯 MVP

**Goal**: Allow unauthenticated visitors to browse upcoming seminars and search past talks by Tag/Speaker.
**Independent Test**: Load the root URL while logged out. Verify upcoming seminars list displays with Live Badges (if applicable). Click "Previous Talks" and verify the archive list. Click a tag/speaker and verify routing to the Search Page with filtered results. Clicking a seminar detail should work, but materials should be hidden behind login.

### Implementation for User Story 1

- [ ] T009 [P] [US1] Create mock implementation for `ISeminarService` in `src/app/core/services/mock-seminar.service.ts`
- [ ] T010 [P] [US1] Create Supabase implementation for `ISeminarService` in `src/app/supabase-adapters/supabase-seminar.service.ts`
- [ ] T011 [P] [US1] Create Presentational Seminar Card component in `src/app/portal/components/seminar-card/`
- [ ] T012 [P] [US1] Create Date/Status Utility pipe (Live Now badge logic) in `src/app/core/pipes/seminar-status.pipe.ts`
- [ ] T013 [US1] Create Public Home Page (Schedule) Smart component in `src/app/portal/pages/home/`
- [ ] T014 [US1] Create Search/Archive Page Smart component in `src/app/portal/pages/archive/`
- [ ] T015 [US1] Create Public Seminar Detail view component in `src/app/portal/pages/seminar-detail/` (hiding materials layer)

**Checkpoint**: User Story 1 functional. Visitors can browse empty/mocked schedules and details.

---

## Phase 4: User Story 2 - User Authentication (Priority: P1)

**Goal**: Allow users to register, log in, and be protected by Route Guards.
**Independent Test**: Register a new user. Log in. Check route guards trigger login redirects for protected pages.

### Implementation for User Story 2

- [ ] T016 [P] [US2] Create mock implementation for `IAuthService` in `src/app/core/services/mock-auth.service.ts`
- [ ] T017 [P] [US2] Create Supabase implementation for `IAuthService` in `src/app/supabase-adapters/supabase-auth.service.ts`
- [ ] T018 [P] [US2] Implement Auth Route Guard in `src/app/core/guards/auth.guard.ts`
- [ ] T019 [US2] Create Login Page component in `src/app/auth/pages/login/`
- [ ] T020 [US2] Create Register Page component in `src/app/auth/pages/register/`
- [ ] T021 [US2] Create global navigation header displaying Login/Logout state in `src/app/core/components/header/`

**Checkpoint**: Authentication flows work. Protected routes block guests.

---

## Phase 5: User Story 3 - Accessing Seminar Materials (Priority: P1)

**Goal**: Authenticated users can view embedded videos and presentation slides for past seminars without direct download links.
**Independent Test**: Log in, visit a past seminar detail page. Verify YouTube/Drive iframe shows video/slides. Verify no direct download anchor tags exist.

### Implementation for User Story 3

- [ ] T022 [P] [US3] Create Safe IFrame Pipe in `src/app/core/pipes/safe-url.pipe.ts`
- [ ] T023 [US3] Create Video Player presentation component in `src/app/seminar-room/components/video-player/`
- [ ] T024 [US3] Create Slide Viewer presentation component in `src/app/seminar-room/components/slide-viewer/`
- [ ] T025 [US3] Update Seminar Detail Smart component `src/app/portal/pages/seminar-detail/` to lazy load `seminar-room` materials if user is authenticated.

**Checkpoint**: Locked video/slides become viewable when logged in.

---

## Phase 6: User Story 4 - RSVP / Mark as Attending (Priority: P2)

**Goal**: Authenticated users can RSVP to upcoming seminars and get an Add To Calendar link.
**Independent Test**: Log in, view upcoming seminar, click RSVP. Button changes state. Add to Calendar link appears.

### Implementation for User Story 4

- [ ] T026 [P] [US4] Create mock implementation for `IRsvpService` in `src/app/core/services/mock-rsvp.service.ts`
- [ ] T027 [P] [US4] Create Supabase implementation for `IRsvpService` in `src/app/supabase-adapters/supabase-rsvp.service.ts`
- [ ] T028 [US4] Create Calendar Link generation utility in `src/app/core/utils/calendar.util.ts`
- [ ] T029 [US4] Create RSVP Button presentation component in `src/app/portal/components/rsvp-button/`
- [ ] T030 [US4] Integrate RSVP button into Seminar Detail page `src/app/portal/pages/seminar-detail/`

**Checkpoint**: RSVP system processes database insertions and emits ICS links.

---

## Phase 7: User Story 5 - Seminar Q&A (Priority: P2)

**Goal**: Authenticated users can view previously asked questions and submit new ones on the seminar detail page.
**Independent Test**: Log in, visit seminar, submit text. It appears in the flat list immediately. Log out, visit seminar, list is visible but submit box is hidden.

### Implementation for User Story 5

- [ ] T031 [P] [US5] Create mock implementation for `IQaService` in `src/app/core/services/mock-qa.service.ts`
- [ ] T032 [P] [US5] Create Supabase implementation for `IQaService` in `src/app/supabase-adapters/supabase-qa.service.ts`
- [ ] T033 [US5] Create Q&A List presentation component in `src/app/seminar-room/components/qa-list/`
- [ ] T034 [US5] Create Q&A Submit Form component in `src/app/seminar-room/components/qa-form/`
- [ ] T035 [US5] Integrate Q&A smart container into Seminar Detail page `src/app/portal/pages/seminar-detail/`

**Checkpoint**: Real-time Q&A stream is active.

---

## Phase 8: User Story 6 - Personal Dashboard (Priority: P3)

**Goal**: Authenticated users see a dedicated page listing their upcoming RSVPs.
**Independent Test**: Log in, click "My RSVPs" in header. Verify list matches selected RSVPs. Verify empty state if none chosen.

### Implementation for User Story 6

- [ ] T036 [US6] Create Dashboard Smart component in `src/app/dashboard/pages/dashboard/`
- [ ] T037 [US6] Update navigation header to include Dashboard link if authenticated.

**Checkpoint**: Personal tracking is functional. All user stories complete!

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: UI enhancements and error state coverage.

- [ ] T038 Handle global RxJS error interceptions / Toast Notifications in `src/app/core/services/toast.service.ts`
- [ ] T039 Apply loading skeleton states across all Smart components
- [ ] T040 Verify "Anti-Download" restriction on Google Drive iframe logic

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1. BLOCKS all user stories.
- **User Stories (Phase 3-8)**: Depend on Phase 2. Can technically be built in parallel (US1, US2), but integrating auth (US2) into materials (US3) forces a natural sequence where US2 should finish before US3, US4, US5, US6. 

### Parallel Opportunities
- All [P] Mock and Adapter implementations can be coded by different developers simultaneously before UI work begins.
- Presentation (dumb) components (e.g., T011, T023, T024, T029) can be built in parallel with their corresponding Services.

## Implementation Strategy
- **MVP Fast Track**: Execute Phase 1, 2, 3, and 4. This provides the core value of Guest Schedules + User Logins. Stop and manually test everything before proceeding to Materials, RSVPs, and Q&A.
