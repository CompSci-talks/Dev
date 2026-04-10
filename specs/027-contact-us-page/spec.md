# Feature Specification: Contact Us Page

**Feature Branch**: `027-contact-us-page`  
**Created**: 2026-04-10  
**Status**: Draft  
**Input**: User description: "Add a Contact Us page at the route /contact that allows any visitor (authenticated or not) to submit feedback, suggestions, or questions to the site administrators."

---

## Clarifications

### Session 2026-04-10

- Q: Where should the admin notification email address(es) be stored/configured? → A: Skip email notification entirely — submissions are saved to Firestore only. No outbound email is sent on form submit.
- Q: After seeing the success/thank-you state, can the user submit another message in the same session? → A: Yes — the success state includes a "Send another message" button that resets the form in place.
- Q: Where should the "Contact Us" link appear in the site navigation? → A: In the global footer only (not the top navbar).
- Q: Should the schema include a soft-delete field now? → A: Yes, add an `isDeleted` (boolean) field defaulting to false.
- Q: When the user reaches the 1000 character limit, how should the input behave? → A: Prevent further typing (hard stop at 1000 chars).

---

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Guest Submits Feedback (Priority: P1)

As an unauthenticated visitor, I want to navigate to `/contact` and fill in a form so that I can send feedback, a bug report, a speaker suggestion, or a general question to the site administrators — without needing to create an account.

**Why this priority**: This is the core feature. All other stories build on top of this working submission flow.

**Independent Test**: Open the site without logging in. Navigate to `/contact`. Fill in all fields with valid data and submit. Observe that a success state is shown in place of the form and no redirect occurs.

**Acceptance Scenarios**:

1. **Given** I am an unauthenticated visitor on `/contact`, **When** I fill in Name, Email, Subject, and Message (≥20 chars) and click Submit, **Then** the form is replaced by a thank-you confirmation message and no page navigation occurs.
2. **Given** I leave any required field empty, **When** I attempt to submit, **Then** inline validation errors appear next to the relevant field(s) and the form is not submitted.
3. **Given** I enter an invalid email format, **When** I attempt to submit, **Then** an inline error appears on the Email field indicating an invalid format.
4. **Given** I type in the Message field, **When** the character count reaches 1000 characters, **Then** the character counter indicates the limit is reached and further textual input is prevented (hard stop).
5. **Given** I type fewer than 20 characters in the Message field and attempt to submit, **Then** an inline error appears indicating the minimum length requirement.
6. **Given** the form is submitted successfully, **When** the success state is shown, **Then** the submission button has shown a loading indicator from the moment of click until the response is received.
7. **Given** the success state is displayed, **When** I click "Send another message", **Then** the form is reset to its empty/default state (pre-filled values restored for authenticated users) and the success message is replaced by the form.

---

### User Story 2 - Authenticated User Gets Pre-filled Form (Priority: P2)

As a logged-in user, I want the Contact Us form to automatically populate my Name and Email so I don't have to type them manually.

**Why this priority**: Improves convenience for registered users and reduces friction. The form still works without this — it just adds polish.

**Independent Test**: Log in with a registered account. Navigate to `/contact`. Observe that the Name and Email fields are already populated with the user's profile data.

**Acceptance Scenarios**:

1. **Given** I am authenticated, **When** I visit `/contact`, **Then** the Name field is pre-filled with my display name and the Email field is pre-filled with my account email.
2. **Given** I am authenticated and my Name/Email fields are pre-filled, **When** I edit them before submitting, **Then** the edited values (not the original profile values) are saved in the submission record.

---

### Edge Cases

- **Spam / Rapid Resubmission**: If a visitor submits the form multiple times quickly, each submission is saved independently. No deduplication or rate-limiting is enforced in this version (may be revisited in a future spec).
- **Empty admin email list**: If no admin email address is configured, the notification step is silently skipped and the submission is still saved.
- **Network failure mid-submit**: If the save operation fails due to a network error, the form remains visible, the loading indicator is dismissed, and an error message is displayed near the Submit button (e.g., "Something went wrong, please try again.").
- **Very long name/email**: Fields accept standard browser input limits; no custom truncation is applied.
- **Special characters in message**: The message body is stored and displayed as plain text; no HTML rendering or script execution should occur.

---

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST provide a publicly accessible page at the route `/contact` that requires no authentication to view or use.
- **FR-002**: The contact form MUST collect four fields: Name (text, required), Email (email format, required), Subject (dropdown/select, required), and Message (textarea, required).
- **FR-003**: The Subject field MUST offer exactly four options: "General Feedback", "Bug Report", "Speaker Suggestion", and "Other".
- **FR-004**: The Message field MUST enforce a minimum of 20 characters and a maximum of 1000 characters (hard stop preventing further input at 1000), with a live character counter visible to the user at all times.
- **FR-005**: The system MUST display inline validation errors adjacent to each field upon failed submission attempt; errors MUST be cleared when the user corrects the input.
- **FR-006**: The Submit button MUST display a loading/in-progress state from the moment the user clicks it until the operation completes (success or failure).
- **FR-007**: Upon successful submission, the system MUST replace the form with a thank-you / success message in the same view without performing a page navigation or redirect. The success state MUST include a "Send another message" button that, when clicked, resets the form to its empty/default state and dismisses the success message.
- **FR-008**: Upon successful submission, the system MUST persist the submission to a dedicated data store with at minimum the following data: sender name, sender email, subject category, message body, submission timestamp, and a status field initialized to "new".
- **FR-009**: If the current user is authenticated, the system MUST pre-populate the Name and Email fields with the user's profile display name and account email, respectively. These fields remain editable.

- **FR-011**: The page and form MUST be fully keyboard-navigable and all interactive elements MUST have appropriate accessible labels.
- **FR-012**: The submission record schema MUST be extensible to support future admin-facing operations (e.g., changing status, filtering by category, soft delete).

### Key Entities

- **ContactSubmission**: Represents a single message sent via the Contact Us form.
  - Attributes: `id` (auto-generated), `name` (string), `email` (string), `subject` (enum: General Feedback | Bug Report | Speaker Suggestion | Other), `message` (string), `createdAt` (timestamp), `status` (enum: new | read | resolved), `isDeleted` (boolean, default: false), `submitterUid` (string | null — populated if the sender was authenticated at submit time).

---

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Any visitor can complete and submit the contact form in under 2 minutes from first page load.
- **SC-002**: 100% of successfully submitted forms result in a persisted record; no submission is silently lost.
- **SC-003**: Authenticated users see their Name and Email pre-populated on 100% of visits.
- **SC-004**: The form prevents submission when any required field is empty, the email is malformed, the message is under 20 characters, or the message exceeds 1000 characters — with a clear inline error for each case.

- **SC-006**: The page is fully operable using only a keyboard (Tab, Shift+Tab, Space/Enter for controls), with no functionality inaccessible to keyboard-only users.

---

## Assumptions

- No outbound email notification is sent when a form is submitted. Admins discover new submissions by checking the admin inbox (future spec).
- No CAPTCHA or bot protection is included in this version. If spam becomes an issue, it will be addressed in a follow-up spec.
- The submission record is append-only from the public form; editing or deleting records is an admin-only concern handled in the future admin inbox spec.
- The page link ("Contact Us") will be added to the site's footer navigation as part of implementation (excluded from top navbar).
