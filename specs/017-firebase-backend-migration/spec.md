# Feature Specification: Firebase Backend Migration

**Feature Branch**: `017-firebase-backend-migration`  
**Created**: 2026-03-15  
**Status**: Draft  
**Input**: User description: "use angularfire. replace the authentication with the authentication of firebase email/password. denormalize the datamodel for firestore. create implementations for all services with crud. replace old services with new ones."

## Clarifications

### Session 2026-03-15
- Q: Should legacy Supabase and Mock implementations be deleted? → A: No. Keep the old implementations intact but unused. Replace their usage in `app.config.ts` with the new Firebase services.
- Q: How should seminar video/presentation materials be handled? → A: Metadata-only. Store URLs/IDs as strings in Firestore; no dedicated Storage adapter required for this phase.
- Q: What is the scope of the User and Admin dashboards? → A: Use existing routes and UI. The Authenticated User Dashboard shows attending seminars (RSVPs). The Admin Dashboard (`/admin`) handles Seminar/Semester management, Comment moderation (show/delete), and Attendee emailing.
- Q: How should attendee emailing be implemented? → A: Client-side Mailto links for now. Provide a service function stub for future server-side implementation.
- Q: Where should manual verification steps be documented? → A: Document every test in a project-root `verification_log.md` file, including status and results.
- Q: What specific admin manager features are needed? → A: List, Create, Edit, and Delete for both Speakers and Tags.
- Q: What comment features are needed? → A: Public posting (US3), public/admin replies (threading), and admin deletion (US4).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Unified Authentication (Priority: P1)

As a user or administrator, I want to sign in and out of the platform using my email and password via Firebase Authentication, so I can access my profile and administrative tools securely.

**Why this priority**: Authentication is the gatekeeper for all interactive and administrative features.

**Independent Test**: Can be fully tested by creating a new account, logging out, and logging back in via the login page.

**Acceptance Scenarios**:

1. **Given** I am on the login page, **When** I enter valid Firebase credentials, **Then** I am authenticated and redirected to the appropriate dashboard (Admin or User).
   - **Verification**: Open `/login`, enter test credentials, verify successful redirect and presence of dashboard-specific links.
2. **Given** I am authenticated, **When** I click "Logout", **Then** my session is terminated in Firebase and I am redirected to the public portal.
   - **Verification**: From dashboard, click Logout; verify redirect to home and inability to re-enter dashboard via URL without login.

---

### User Story 2 - Seamless Data Browsing (Priority: P1)

As a guest or authenticated user, I want to view the seminar schedule and archive, which are now powered by a denormalized Firestore database, without any loss of performance or data visibility compared to the previous backend.

**Why this priority**: Public schedule visibility is the core value proposition for guests.

**Independent Test**: Navigate through the Schedule and Archive pages; verify data loads correctly and filtering (tags, speakers) works as expected.

**Acceptance Scenarios**:

1. **Given** there are active seminars in Firestore, **When** I open the Schedule page, **Then** I see the upcoming seminars with correct metadata.
   - **Verification**: Load `/schedule`, verify seminar titles, speakers, and tags from Firestore appear.
2. **Given** I am on the Archive page, **When** I filter by a specific tag, **Then** only seminars associated with that tag are displayed (leveraging denormalized indices if applicable).
   - **Verification**: Load `/archive`, select a tag filter, verify list updates to only show matching seminars.

---

### User Story 3 - Interactive Features (Priority: P2)

As an authenticated user, I want to RSVP to seminars and post comments, with all interactions persisting in Firestore, ensuring my engagements are saved and visible.

**Why this priority**: Engagement features drive community interaction.

**Independent Test**: Post a comment on a seminar; refresh the page and verify the comment persists. Perform an RSVP and verify the "Attending" status is updated.

**Acceptance Scenarios**:

1. **Given** I am on a seminar details page, **When** I post a comment, **Then** the comment is stored in Firestore and appears in the list immediately.
   - **Verification**: Navigate to a seminar, post "Test Comment", verify it appears and is also visible in Firebase Console `comments` collection.
2. **Given** a comment exists, **When** I click "Reply", **Then** my response is nested within the parent comment and saved to Firestore.
   - **Verification**: From seminar page, click Reply on a comment. Verify the new comment has the correct `parent_id`.
