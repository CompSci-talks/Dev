# Tasks: Refactoring Q&A to Comments

**Input**: Design documents from `/specs/003-refactor-qa-to-comments/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Rename `question.model.ts` to `comment.model.ts` in `src/app/core/models/` and export `Comment` interface
- [x] T002 Rename `mock-qa.service.ts` to `mock-comment.service.ts` in `src/app/core/services/` and update class name to `MockCommentService`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Update `comment.model.ts` to match the data model (removing Q&A specific fields like upvotes or isAnswered)
- [x] T004 Update `mock-comment.service.ts` to rename methods (`getQuestionsForSeminar` -> `getCommentsForSeminar`, `addQuestion` -> `addComment`) and replace mock data keys

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Viewing Seminar Comments (Priority: P1) 🎯 MVP

**Goal**: As an attendee or visitor, I want to read comments left by other users on a seminar so that I can see the community's thoughts and reactions to the talk.

**Independent Test**: Navigate to a seminar detail page and verify that existing comments are visible below the seminar details, replacing the old Q&A section terminology with "Comments".

### Implementation for User Story 1

- [x] T005 Rename directory `src/app/seminar-room/components/qa-container` to `comments-container`
- [x] T006 [US1] Rename and refactor `qa-container.component.ts` to `CommentsContainerComponent` in `src/app/seminar-room/components/comments-container/`
- [x] T007 [US1] Update `comments-container.component.html` and `.scss` to rename references from "Q&A" to "Comments"
- [x] T008 Rename directory `src/app/seminar-room/components/qa-list` to `comment-list`
- [x] T009 [US1] Rename and refactor `qa-list.component.ts` to `CommentListComponent` in `src/app/seminar-room/components/comment-list/`
- [x] T010 [US1] Update `comment-list.component.html` and `.scss` to map over `comments` and remove any upvote/answer specific styling
- [x] T011 [US1] Update `seminar-detail.component.ts` in `src/app/portal/pages/seminar-detail/` to import and declare `CommentsContainerComponent` instead of `QaContainerComponent`
- [x] T012 [US1] Update `seminar-detail.component.html` in `src/app/portal/pages/seminar-detail/` to use `<app-comments-container>`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. The old Q&A list should now function as a read-only Comments list.

---

## Phase 4: User Story 2 - Submitting a Comment (Priority: P1)

**Goal**: As an authenticated user, I want to leave a comment on a seminar so that I can share my thoughts, thank the speaker, or discuss the topic with others.

**Independent Test**: Log in, navigate to a seminar, type a comment, and submit it. Verify it appears in the list immediately and validation prevents empty submissions.

### Implementation for User Story 2

- [x] T013 Rename directory `src/app/seminar-room/components/qa-form` to `comment-form`
- [x] T014 [US2] Rename and refactor `qa-form.component.ts` to `CommentFormComponent` in `src/app/seminar-room/components/comment-form/`
- [x] T015 [US2] Update `comment-form.component.html` to reflect the comment submission UI
- [x] T016 [US2] Implement form validation in `CommentFormComponent` to prevent empty submissions (FR-005)
- [x] T017 [US2] Implement Guest Logic functionality (FR-004) in `CommentFormComponent` to check authentication state and display a "Log in to comment" prompt if unauthenticated
- [x] T018 [US2] Integrate `CommentFormComponent` into `CommentsContainerComponent`'s HTML to wire up the submission event

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Users can now post and view comments.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T019 Run local server (`npm start`) and verify UI layout rendering
- [x] T020 Capture end-to-end browser recording testing User Story 1 (Guest viewing comments feed and login prompt)
- [x] T021 Capture end-to-end browser recording testing User Story 2 (Authenticated user submitting comments and validation)
- [x] T022 Document testing results and implementation details in `walkthrough.md`

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - Phase 3 (US1 - Viewing) provides the base components necessary to embed Phase 4 (US2 - Submitting). They should ideally be implemented sequentially.
- **Polish (Final Phase)**: Depends on all desired user stories being complete
