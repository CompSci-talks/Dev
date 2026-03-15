# Tasks: Firebase Backend Migration

**Input**: Design documents from `/specs/017-firebase-backend-migration/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Tests are explicitly requested to be documented in `verification_log.md` [SC-005]. Manual browser verification is also required.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create `src/app/firebase-adapters/` directory for Firebase implementations
- [x] T002 Verify `@angular/fire` and `firebase` are present in `package.json`
- [x] T003 Configure Firebase environment credentials in `src/environments/environment.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T004 Implement `FirebaseInitialized$` logic in `src/app/firebase-adapters/firebase-auth.service.ts`
- [x] T005 [P] Setup AngularFire providers in `src/app/app.config.ts` using `provideFirebaseApp`, `provideFirestore`, and `provideAuth`
- [x] T006 Initialize Firebase Auth listeners in `src/app/firebase-adapters/firebase-auth.service.ts` to track session state
- [x] T007 Configure Firebase Auth persistence to `LOCAL` in `FirebaseAuthService`
- [x] T008 Setup initial Firestore collection references in adapters satisfies Adapter Pattern

**Checkpoint**: Foundation ready - Firebase core services are bootstrapped and session persistence is configured.

---

## Phase 3: User Story 1 - Unified Authentication (Priority: P1) 🎯 MVP

**Goal**: Secure login/logout via Firebase Authentication (Email/Password).

**Independent Test**: Successfully authenticate with Firebase credentials on the Login page and verify redirect to Dashboard.

### Implementation for User Story 1

- [x] T009 [P] [US1] Map `IAuthService` to `src/app/firebase-adapters/firebase-auth.service.ts`
- [x] T010 [US1] Implement `login`, `logout`, and `register` methods in `src/app/firebase-adapters/firebase-auth.service.ts`
- [x] T011 [US1] Update `src/app/app.config.ts` to provide `FirebaseAuthService` for the `AUTH_SERVICE` token
- [x] T012 [US1] Verify `auth.guard.ts` correctly waits for the new `FirebaseInitialized$` stream

**Checkpoint**: User Story 1 (Authentication) fully functional and testable.

---

## Phase 4: User Story 2 - Seamless Data Browsing (Priority: P1)

**Goal**: Public views (Schedule, Archive) powered by a denormalized Firestore database.

**Independent Test**: Navigate to Archive; verify seminars with embedded tags/speakers load in one query.

### Implementation for User Story 2

- [x] T013 [P] [US2] Implement `FirebaseSpeakerService` in `src/app/firebase-adapters/firebase-speaker.service.ts`
- [x] T014 [P] [US2] Implement `FirebaseTagService` in `src/app/firebase-adapters/firebase-tag.service.ts`
- [x] T015 [P] [US2] Implement `FirebaseSemesterService` in `src/app/firebase-adapters/firebase-semester.service.ts`
- [x] T016 [US2] Implement `FirebaseSeminarService` in `src/app/firebase-adapters/firebase-seminar.service.ts` with denormalized mapping (embedded speakers/tags)
- [x] T017 [US2] Switch data service tokens to Firebase adapters in `src/app/app.config.ts`
- [x] T018 [US2] Add public read permissions to Firestore Security Rules for seminars, speakers, tags, and semesters
- [x] T019 [US2] Resolve circular dependencies in `SeminarDetailComponent` for timely data loading

**Checkpoint**: Public data views are operational on Firebase.

---

## Phase 5: User Story 3 - Interactive Features (Priority: P2)

**Goal**: RSVP and Comments persistence with Firestore and stats tracking.

**Independent Test**: Post a comment; refresh and verify persistence and updated `comment_count`.

### Implementation for User Story 3

- [x] T020 [P] [US3] Implement `FirebaseCommentService` in `src/app/firebase-adapters/firebase-comment.service.ts`
- [x] T021 [P] [US3] Implement `FirebaseRsvpService` in `src/app/firebase-adapters/firebase-rsvp.service.ts`
- [x] T022 [US3] Implement atomic counter updates for `stats` field on Seminar documents in `FirebaseCommentService` and `FirebaseRsvpService`
- [x] T023 [US3] Add composite index for comments query (seminar_id ASC, created_at DESC) in `firestore.indexes.json`
- [x] T024 [US3] Implement threading logic and UI for comment replies (parent_id support)
- [x] T025 [US3] Update `CommentModerationComponent` to use `FirebaseCommentService` for moderation actions

**Checkpoint**: User interactions (RSVP/Comments) are functional and persistent.

---

## Phase 6: User Story 4 - Admin Management (Priority: P1)

**Goal**: Full CRUD for all entities in the Admin Dashboard with cascading updates.

**Independent Test**: Update a Speaker name; verify all associated Seminars reflect the change automatically.

### Implementation for User Story 4

- [x] T026 [US4] Implement Update/Delete operations in `FirebaseSeminarService.ts`
- [x] T027 [US4] Implement CRUD logic in `FirebaseSpeakerService.ts` and `FirebaseTagService.ts`
- [x] T028 [US4] Implement cascading multi-path update logic for metadata sync (Speakers/Tags -> Seminars)
- [x] T029 [US4] Add `thumbnail_url` field to `SeminarFormComponent` in `src/app/admin/pages/seminar-manager/`
- [x] T030 [US4] Implement attendee selection and multi-recipient mailto link generation in Attendance Page

**Checkpoint**: Admin management features are complete.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Cleanup, performance, and final stability audits.

- [x] T031 [P] Implement `MultiSelectComponent` in `src/app/shared/components/` for searchable chip selection
- [x] T032 [P] Refactor `SeminarFormComponent` to use `MultiSelectComponent`
- [x] T033 Wrap Firebase service calls in `runInInjectionContext` to resolve stability warnings (Ref: #1748)
- [x] T034 Cleanup `firestore.indexes.json` (remove comments) to resolve lint errors
- [ ] T035 [P] Performance audit: Verify SC-002 (<2s Archive load) on mobile throttling
- [ ] T036 [P] Execute full E2E test suite: `npm run e2e`
- [ ] T037 [P] Latency audit: Verify Admin CRUD operations complete within 1.5s [SC-003]
- [/] T038 Browser Verification: Test Semester Delete/Edit stability
- [/] T040 Browser Verification: Test Speaker Create/Edit/Delete stability
- [/] T041 Browser Verification: Test Tag Create/Edit/Delete stability
- [/] T042 Browser Verification: Validate Attendee Count accuracy with 3+ users
- [x] T043 Document results in `verification_log.md` [SC-005]

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Phase 1 completion - BLOCKS all User Stories.
- **User Stories (Phase 3+)**: All depend on Phase 2. US1 and US2 can run in parallel.
- **Polish (Final Phase)**: Depends on all user stories being verified.

### Implementation Strategy

- **MVP First**: Complete through Phase 4 (US2).
- **Incremental Delivery**: Phase 5 and 6 enable the remaining interaction and management features.
- **Remediation Loop**: Addressed injection context and indexing issues as T033/T034 in the Polish phase.
