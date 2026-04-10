# Tasks: Contact Us Page

**Input**: Design documents from `/specs/027-contact-us-page/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure. 
*(No tasks required as project already exists)*

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

*(No blocking setup required outside of the User Story 1 foundation)*

---

## Phase 3: User Story 1 - Guest Submits Feedback (Priority: P1) 🎯 MVP

**Goal**: Allow any unauthenticated visitor to navigate to `/contact`, fill a reactive form, and submit a message stored into Firestore, viewing a success state inline to submit another. 

**Independent Test**: Navigate to `/contact` in an incognito window. Fill in all fields, trigger validators, submit successfully, see the "Send another message" thank-you view, and check Firestore to ensure the document was saved.

### Implementation for User Story 1

- [x] T001 [P] [US1] Copy the interface and data models into `src/app/core/contracts/contact-submission.interface.ts` (from `specs/027-contact-us-page/contracts/`).
- [x] T002 [US1] Create the concrete Firebase adapter at `src/app/firebase-adapters/firebase-contact-submission.service.ts` implementing `IContactSubmissionService`. Ensure the adapter explicitly injects the missing defaults into the payload before `addDoc` (`createdAt`, `status = 'new'`, `isDeleted = false`).
- [x] T003 [US1] Register the `IContactSubmissionService` injection token mapped to `FirebaseContactSubmissionService` (likely in `src/app/app.config.ts` or feature provider array).
- [x] T004 [P] [US1] Generate a standalone Angular component for the page at `src/app/contact/contact.component.ts`.
- [x] T005 [P] [US1] Register the `/contact` route in `src/app/app.routes.ts`.
- [x] T006 [P] [US1] Add the "Contact Us" link to the global footer component (`src/app/core/components/footer/...`).
- [x] T007 [US1] Implement the Angular Reactive Form in `contact.component.ts` equipped with synchronous validators (required, email, minLength 20, maxLength 1000).
- [x] T008 [US1] Construct the UI in `contact.component.html` using existing glassmorphism Tailwind classes (`.input-field`, `.btn .btn-primary`). Implement character count hard stop UX and explicitly render inline validation error messages for invalid fields.
- [x] T009 [US1] Wire form `ngSubmit` to `IContactSubmissionService.submitContactMessage`, managing `isLoading` and inline `isSuccess` states with the "Send another message" reset toggle.

**Checkpoint**: At this point, User Story 1 (the core functionality) should be fully functional and testable independently by a guest user.

---

## Phase 4: User Story 2 - Authenticated User Gets Pre-filled Form (Priority: P2)

**Goal**: Reduce friction for logged-in users by automatically populating their recognized name and email address into the form.

**Independent Test**: Log in with an existing account via the Auth flow. Navigate to `/contact`. Observe the Name and Email fields are pre-filled and the submission captures the `submitterUid`. 

### Implementation for User Story 2

- [x] T010 [US2] Inject the application's auth interface/service into `contact.component.ts`.
- [x] T011 [US2] Update `ngOnInit` to observe the global authentication state. When authenticated, pre-fill `name` and `email` reactive form controls.
- [x] T012 [US2] Update the component's submit method to map the current user's UID to the `submitterUid` field of the submission payload.
- [x] T013 [US2] Ensure the "Send another message" reset logic properly restores the pre-filled values rather than wiping them empty.

**Checkpoint**: Both Guest and Authenticated submission flows operate correctly. Forms reset appropriately depending on authentication context.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T014 Run Angular linting/formatting rules across the modified `src/app/` files.
- [x] T015 Verify visual responsiveness of the `/contact` component on standard mobile viewport widths.
- [x] T016 Verify Keyboard navigation and basic WAI-ARIA accessibility (FR-011).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Starts immediately.
- **User Stories (Phase 3+)**: US1 is the main focus, US2 follows incrementally.
- **Polish (Final Phase)**: Runs after integration is complete.

### Shared Parallel Opportunities

- Creating the UI component framework UI (T004) and Routing (T005, T006) can execute at the same time as Data Layer logic construction (T001, T002, T003).

### Implementation Strategy

- Execute User Story 1 fully first. Test that the Firestore interaction and success toggling work smoothly for guest users.
- Increment with User Story 2 next. Add authentication injection carefully adhering to Clean Architecture principles.
