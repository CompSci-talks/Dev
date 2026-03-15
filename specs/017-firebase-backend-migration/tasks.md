# Tasks: Firebase Backend Migration

**Input**: Design documents from `/specs/017-firebase-backend-migration/`
**Prerequisites**: plan.md, spec.md, data-model.md, research.md, quickstart.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure.

- [ ] T001 Create `src/app/firebase-adapters/` directory for Firebase implementations
- [ ] T002 [P] Verify `@angular/fire` and `firebase` are present in `package.json`
- [ ] T003 Verify Firebase environment credentials in `src/environments/environment.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

- [ ] T004 Implement `FirebaseInitialized$` logic in `src/app/firebase-adapters/firebase-auth.service.ts` to mirror current initialization flow
- [ ] T005 [P] Setup AngularFire providers in `src/app/app.config.ts` using `provideFirebaseApp`, `provideFirestore`, and `provideAuth`
- [ ] T006 Initialize Firebase Auth listeners in `src/app/firebase-adapters/firebase-auth.service.ts` to track session state

**Checkpoint**: Foundation ready - Firebase core services are bootstrapped.

---

## Phase 3: User Story 1 - Unified Authentication (Priority: P1) 🎯 MVP

**Goal**: Secure login/logout via Firebase Authentication (Email/Password).

**Independent Test**: Successfully authenticate with Firebase credentials on the Login page and verify redirect to Dashboard.

### Implementation for User Story 1

- [ ] T007 [P] [US1] Map `IAuthService` to `src/app/firebase-adapters/firebase-auth.service.ts`
- [ ] T008 [US1] Implement `login`, `logout`, and `register` methods in `src/app/firebase-adapters/firebase-auth.service.ts`
- [ ] T009 [US1] Update `src/app/app.config.ts` to provide `FirebaseAuthService` for the `AUTH_SERVICE` token
- [ ] T010 [US1] Verify `auth.guard.ts` correctly waits for the new `FirebaseInitialized$` stream

---

## Phase 4: User Story 2 - Seamless Data Browsing (Priority: P1)

**Goal**: Public views (Schedule, Archive) powered by a denormalized Firestore database.

**Independent Test**: Navigate to Archive; verify seminars with embedded tags/speakers load in one query.

### Implementation for User Story 2

- [ ] T011 [P] [US2] Implement `FirebaseSpeakerService` in `src/app/firebase-adapters/firebase-speaker.service.ts`
- [ ] T012 [P] [US2] Implement `FirebaseTagService` in `src/app/firebase-adapters/firebase-tag.service.ts`
- [ ] T013 [P] [US2] Implement `FirebaseSemesterService` in `src/app/firebase-adapters/firebase-semester.service.ts`
- [ ] T014 [US2] Implement `FirebaseSeminarService` in `src/app/firebase-adapters/firebase-seminar.service.ts` with denormalized mapping logic (including video/presentation metadata)
- [ ] T015 [US2] Update `src/app/app.config.ts` to switch all data service tokens to Firebase adapters

---

## Phase 5: User Story 3 - Interactive Features (Priority: P2)

**Goal**: RSVP and Comments persistence with Firestore.

**Independent Test**: Post a comment; refresh and verify persistence and updated `comment_count`.

### Implementation for User Story 3

- [ ] T016 [P] [US3] Implement `FirebaseCommentService` in `src/app/firebase-adapters/firebase-comment.service.ts`
- [ ] T017 [P] [US3] Implement `FirebaseRsvpService` in `src/app/firebase-adapters/firebase-rsvp.service.ts`
- [ ] T018 [US3] Implement atomic counter updates for `stats` field on Seminar documents in `FirebaseCommentService` and `FirebaseRsvpService`
- [ ] T019 [US3] Update `src/app/app.config.ts` to provide `FirebaseCommentService` and `FirebaseRsvpService` for the respective tokens

---

## Phase 6: User Story 4 - Admin Management (Priority: P1)

**Goal**: Full CRUD for all entities in the Admin Dashboard with cascading updates.

**Independent Test**: Update a Speaker name; verify all associated Seminars reflect the change automatically.

### Implementation for User Story 4

- [ ] T020 [US4] Implement Create/Update/Delete operations in `FirebaseSeminarService.ts`
- [ ] T021 [US4] Implement Create/Update/Delete operations in `FirebaseSpeakerService.ts`
- [ ] T022 [US4] Implement Create/Update/Delete operations in `FirebaseTagService.ts`
- [ ] T023 [US4] Implement client-side multi-path update logic for denormalized records (Speakers/Tags) in the respective services
- [ ] T024 [US4] Implement attendee emailing function stub in `FirebaseSeminarService.ts` (mailto logic)

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Cleanup and final validation.

- [ ] T025 Performance audit: Verify SC-002 (<2s Archive load) on mobile throttling
- [ ] T026 Execute full E2E test suite: `npm run e2e`

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