3. **Given** I am viewing a seminar, **When** I click RSVP, **Then** my attendee status is updated in the Firestore RSVP collection.
   - **Verification**: Click "Attending" on a seminar, verify icon change and record presence in Firebase Console `rsvps` collection.

---

### User Story 4 - Admin Management (Priority: P1)

As an administrator, I want to manage semesters, seminars, speakers, and tags through the Admin Dashboard, as well as moderate comments and send emails to attendees, with all CRUD operations reflected in Firestore.

**Why this priority**: Administrative efficiency is critical for maintaining the platform.

**Independent Test**: Create a new Seminar in the Admin Dashboard; verify it appears in the public Schedule and in the Firestore console.

**Acceptance Scenarios**:

1. **Given** I am in the Admin Dashboard, **When** I create or edit a semester, **Then** it is saved to Firestore.
   - **Verification**: Admin -> Semesters. Test both Create and Edit flows.
2. **Given** I am in the Admin Dashboard, **When** I create or edit a speaker or tag, **Then** it is saved to Firestore and reflected globally.
   - **Verification**: Admin -> Speakers/Tags. Test both Create and Edit flows. Verify names update on seminars.
3. **Given** I am editing a seminar, **When** I update its speaker, **Then** the change is reflected in all denormalized views (e.g., speaker's seminar list).
   - **Verification**: Admin -> Seminars -> Edit. Change speaker. Verify the Seminar document in Firestore has the updated embedded speaker name.
4. **Given** I am on the Admin Comment Moderation page, **When** I delete a comment, **Then** it is removed from Firestore and the seminar's `comment_count` is decremented.
   - **Verification**: Admin -> Comments. Delete a comment. Verify `comment_count` on the related Seminar document in Firestore.
5. **Given** I am viewing a seminar's attendees in the dashboard, **When** I click "Send Email", **Then** the system triggers the client-side mail client flow via mailto for the selected attendees.
   - **Verification**: Admin -> Seminar -> Attendees -> Send Email. Verify mailto link contains attendee emails.

---

### Edge Cases

- **Offline Mode**: If the user loses connectivity, should Firestore's offline persistence allow them to continue browsing? (Assumption: Yes, leveraging AngularFire's default persistence).
- **Concurrency**: How does the system handle two admins editing the same seminar? (Assumption: Last-write-wins is acceptable for MVP).
- **Broken Auth State**: How does the system handle an invalid Firebase session? (Requirement: System MUST maintain session persistence on refresh and handle invalid sessions by redirection).
- **Session Stability**: Ensure frequent log-outs do not occur during active navigation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST authenticate users using Firebase Authentication (Email/Password).
- **FR-002**: System MUST use AngularFire (v19/21 compatible) for all backend interactions.
- **FR-003**: System MUST provide ISeminarService implementation using Firestore.
- **FR-004**: System MUST provide IAuthService implementation using Firebase Auth.
- **FR-005**: System MUST implement denormalized data structures in Firestore to optimize for read-heavy seminar queries.
- **FR-006**: System MUST ensure that adding a related entity (e.g., adding a seminar to a speaker) updates all redundant/denormalized records.
- **FR-007**: System MUST replace the *usage* of all `Supabase*Service` and `Mock*Service` providers in `app.config.ts` with their Firebase equivalents, while preserving the legacy source files.
- **FR-008**: System MUST store seminar video and presentation references as simple string metadata (URLs/IDs) in Firestore.

### Key Entities

- **User**: Authenticated profile in Firebase Auth + metadata in Firestore `users`.
- **Seminar**: Core record in `seminars`, potentially denormalized with speaker names and tag titles for fast listing.
- **Semester**: Grouping entity in `semesters`.
- **RSVP**: Interaction record in `rsvps`, linking User and Seminar.
- **Comment**: Interaction record in `comments`, child of Seminar.
- **Speaker**: Profile record in `speakers`.
- **Tag**: Taxonomy record in `tags`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Transition to Firebase is transparent to the user; 100% feature parity with the previous implementation.
- **SC-002**: Data retrieval for the Archive page (initial load) takes less than 2 seconds over a standard 4G connection.
- **SC-003**: All CRUD operations in the Admin Dashboard complete within 1.5 seconds (excluding file uploads).
- **SC-004**: No `Supabase` or `Mock` service is *provided* or *used* at runtime in the migration branch.
- **SC-005**: 100% of tested components and flows are documented in `verification_log.md` with passing results.
