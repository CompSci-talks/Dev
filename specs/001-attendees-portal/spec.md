# Feature Specification: Phase 1 — Attendees Portal

**Feature Branch**: `001-attendees-portal`  
**Created**: 2026-03-11  
**Status**: Draft  
**Input**: User description: "A website that hosts seminars and its videos and PPTs, requiring authentication to access the materials. Phase 1 covers guest browsing, authenticated access, RSVP, and Q&A."

---

## User Scenarios & Testing

### User Story 1 — Guest Browsing the Public Portal (Priority: P1)

As an unauthenticated visitor, I want to browse the upcoming seminar schedule and see a list of previous talks so I can learn what the community offers before creating an account.

**Why this priority**: This is the entry point for every user. Without a public-facing schedule, there is no discoverability and no reason for anyone to sign up. It is the foundation of the entire platform.

**Independent Test**: Can be fully tested by opening the site without logging in, navigating to the schedule page, and verifying that upcoming seminars and past talk titles are visible — without any materials (videos/slides) being accessible.

**Acceptance Scenarios**:

1. **Given** I am an unauthenticated user, **When** I navigate to the home page, **Then** I see a list of upcoming seminars with their date, time, title, and speaker name.
2. **Given** I am an unauthenticated user, **When** I navigate to the "Previous Talks" section, **Then** I see a chronological list of past seminars with their title, speaker, date, and a representative thumbnail image.
3. **Given** a seminar has no uploaded thumbnail, **When** it is displayed in any list or card view, **Then** a visually appealing default placeholder image is shown.
4. **Given** I am viewing the "Previous Talks" list, **When** I click a specific Tag (e.g., "AI") or Speaker name, **Then** I am routed to a dedicated Search/Archive page pre-filtered to display only seminars matching that Tag or Speaker.
5. **Given** I am an unauthenticated user, **When** I navigate directly to the Search/Archive page, **Then** I can manually search by keyword, tag, or speaker to find previous seminars.
6. **Given** I am an unauthenticated user, **When** I click on any specific seminar (upcoming or past), **Then** I see the seminar detail page with public metadata (title, speaker, abstract, date/time) but **no** embedded video, slides, or interactive features.
7. **Given** I am an unauthenticated user on a seminar detail page, **When** I attempt to access materials or interactive features, **Then** I am prompted to log in or register.
8. **Given** a seminar is starting within 15 minutes or is currently active, **When** I view the schedule, **Then** the seminar displays a visual "Live Now" or "Starting Soon" badge.

---

### User Story 2 — User Authentication (Priority: P1)

As a visitor, I want to register and log in so I can access protected seminar materials and participate in the community.

**Why this priority**: Authentication is a gate to all value-generating features (materials, RSVP, Q&A). Without it, the platform has no protected content layer.

**Independent Test**: Can be tested by registering a new account, logging in, and confirming that authenticated-only UI elements become visible on seminar pages.

**Acceptance Scenarios**:

1. **Given** I am an unauthenticated user, **When** I click "Sign Up" and provide valid credentials (email and password), **Then** my account is created and I am logged in.
2. **Given** I am a registered user, **When** I enter my email and password on the login page, **Then** I am authenticated and redirected to the page I was previously viewing.
3. **Given** I am an authenticated user, **When** I click "Log Out," **Then** my session ends and I am returned to the public portal as a guest.
4. **Given** I am an unauthenticated user, **When** I try to access a protected route directly via URL, **Then** I am redirected to the login page and returned to my intended destination after successful authentication.

---

### User Story 3 — Accessing Seminar Materials (Priority: P1)

As an authenticated user, I want to view embedded videos and presentation slides for past seminars so I can learn from talks I attended or missed.

**Why this priority**: This is the core value proposition of the platform — accessing seminar recordings and slides. Without this, there is no compelling reason for users to authenticate.

**Independent Test**: Can be tested by logging in, navigating to a past seminar page, and verifying that the video player and slide viewer are rendered with content, and that no direct download links are exposed.

**Acceptance Scenarios**:

1. **Given** I am an authenticated user, **When** I open a past seminar page that has materials attached, **Then** I see an embedded video player displaying the seminar recording.
2. **Given** I am an authenticated user, **When** I open a past seminar page that has a presentation attached, **Then** I see an embedded slide viewer displaying the slides.
3. **Given** I am an authenticated user viewing materials, **When** I inspect the page, **Then** there are no direct download links for the video or presentation files.
4. **Given** I am an authenticated user, **When** I open a past seminar page that has **no** materials attached yet, **Then** I see a clear message indicating materials are not yet available.

---

### User Story 4 — RSVP / Mark as Attending (Priority: P2)

As an authenticated user, I want to mark myself as attending an upcoming seminar so I can track my planned attendance and the organizers know expected turnout.

**Why this priority**: RSVP is a key engagement feature but not essential for core content consumption. The platform delivers value without it.

