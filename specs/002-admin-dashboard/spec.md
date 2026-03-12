# Feature Specification: Phase 2 — Admin Dashboard

**Feature Branch**: `002-admin-dashboard`  
**Created**: 2026-03-11  
**Status**: Draft  
**Input**: User description: "Phase 2: Admin Dashboard including Semester & Timeframe Setup, Seminar Scheduling, Content & Material Uploading to Google Drive, and Engagement & Moderation."

---

### Session 2026-03-12
- Q: How should the `IMaterialService` handle the handshake with the external storage provider? → A: Hybrid approach. Provide an abstract `upload` interface (implemented via Google Drive adapter) but also allow direct Manual URL insertion for materials.

---

## User Scenarios & Testing

### User Story 1 — Semester & Timeframe Setup (Priority: P1)

As an administrator, I want to create academic semesters and mark one as "Active" so that the public portal automatically filters and displays only the seminars relevant to current students.

**Why this priority**: Without semesters, scheduling seminars for specific terms is impossible, and the public portal would become cluttered with every seminar ever created.

**Independent Test**: Can be tested by creating "Spring 2026" (Jan 1 - May 30), setting it as active, and viewing the public schedule to verify only seminars with dates in that range are shown as "Current", while others move to "Archive".

**Acceptance Scenarios**:

1. **Given** I am an authenticated Admin, **When** I create a new academic semester with a name (e.g., "Spring 2026"), start date, and end date, **Then** it is saved to the system.
2. **Given** I am an authenticated Admin, **When** I mark a specific semester as the "Active Semester", **Then** the previous active semester is deactivated.
3. **Given** a semester is marked Active, **When** users (both guest and authenticated) view the public portal, **Then** the "Upcoming Schedule" displays only seminars falling within the active semester's date range.
4. **Given** a semester is deactivated, **When** users view the public portal, **Then** seminars from that semester are routed to the searchable archive ("Previous Talks").

---

### User Story 2 — Seminar Scheduling (Priority: P1)

As an administrator, I want to create, update, and manage seminars so that users can discover them on the platform and RSVP.

**Why this priority**: Seminar creation is the core operational capability of the platform. Without this, no content exists for the public portal to display.

**Independent Test**: Can be tested by creating an upcoming seminar, verifying it appears on the public portal with an RSVP button, then editing its details and verifying the updates propagate instantly.

**Acceptance Scenarios**:

1. **Given** I have set an active semester, **When** I create a new seminar entry with a future date, title, and speaker, **Then** it is published to the public "Upcoming Schedule" and RSVP functionality is enabled.
2. **Given** I am an authenticated Admin, **When** I create a seminar entry with a past date, **Then** it bypasses the upcoming schedule and is added directly to "Previous Talks".
3. **Given** an existing seminar with active RSVPs, **When** I update its date, time, title, or speaker, **Then** the changes reflect across the platform immediately.
4. **Given** an existing seminar with active RSVPs, **When** I update its details, **Then** the existing RSVPs are preserved and not lost.

---

### User Story 3 — Secure Material Upload (Priority: P1)

As an administrator, I want to attach video recordings and presentation files to seminar records by uploading them directly to an external storage service, so that attendees can access them securely.

**Why this priority**: The primary value for authenticated users is accessing materials. Admins need a streamlined workflow to attach these materials without manual external file-sharing steps.

**Independent Test**: Can be tested by selecting an existing seminar, uploading a video file, and verifying that the generated external identifier is saved to the seminar record and the video is viewable by authenticated attendees.

**Acceptance Scenarios**:

 1.  **Given** an existing seminar record, **When** I upload a video or PPT file, **Then** the file is streamed securely to the external storage drive and its File ID is saved.
 2.  **Given** an existing seminar record, **When** I have an existing Google Drive File ID or URL, **Then** I can manually paste and save this ID/URL as the seminar's material source for instant embedding.
 3.  **Given** a successful upload, **When** the external drive generates a File ID, **Then** that ID is saved to the seminar record in the database.
 4.  **Given** a file is recorded (via upload, ID, or URL), **When** it is saved, **Then** the system ensures the viewing interface remains provider-agnostic.

---

### User Story 4 — Engagement & RSVP Tracking (Priority: P2)

As an administrator, I want to view a list and total count of students who have RSVP'd for upcoming seminars so I can gauge interest and plan logistics.

**Why this priority**: Helps organizers understand attendance and interest levels.

**Independent Test**: Can be tested by having multiple test, users RSVP to a seminar, then checking the admin dashboard to verify the list and total count are accurate.

**Acceptance Scenarios**:

1.  **Given** an upcoming seminar has RSVPs, **When** I view its dashboard entry, **Then** I see the total count of expected attendees.
2.  **Given** an upcoming seminar has RSVPs, **When** I view its dashboard entry, **Then** I can see a list of the specific users (e.g., names/emails) who marked themselves as attending.

---

### User Story 5 — Comments Moderation (Priority: P2)

As an administrator, I want to review, hide, or delete inappropriate comments submitted to a seminar's discussion section so that the public portal remains professional and focused.

**Why this priority**: Required for community safety and engagement quality, ensuring speakers aren't subjected to spam or abusive comments.

**Independent Test**: Can be tested by submitting a comment as a regular user, logging in as an admin to hide it, and verifying it disappears from the regular user's view.

**Acceptance Scenarios**:

