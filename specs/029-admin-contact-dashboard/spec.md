# Feature Specification: ContactUsModeration Dashboard

**Feature Branch**: `029-admin-contact-dashboard`  
**Created**: 2026-04-10
**Status**: Draft  
**Input**: User description: "Create a new feature specification for an Admin Contact Moderation dashboard. Goal: Build a secure admin page to read, manage, and follow up on messages submitted through the 'Contact Us' public form. Requirements: 1. Routing & Access 2. Data Consumption 3. Data Grid/List UI 4. Detail View 5. Admin Actions 6. Architecture Guidelines"

## Clarifications

### Session 2026-04-10

- Q: Which UI pattern should be used for the submission detail view? → A: Slide-over side panel
- Q: How many items should load in the list without pagination? → A: Hard limit to fetch only the 50 most recent items
- Q: How should soft-deleted items be handled in the UI? → A: Hide from UI completely (retained in DB for audit only)
- Q: Which term should be used for the dashboard and moderation logic? → A: `ContactUsModeration` (more general and preferred)
- Q: Should the submission status be updated automatically based on admin actions? → A: Yes. Opening the detail view sets status to `read`. Clicking "Reply" sets status to `resolved`.
## User Scenarios & Testing *(mandatory)*

### User Story 1 - Secure Access to Feedback Dashboard (Priority: P1)

As an administrator, I want to access a dedicated dashboard for messages submitted via the "Contact Us" form, so that I can moderate and respond to them securely.

**Why this priority**: Essential to provide administrators an entry point to the new feature; ensures the page is protected correctly from unauthenticated users.

**Independent Test**: Can be tested by navigating to `/admin/feedback` as both an admin and a non-admin, verifying access control and sidebar navigation presence.

**Acceptance Scenarios**:

1. **Given** I am an authenticated admin user, **When** I click the "Feedback/Messages" link in the admin sidebar navigation, **Then** I am routed to `/admin/feedback` successfully.
2. **Given** I am a guest or non-admin user, **When** I attempt to access the `/admin/feedback` URL, **Then** I am denied access by the authentication system and redirected to the login or home page.

---

### User Story 2 - View and Filter Contact Submissions List (Priority: P1)

As an administrator, I want to view a table of recent contact submissions sorted by newest first, so that I can quickly see all incoming messages that require attention.

**Why this priority**: The core value proposition of the dashboard—seeing the messages.

**Independent Test**: Can be tested by ensuring dummy data loaded in the database appears in the table with correct columns and sorting, excluding softly deleted records.

**Acceptance Scenarios**:

1. **Given** the dashboard is loaded, **When** the list is displayed, **Then** I see columns for Date, Name, Subject, and Status.
2. **Given** there are deleted and non-deleted submissions in the database, **When** the dashboard fetches data, **Then** only non-deleted entries (`isDeleted == false`) are displayed by default.
3. **Given** more than 50 submissions exist, **When** they are displayed, **Then** only the 50 most recent items are loaded and they are ordered descending by date (newest first).

---

### User Story 3 - View Submission Details (Priority: P2)

As an administrator, I want to click on a submission to read the full message text and see the sender's email address, so that I understand the context before taking action.

**Why this priority**: Necessary to actually read the content, beyond just the subject.

**Independent Test**: Clicking a row opens a slide-over side panel displaying the full `message` and `email` properties.

**Acceptance Scenarios**:

1. **Given** I am on the submissions list, **When** I trigger the detail view for a specific row, **Then** a slide-over side panel opens showing the sender's email address and the full text of their message.

---

### User Story 4 - Manage Submission Status and Delete (Priority: P2)

As an administrator, I want to change the status of a message (`new`, `read`, `resolved`) or soft-delete it, so that I can track moderation progress and keep the inbox clean.

**Why this priority**: Allows operational management of the queue.

**Independent Test**: Clicking status toggles or delete buttons updates the state in the UI and underlying database.

**Acceptance Scenarios**:

1. **Given** I have a submission with status `new`, **When** I change its status to `read` or `resolved`, **Then** the new status is saved and visually reflected in the table.
2. **Given** I am viewing a submission, **When** I choose to delete it, **Then** it performs a soft-delete (setting `isDeleted: true`) and the row is permanently hidden from the admin UI.

---

### User Story 5 - Quick Reply via Email Composer (Priority: P3)

As an administrator, I want to click a "Reply" button on a submission to quickly launch the internal email composer pre-filled with the user's details, so that I can seamlessly follow up with them.

**Why this priority**: Improves workflow efficiency but is less critical than reading and tracking the messages.

**Independent Test**: Clicking "Reply" opens the existing `email-composer` seeded with the relevant contact data.

**Acceptance Scenarios**:

1. **Given** I am in the detail view or row for a submission, **When** I click "Reply", **Then** I am routed to the existing `email-composer` and the sender's details (email, and potentially subject context) are pre-filled.

### Edge Cases

- What happens if the `message` text is extremely long? (Detail view must ensure scrollability and text wrapping to prevent UI clipping).
- How does the system handle database permission issues or read failures when the dashboard mounts? (Should display user-friendly error banners).

### Dependencies & Assumptions

- **Assumption**: The existing internal email composer can accept pre-filled context parameters via routing.
- **Dependency**: Administrator accounts and the basic `/admin` layout/sidebar already exist.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a new route at `/admin/feedback` restricted to authenticated administrators.
- **FR-002**: System MUST add `/admin/feedback` to the existing admin sidebar navigation.
- **FR-003**: System MUST fetch contact submissions from the database, defaulting to only non-deleted entries, and limited to the 50 most recent items.
- **FR-004**: System MUST display submissions in a grid/list featuring Date, Name, Subject, and Status columns, sorted descending by newest first.
- **FR-005**: System MUST provide a detail view via a slide-over side panel to expose the full `message` string and sender's `email`, and automatically set the status to 'read' if it was previously 'new'.
- **FR-006**: System MUST allow admins to cycle/set the `status` field between "new", "read", and "resolved".
- **FR-007**: System MUST allow admins to soft-delete a submission by setting a deleted flag to true, permanently hiding it from the admin UI.
- **FR-008**: System MUST provide a "Reply" action that routes to the internal email composer, pre-filling details and ensuring the user is returned to `/admin/feedback` after sending. Status MUST auto-set to 'resolved'.
- **FR-009**: System MUST present a UI that is visually consistent with existing admin interfaces (e.g., maintaining the established modern design language).

### Key Entities *(include if feature involves data)*

- **ContactSubmission**: Represents a user message submitted via the Contact Us form. Includes fields: `id`, `name`, `email`, `subject`, `message`, `date`/`createdAt`, `status` (`new` | `read` | `resolved`), `isDeleted` (boolean).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Perceived performance goal: Detail view for any submission opens under 500ms upon interaction.
- **SC-002**: Status change operations or soft deletes optimistic update the UI and save to the backend, displaying feedback in under 1 second.
- **SC-003**: Clicking "Reply" successfully bridges the admin to the email composer pre-seeded with the target user's email address, saving typical manual input repetition.