**Independent Test**: Can be tested by logging in, viewing an upcoming seminar, clicking "Mark as Attending," and confirming the seminar appears on the personal dashboard.

**Acceptance Scenarios**:

1. **Given** I am an authenticated user viewing an upcoming seminar, **When** I click "Mark as Attending," **Then** the button state changes to indicate I am attending, and this seminar appears on my personal dashboard.
2. **Given** I have just marked myself as attending, **When** the RSVP confirms, **Then** I am presented with an option to "Add to Google Calendar" or download an `.ics` file.
3. **Given** I am an authenticated user who has already RSVP'd, **When** I click the attending button again, **Then** my RSVP is removed and the seminar disappears from my personal dashboard.
4. **Given** I am an authenticated user, **When** I navigate to my personal dashboard, **Then** I see a list of all upcoming seminars I have RSVP'd to.
5. **Given** I am an unauthenticated user, **When** I attempt to click "Mark as Attending," **Then** I am prompted to log in first.

---

### User Story 5 — Seminar Q&A (Priority: P2)

As an authenticated user, I want to submit questions for a seminar and see questions from other attendees so that speakers can address audience curiosity.

**Why this priority**: Q&A drives engagement and community interaction but is not required for core content delivery.

**Independent Test**: Can be tested by logging in, navigating to a seminar page, submitting a question, and verifying it appears in the Q&A section alongside other users' questions.

**Acceptance Scenarios**:

1. **Given** I am an authenticated user viewing a seminar page, **When** I type a question and submit it, **Then** my question appears in the Q&A section with my display name and a timestamp.
2. **Given** I am an authenticated user viewing a seminar page, **When** I look at the Q&A section, **Then** I see questions submitted by other authenticated users, ordered by most recent.
3. **Given** I am an unauthenticated user, **When** I view a seminar page, **Then** I can see existing questions but cannot submit new ones (submit form is hidden or disabled with a login prompt).
4. **Given** I am an authenticated user, **When** I submit an empty question, **Then** the submission is rejected with a validation message.

---

### User Story 6 — Personal Dashboard (Priority: P3)

As an authenticated user, I want a personal dashboard that shows my RSVP'd seminars so I have a single place to manage my attendance.

**Why this priority**: The dashboard aggregates user activity and provides convenience but is not essential for core functionality.

**Independent Test**: Can be tested by RSVPing to multiple seminars and verifying they all appear on the dashboard with correct details.

**Acceptance Scenarios**:

1. **Given** I am an authenticated user with active RSVPs, **When** I navigate to my dashboard, **Then** I see a list of upcoming seminars I plan to attend, with dates and titles.
2. **Given** I am an authenticated user with no RSVPs, **When** I navigate to my dashboard, **Then** I see an empty state message encouraging me to browse the schedule.

---

### Edge Cases

- What happens when a user tries to access a seminar detail page via a direct URL while unauthenticated? → Redirect to login, then return to the seminar page after authentication.
- What happens when a seminar has no materials attached? → Show a clear "Materials not yet available" placeholder.
- What happens when a seminar transitions from "upcoming" to "past" (its date passes)? → It automatically moves from the upcoming schedule to the previous talks list based on date comparison.
- What if a user RSVPs to a seminar that is then cancelled or deleted by an admin? → The RSVP is automatically removed and the seminar disappears from the user's dashboard.
- What happens if the external storage service (hosting videos/slides) is temporarily unavailable? → Show a user-friendly error message indicating that materials are temporarily unavailable, with an option to retry.
- What happens when the Q&A section for a seminar has no questions yet? → Show an empty state encouraging the user to be the first to ask a question.

---

## Requirements

### Functional Requirements

- **FR-001**: The system MUST display a public schedule of upcoming seminars (date, time, title, speaker,tag, where is it held) accessible to all visitors without authentication.
- **FR-002**: The system MUST display a list of previous talks (title, speaker, date) accessible to all visitors without authentication.
- **FR-003**: The system MUST support user registration and login via email and password.
- **FR-004**: The system MUST protect seminar materials (videos, slides) behind authentication — only logged-in users may view them.
- **FR-005**: The system MUST redirect unauthenticated users to the login page when they attempt to access protected content, and return them to their intended page after successful login.
- **FR-006**: The system MUST embed seminar videos in a player that does not expose a direct download link.
- **FR-007**: The system MUST embed presentation slides in a viewer that does not expose a direct download link.
- **FR-008**: The system MUST allow authenticated users to RSVP ("Mark as Attending") for upcoming seminars.
- **FR-009**: The system MUST allow authenticated users to remove their RSVP for upcoming seminars.
- **FR-010**: The system MUST provide a personal dashboard showing the authenticated user's RSVP'd upcoming seminars.
- **FR-011**: The system MUST allow authenticated users to submit questions on a seminar page.
- **FR-012**: The system MUST display submitted questions (with author display name and timestamp) to all authenticated users viewing the same seminar.
- **FR-013**: The system MUST allow unauthenticated users to view existing Q&A questions but not submit new ones.
- **FR-014**: The system MUST classify seminars as "upcoming" or "past" based on their date relative to the current date.
- **FR-015**: The system MUST visually highlight seminars that are currently active or starting within 15 minutes with a "Live Now" or "Starting Soon" badge.
- **FR-016**: The system MUST provide a dedicated Search/Archive page where users can search or filter past seminars by Tag, Speaker, or Keyword.
- **FR-017**: The system MUST display a thumbnail image for seminars on schedule and archive pages, falling back to a default placeholder if none exists.
- **FR-018**: The system MUST provide an "Add to Calendar" (.ics download or Google Calendar link) option when a user RSVPs for an upcoming seminar.
- **FR-019**: The system MUST validate that question submissions are not empty before accepting them.
- **FR-020**: The system MUST display a clear placeholder when seminar materials are not yet available.
- **FR-021**: The system MUST display a user-friendly error message when embedded materials fail to load from the external storage service.

