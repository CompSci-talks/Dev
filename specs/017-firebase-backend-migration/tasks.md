# Tasks: Firebase Backend Migration

**Input**: Design documents from `/specs/017-firebase-backend-migration/`
**Prerequisites**: plan.md, spec.md, data-model.md, research.md, quickstart.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure.

- [x] T001 Create `src/app/firebase-adapters/` directory for Firebase implementations
- [x] T002 [P] Verify `@angular/fire` and `firebase` are present in `package.json`
- [x] T003 Verify Firebase environment credentials in `src/environments/environment.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

- [x] T004 Implement `FirebaseInitialized$` logic in `src/app/firebase-adapters/firebase-auth.service.ts` to mirror current initialization flow
- [x] T005 [P] Setup AngularFire providers in `src/app/app.config.ts` using `provideFirebaseApp`, `provideFirestore`, and `provideAuth`
- [x] T006 Initialize Firebase Auth listeners in `src/app/firebase-adapters/firebase-auth.service.ts` to track session state
- [x] T006b Configure Firebase Auth persistence to `LOCAL` to prevent frequent logouts on refresh

**Checkpoint**: Foundation ready - Firebase core services are bootstrapped and session persistence is configured.

---

## Phase 3: User Story 1 - Unified Authentication (Priority: P1) 🎯 MVP

**Goal**: Secure login/logout via Firebase Authentication (Email/Password).

**Independent Test**: Successfully authenticate with Firebase credentials on the Login page and verify redirect to Dashboard.

### Implementation for User Story 1

- [x] T007 [P] [US1] Map `IAuthService` to `src/app/firebase-adapters/firebase-auth.service.ts`
- [x] T008 [US1] Implement `login`, `logout`, and `register` methods in `src/app/firebase-adapters/firebase-auth.service.ts`
- [x] T009 [US1] Update `src/app/app.config.ts` to provide `FirebaseAuthService` for the `AUTH_SERVICE` token
- [x] T010 [US1] Verify `auth.guard.ts` correctly waits for the new `FirebaseInitialized$` stream

---

## Phase 4: User Story 2 - Seamless Data Browsing (Priority: P1)

**Goal**: Public views (Schedule, Archive) powered by a denormalized Firestore database.

**Independent Test**: Navigate to Archive; verify seminars with embedded tags/speakers load in one query.

### Implementation for User Story 2

- [x] T011 [P] [US2] Implement `FirebaseSpeakerService` in `src/app/firebase-adapters/firebase-speaker.service.ts`
- [x] T012 [P] [US2] Implement `FirebaseTagService` in `src/app/firebase-adapters/firebase-tag.service.ts`
- [x] T013 [P] [US2] Implement `FirebaseSemesterService` in `src/app/firebase-adapters/firebase-semester.service.ts`
- [x] T014 [US2] Implement `FirebaseSeminarService` in `src/app/firebase-adapters/firebase-seminar.service.ts` with denormalized mapping logic (including video/presentation metadata)
- [x] T015 [US2] Update `src/app/app.config.ts` to switch all data service tokens to Firebase adapters

---

## Phase 5: User Story 3 - Interactive Features (Priority: P2)

**Goal**: RSVP and Comments persistence with Firestore.

**Independent Test**: Post a comment; refresh and verify persistence and updated `comment_count`.

### Implementation for User Story 3

- [x] T016 [P] [US3] Implement `FirebaseCommentService` in `src/app/firebase-adapters/firebase-comment.service.ts`
- [x] T017 [P] [US3] Implement `FirebaseRsvpService` in `src/app/firebase-adapters/firebase-rsvp.service.ts`
- [x] T018 [US3] Implement atomic counter updates for `stats` field on Seminar documents in `FirebaseCommentService` and `FirebaseRsvpService`
- [x] T019 Update `src/app/app.config.ts` to provide `FirebaseCommentService` and `FirebaseRsvpService` for the respective tokens
- [x] T019b Implement threading logic and UI for comment replies (parent_id support)
- [x] T019c Update `CommentModerationComponent` UI to use `FirebaseCommentService` for Delete/Hide actions

---

## Phase 6: User Story 4 - Admin Management (Priority: P1)

**Goal**: Full CRUD for all entities in the Admin Dashboard with cascading updates.

**Independent Test**: Update a Speaker name; verify all associated Seminars reflect the change automatically.

### Implementation for User Story 4

- [x] T020 [US4] Implement Update/Delete operations in `FirebaseSeminarService.ts`
- [x] T021 [US4] Implement Edit Form and Update logic in `FirebaseSpeakerService.ts`
- [x] T022 [US4] Implement Edit Form and Update logic in `FirebaseTagService.ts`
- [x] T023 [US4] Implement client-side multi-path update logic for denormalized records (Speakers/Tags)
- [x] T024 [US4] Implement attendee emailing functionality (mailto logic) on Attendance Page
- [x] T024b [US4] Implement attendee selection and multi-recipient mailto link generation

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Cleanup and final validation.

- [x] T025 Performance audit: Verify SC-002 (<2s Archive load) on mobile throttling
- [x] T025b Offline Verification: Test application functionality and data visibility while browser is offline
- [x] T026 Execute full E2E test suite: `npm run e2e`
- [x] T027 Initialize and document `verification_log.md` with results of all manual and automated tests
- [x] T028 Implement `MultiSelectComponent` in `src/app/shared/components/` for searchable chip selection
- [x] T029 Refactor `SeminarFormComponent` to use `MultiSelectComponent` for Speakers and Tags
- [ ] T030 Perform comprehensive browser-based verification of the entire application flow

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 completion - BLOCKS all User Stories.
- **User Stories (Phase 3+)**: Depend on Foundational completion. US1 and US2 can run in parallel.
- **Polish (Final Phase)**: Depends on all user stories being verified.

### Implementation Strategy

- **MVP First**: Complete through Phase 4 (US2). This delivers a functioning public portal with Auth.
- **Incremental Delivery**: Phase 5 and 6 enable the remaining interaction and management features.
