# Feature Specification: Admin Attendance Emailing

**Feature Branch**: `008-admin-attendance-email`  
**Created**: 2026-03-14  
**Status**: Draft  
**Input**: User description: "a section in admin dashboards that could be open the seminal and got the people that marked attendance and their mail, so the admin can sent email to them. as usual all the service such email service that is used should be interfaces so it support easy mantainance and multiple implementations."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Viewing Seminar Attendance (Priority: P1)

As an administrator, I want to open a specific seminar in the dashboard and see a list of all participants who have "marked attendance," including their names and email addresses.

**Why this priority**: Core functionality required before any communication can happen.

**Independent Test**: Admin navigates to a seminar's attendance section and sees a table with attendee data.

**Acceptance Scenarios**:

1. **Given** a seminar with 5 registered/attending participants, **When** the admin opens the attendance view for that seminar, **Then** a list showing 5 participants with their full names and email addresses is displayed.
2. **Given** a new seminar with no attendance yet, **When** the admin opens the attendance view, **Then** an "Empty State" message is shown.

---

### User Story 2 - Sending Emails to Attendees (Priority: P2)

As an administrator, I want to compose a rich-text email and send it to specific filtered groups or individuals who marked attendance.

**Why this priority**: Enables the primary goal of the feature (communication).

**Independent Test**: Admin filters attendees, types a rich-text message, and triggers the send action.

**Acceptance Scenarios**:

1. **Given** a list of attendees, **When** the admin applies filters (e.g., date marked) and selects the resulting group, **Then** the system populates the recipient list for the email.
2. **Given** a group of recipients, **When** the admin clicks "Send Email" and uses the Rich-Text editor to compose a message with formatting, **Then** the system delegates the sending to the configured email service provider.
3. **Given** a draft email, **When** the admin triggers the send, **Then** a success confirmation is displayed after the service completes.

---

### User Story 3 - Provider-Agnostic Email Implementation (Priority: P3)

The system should allow switching between different email service providers (e.g., SMTP, SendGrid, Mailgun) without changing the UI or business logic.

**Why this priority**: Technical requirement for maintenance and flexibility as requested.

**Independent Test**: The feature works identically regardless of which email adapter is active.

**Acceptance Scenarios**:

1. **Given** the application is configured with a "Mock Email Adapter," **When** an admin sends an email, **Then** the logs show the email content instead of attempting real delivery.

---

### Edge Cases

- **Large Attendee Lists**: How does the system handle sending emails to 500+ attendees at once? (Assume background processing or batching).
- **Invalid Emails**: What happens if some attendees have malformed or missing email addresses?
- **Service Failure**: How is the admin notified if the email service provider is down or fails to send?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide an "Attendance" view for each seminar in the Admin Dashboard.
- **FR-002**: System MUST display a list of users who have "marked attendance" for that seminar.
- **FR-003**: The list MUST include the User's Full Name and Email Address.
- **FR-004**: System MUST provide a Rich-Text Editor (WYSIWYG) for composing the email body (bold, links, lists).
- **FR-005**: System MUST allow the Admin to filter attendees by criteria and select/toggle specific recipients.
- **FR-006**: System MUST use a TypeScript interface (`EmailService`) for all email operations.
- **FR-007**: System MUST support multiple implementations of the `EmailService` (adapters).
- **FR-008**: System MUST display a clear success or error message after attempting to send emails.

### Key Entities

- **AttendanceRecord**: Represents the link between a specific User and a Seminar.
- **Attendee**: A view-model or projection of the User entity containing Name and Email.
- **EmailDraft**: Local state object containing subject, body, and list of recipient IDs.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admin can load the attendance list for a seminar (up to 200 records) in under 800ms.
- **SC-002**: Admin can trigger a "Send All" action in fewer than 3 clicks from the seminar detail view.
- **SC-003**: 100% of functional code related to email composition is decoupled from the vendor-specific SDK.
- **SC-004**: System ensures that no email is sent to users who have not explicitly "marked attendance" for that specific seminar.