### Key Entities

- **User**: A person who interacts with the platform. Key attributes: display name, email, authentication status (guest vs. authenticated). A user can have zero or many RSVPs.
- **Seminar**: A single talk event. Key attributes: title, speaker reference(s), tag reference(s), date/time, location, abstract/description (supports Rich Text/Markdown), thumbnail image URL. Status (upcoming/past) is dynamically derived based on the current date/time. A seminar has zero or one video, zero or one presentation, and zero or many questions. RSVPs for a seminar are unlimited (no capacity constraints).
- **Speaker**: A person presenting a seminar. Key attributes: name, bio, profile image URL, affiliation.
- **Tag**: A categorization label for seminars (e.g., "AI", "Algorithms", "Career"). Key attributes: name, color code.
- **Material**: A video recording or presentation file associated with a seminar. Key attributes: type (video or presentation), external storage reference ID. Materials are viewable only by authenticated users.
- **RSVP**: A record linking a user to an upcoming seminar. Key attributes: user reference, seminar reference, timestamp of RSVP. Automatically invalidated when the seminar date passes.
- **Question**: A user-submitted question/comment tied to a specific seminar. Key attributes: question text, author (user reference), seminar reference, submission timestamp, visibility status. Questions are displayed as a general flat list (not tied to video playback timestamps) and can be submitted even after the seminar date has passed.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Any visitor can view the full upcoming schedule and previous talks list within 3 seconds of page load.
- **SC-002**: A new user can complete registration and land on their first authenticated seminar page in under 2 minutes.
- **SC-003**: Authenticated users can view embedded video and slides on a seminar page without encountering any direct download link.
- **SC-004**: 100% of attempts to access protected content while unauthenticated result in a redirect to login, followed by correct redirect back after authentication.
- **SC-005**: An authenticated user can RSVP and un-RSVP for a seminar in under 5 seconds, with immediate visual feedback.
- **SC-006**: Submitted Q&A questions appear in the seminar's Q&A section within 3 seconds of submission.
- **SC-007**: The personal dashboard accurately reflects all of the user's current RSVPs with zero stale entries for past seminars.
- **SC-008**: When materials are unavailable (not uploaded or service error), users see a clear, non-technical message rather than a broken embed or blank space.

---

## Assumptions

- Authentication will use email/password. Social login (Google, GitHub, etc.) is out of scope for Phase 1 but the architecture should not preclude it.
- There is no admin-facing functionality in Phase 1; all seminar data and materials are assumed to be pre-populated via direct database/storage operations or Phase 2 admin tools.
- Anti-download protection relies on the external storage provider's native sharing restrictions (e.g., "disable download/print/copy") rather than custom DRM.
- Q&A is a simple flat list of questions — threaded replies, upvoting, and moderation are deferred to Phase 2.
- The personal dashboard shows only RSVP'd upcoming seminars; viewing history or bookmarking past talks is out of scope for Phase 1.
- The system runs entirely serverless with zero custom backend — all data access happens client-side through the backend-as-a-service provider's SDK, abstracted through interfaces per the project constitution.

## Clarifications
### Session 2026-03-11
- Q: How is the 'status' (upcoming vs past) of a seminar determined? → A: Status is derived dynamically based on the time the seminar is held relative to the current time, not stored as a separate database field.
- Q: Does the abstract/description text need to support rich text formatting? → A: Yes, Rich Text (Markdown/HTML).
- Q: Are Q&A questions tied to specific timestamps in the video, or just a general flat list? → A: General flat list, acting as comments that can be submitted even after the time of the seminar.
- Q: Are there any maximum attendee caps for seminars? → A: No, unlimited RSVPs.
- Q: Should we add low-effort, high-impact contextual features to Phase 1? → A: Yes, added Add to Calendar logic on RSVP, a dedicated Search/Archive page for filtering by Tag/Speaker on past talks, and Live Status badges. All handled fully client-side.
