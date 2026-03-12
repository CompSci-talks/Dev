# Feature Specification: Refactoring Q&A to Comments

**Feature Branch**: `003-refactor-qa-to-comments`  
**Created**: 2026-03-11  
**Status**: Draft  
**Input**: User description: "i think we need it to be just comments. not Q&A", plus follow-up: "the comments should be repliable, so any user, speaker included can reply on any comment"

## Clarifications

### Session 2026-03-12
- Q: How deep can comment threads go? → A: Single level nesting (Replies can only be made to top-level comments. You cannot reply to a reply).
- Q: How should long comments be handled to prevent UI breakage? → A: Truncation with "See More" expansion logic.

## User Scenarios & Testing

### User Story 1 - Viewing Seminar Comments (Priority: P1)

As an attendee or visitor, I want to read comments left by other users on a seminar so that I can see the community's thoughts and reactions to the talk.

**Why this priority**: Reading comments is the primary way the community interacts with the seminar content after the fact. It provides social proof and engagement without requiring active participation.

**Independent Test**: Can be tested by navigating to a seminar detail page and verifying that existing comments are visible below the seminar details and materials (replacing the old Q&A section).

**Acceptance Scenarios**:

1. **Given** I am viewing a seminar page, **When** I scroll to the comments section, **Then** I see a chronological list of comments left by users, displaying their names, the comment text, and a timestamp.
2. **Given** a seminar has no comments yet, **When** I view the comments section, **Then** I see a friendly empty state message encouraging users to leave the first comment.
3. **Given** I am an unauthenticated user, **When** I view the comments section, **Then** I can read all comments but the input field to submit a new comment is replaced by a prompt to log in or register.

---

### User Story 2 - Submitting a Comment (Priority: P1)

As an authenticated user, I want to leave a comment on a seminar so that I can share my thoughts, thank the speaker, or discuss the topic with others.

**Why this priority**: Active participation is key to a healthy community. Users need a simple, low-friction way to express their thoughts without the formality of a "Question".

**Independent Test**: Can be tested by logging in, navigating to a seminar, typing a comment, and submitting it, then verifying it appears in the list immediately.

**Acceptance Scenarios**:

1. **Given** I am an authenticated user on a seminar page, **When** I type text into the comment input and click submit, **Then** my comment is added to the list immediately with my display name and the current timestamp.
2. **Given** I am an authenticated user, **When** I attempt to submit an empty comment or a comment containing only whitespace, **Then** the submission is blocked and I am shown a validation error.
3. **Given** I am an authenticated user, **When** my comment submission fails due to a network error, **Then** I am shown a clear error message and my typed text is preserved so I can try again.

---

### User Story 3 - Replying to a Comment (Priority: P1)

As a user (including speakers), I want to reply directly to a specific comment so that I can answer questions or continue a targeted discussion.

**Why this priority**: Replying is a core social feature required for turning a comment wall into an interactive discussion.

**Independent Test**: Can be tested by logging in, finding a top-level comment, clicking "Reply", submitting a response, and verifying it appears nested under the original comment.

**Acceptance Scenarios**:

1. **Given** I am an authenticated user, **When** I view a top-level comment, **Then** I see a "Reply" button.
2. **Given** I click "Reply" on a top-level comment, **When** I submit my response, **Then** it is visually nested under the original comment.
3. **Given** I view a nested reply, **When** I look for a "Reply" button, **Then** I do not see one (single-level nesting constraint).

### Edge Cases

- What happens if a user submits a very long comment? → UI follows "See More" truncation logic to maintain feed readability.
- How does the system handle rapid, repeated comment submissions (spam prevention)? 
- If a user deletes their account, what happens to their comments? (Assuming display name falls back to "Deleted User" or is retained conditionally).

## Requirements

### Functional Requirements

- **FR-001**: The system MUST display a list of comments associated with a specific seminar on its detail page.
- **FR-002**: The system MUST allow all users (authenticated and guests) to view the comments list.
- **FR-003**: The system MUST allow only authenticated users to submit new comments.
- **FR-004**: The system MUST display a predefined login/register prompt to guest users in place of the comment submission form.
- **FR-005**: The system MUST validate that a comment is not empty before submission.
- **FR-006**: The system MUST display the author's display name, the comment text, and the submission timestamp for each comment.
- **FR-007**: The system MUST replace all frontend terminology from "Q&A" / "Questions" to "Comments" across the seminar detail view.
- **FR-008**: The system MUST allow authenticated users to submit replies to top-level comments.
- **FR-009**: The system MUST restrict replies to a single level of nesting (i.e., a reply cannot have sub-replies).
- **FR-010**: The system MUST truncate long comments using line-clamping and provide a "See More" button to reveal the full content.

### Key Entities

- **Comment**: Replaces the previous "Question" entity. Key attributes: `text` (the comment body), `author_id` (reference to User), `seminar_id` (reference to Seminar), `created_at` (timestamp), `parent_id` (optional reference to a parent Comment for replies). Validation constraint: text length > 0.
- **Seminar**: The subject of the comments.
- **User**: The author of the comments.

## Success Criteria

### Measurable Outcomes

- **SC-001**: An authenticated user can successfully submit a comment and see it rendered on the screen within 1 second.
- **SC-002**: 100% of the UI components reflecting the old "Q&A" feature are renamed to standard "Comment" terminology to avoid user confusion.
- **SC-003**: Guest users are entirely restricted from submitting comments but can view the stream without crashing or infinite loading states.
