# Feature Specification: Supabase Integration

**Feature Branch**: `009-supabase-integration`  
**Created**: 2026-03-14  
**Status**: Draft  
**Input**: User description: "now we are going to replcace the in memory data with the the supabase implementation for every service so we go with the real production version of the application."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Data Persistence (Priority: P1)

As a user, I want my data (RSVPs, comments, profiles) to be persisted in a real database so that my changes are saved across sessions and visible to others.

**Why this priority**: This is the core requirement of moving to production. Without persistence, the application is just a demo.

**Independent Test**: Can be tested by signing up, leaving a comment, and refreshing the page to see the comment still there.

**Acceptance Scenarios**:

1. **Given** a user is logged in, **When** they submit a comment on a seminar, **Then** the comment is saved to Supabase and remains visible after a page reload.
2. **Given** a user is logged in, **When** they RSVP to a seminar, **Then** the RSVP status is persisted and correctly reflected in the UI upon return.

---

### User Story 2 - Real Authentication (Priority: P1)

As a user, I want to sign in with my real credentials via Supabase Auth so that my account is secure and uniquely identified.

**Why this priority**: Security and identity are fundamental for production applications.

**Independent Test**: Can be tested by creating an account and logging in/out via the Supabase Auth flow.

**Acceptance Scenarios**:

1. **Given** a new user, **When** they sign up with email and password, **Then** a Supabase Auth user is created and they are automatically logged in.
2. **Given** an existing user, **When** they sign in with correct credentials, **Then** their session is established and their profile is loaded from the database.

---

### User Story 3 - Admin Data Management (Priority: P2)

As an administrator, I want to manage semesters, seminars, speakers, and tags in the production database.

**Why this priority**: Administrators need to be able to manage real content.

**Independent Test**: Can be tested by creating a new seminar through the admin dashboard and verifying it appears in the seminars table in Supabase.

**Acceptance Scenarios**:

1. **Given** an admin user, **When** they create a new seminar, **Then** it is saved to the Supabase `seminars` table.
2. **Given** an admin user, **When** they update a semester's status, **Then** the change is persisted in the `semesters` table.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST use Supabase URL and Anonymous Key from environment variables for all database interactions.
- **FR-002**: All core services (`Auth`, `Semester`, `Seminar`, `Speaker`, `Tag`, `Comment`, `RSVP`) MUST be switched from Mock implementations to Supabase-backed implementations.
- **FR-003**: `SupabaseSeminarService` MUST implement `getAttendees(seminarId)` to fetch attendees from the database.
- **FR-004**: System MUST provide `SupabaseSpeakerService` and `SupabaseTagService` implementations.
- **FR-005**: All service providers in `appConfig` MUST be updated to point to their respective Supabase implementations.
- **FR-006**: The `EmailService` MUST be transitioned to a production adapter.
- **FR-007**: Material IDs for videos/slides MUST reference external Cloud Drive/CDN links, adhering to Principle VI.

### Edge Cases

- **Network Reliability**: How does the system handle intermittent connectivity when communicating with Supabase?
- **Authentication Expiry**: What is the user experience when a session expires while they are active?
- **Concurrent Updates**: How are race conditions handled when multiple admins update the same seminar/semester simultaneously?
- **Data Integrity**: What happens if a required field is missing in the database but expected by the frontend?
- **Supabase Quotas**: How does the system respond if API limits or database storage quotas are reached?

### Key Entities *(include if feature involves data)*

- **User**: Profile data stored in `users` table, linked to Supabase Auth ID.
- **Semester**: Academic period data.
- **Seminar**: Individual seminar details.
- **Speaker**: Information about seminar presenters.
- **Tag**: Categories for seminars.
- **Comment**: User remarks on seminars, supporting threading and moderation.
- **RSVP**: Junction between User and Seminar indicating attendance intent.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Page load time for views with >100 seminars is under 2 seconds.
- **SC-002**: 100% of data mutations (RSVP, Comment, Admin CRUD) are persisted and retrievable after session termination.
- **SC-003**: [OPTIONAL] Real-time comments appear for other users within 500ms of submission. (If it adds significant effort, prioritize persistence first).
- **SC-004**: No "Mock" service classes are instantiated in the production build.

## Clarifications

### Session 2026-03-14
- Q: Is real-time sync (e.g., Supabase Realtime) a hard requirement? → A: Realtime is not a requirement. If it is granted by default (opt-in), go with it; if it needs significant effort, overlook it.