1.  **Given** users have submitted comments to a seminar, **When** I review the seminar's comments section in the admin dashboard, **Then** I see a list of all submitted comments.
2.  **Given** an inappropriate comment exists, **When** I choose to "Hide" it, **Then** the comment immediately disappears from the attendee portal but remains visible in the admin dashboard.
3.  **Given** a hidden or inappropriate comment exists, **When** I choose to "Delete" it, **Then** it is permanently removed from both the attendee portal and the database.

---

### Edge Cases

-   What happens if an Admin tries to schedule a seminar with a date outside of the active semester? → Validated and rejected with a clear error, or automatically assigned to the correct existing semester.
-   What happens if an Admin deletes an active semester? → All seminars within it are either orphaned or moved to a default archive state, and the public schedule falls back to a "No active semester" empty state.
-   What if an Admin attempts to upload a file type other than a video (e.g., mp4) or presentation (e.g., pptx, pdf)? → The upload is rejected client-side with an error message.
-   What happens if the external storage drive runs out of quota during upload? → The upload fails gracefully, no File ID is saved to the database, and the Admin receives an actionable error message.
-   Can there be multiple active semesters? → No, only one semester can be marked active at a time. Setting a new one automatically un-sets the previous one.

---

## Requirements

### Functional Requirements

-   **FR-001**: The system MUST allow administrators to create a semester with a name, start date, and end date.
-   **FR-002**: The system MUST allow an administrator to toggle exactly one semester as the "Active Semester".
-   **FR-003**: The system MUST automatically hide seminars belonging to deactivated semesters from the public "Upcoming Schedule".
-   **FR-004**: The system MUST allow administrators to create a seminar record (title, speaker, date, time, description).
-   **FR-005**: The system MUST automatically group seminars into semesters based on their date (no manual linking needed).
-   **FR-006**: The system MUST route seminars with a future date to the public "Upcoming Schedule" ONLY if they fall within the Active Semester's date range.
-   **FR-009**: The system MUST route seminars outside the active semester to the "Previous Talks" archive.
-   **FR-007**: The system MUST allow administrators to edit all text fields and the date/time of an existing seminar.
-   **FR-008**: The system MUST preserve existing RSVPs when a seminar's schedule or details are updated.
-   **FR-010**: The system MUST provide a hybrid material management interface allowing: direct secure file uploads, manual Google Drive File ID entry, or direct external URL entry.
-   **FR-011**: The system MUST automatically configure the external storage provider permissions for uploads, falling back to manual validation for IDs/URLs.
-   **FR-012**: The system MUST save either the external storage File ID or the Direct URL to the seminar record, ensuring the frontend handles both transparently (e.g., embedding via iframe for Drive IDs).
-   **FR-022**: The system MUST strictly abstract all BaaS/Backend interactions behind interfaces (Adapter Pattern) so that switching providers (e.g., Supabase to Firebase) involves no changes to UI or Business Logic components.
-   **FR-013**: The system MUST display the total count of RSVPs for any given upcoming seminar in the admin dashboard.
-   **FR-014**: The system MUST display a list of users (names/emails) who have RSVP'd for a specific seminar.
-   **FR-015**: The system MUST allow administrators to view all comment submissions for any seminar.
-   **FR-016**: The system MUST allow administrators to toggle the visibility (Hide/Show) of individual comments.
-   **FR-017**: The system MUST allow administrators to permanently delete individual comments.

### Key Entities

- **Semester**: A defined academic time period. Key attributes: name, start date, end date, is_active (boolean).
- **Admin User**: A user with elevated privileges. Key attributes: standard user attributes plus role-based access flags.
- **Seminar**: (Shared with Phase 1) Seminars are implicitly linked to semesters based on their `date` field.
- **Material**: The admin interface allows attaching materials via upload (Adapter) or direct ID/URL entry.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: An administrator can create a new active semester and schedule a new seminar in under 2 minutes.
- **SC-002**: Changes to an active semester or a seminar's details are reflected on the public portal instantly (under 1 second).
- **SC-003**: Material uploads exceeding 100MB complete without timing out the client application, showing a progress indicator during the upload.
- **SC-004**: 100% of files uploaded through the admin portal automatically have anti-download permissions applied via the external storage provider's API.
- **SC-005**: An administrator can view the RSVP list and hide an inappropriate comment in 3 clicks or fewer from the main dashboard.

---

## Assumptions

- Admin authentication and authorization are handled by the same identity provider as Phase 1 (attendees), utilizing Role-Based Access Control (RBAC) to differentiate standard users from admins.
- Uploads happen directly from the Admin's client browser to the external storage provider (e.g., using signed URLs or direct client SDKs) to maintain the 100% serverless constraint, avoiding intermediary backend bottlenecks.
- The external storage provider exposes an API capable of programmatically setting "disable download/print/copy" permissions on files.
- The Admin dashboard is a protected route within the same Angular SPA as the attendee portal, lazy-loaded only for users with Admin roles.
 
 ---
 
 ## Clarifications
 ### Session 2026-03-12
 - Q: How should the `IMaterialService` handle the handshake with the external storage provider? → A: Hybrid approach. Provide an abstract `upload` interface (implemented via Google Drive adapter) but also allow direct Manual URL insertion for materials.
 - Q: Should seminars be explicitly linked to Semester IDs? → A: No. Date-Range Association (Option A). Seminars are automatically grouped by checking if their date falls within a semester's range. This simplifies the Admin UX.
 - Q: Can we use Google Drive IDs directly? → A: Yes. Enable pasting a Google Drive File ID for instant iframe embedding, bypassing the upload flow if the file already exists.


