# Research & Decisions: ContactUsModeration Dashboard

## Detail View Pattern
- **Decision:** Use a slide-over side panel for viewing submission details.
- **Rationale:** Approved by user during the `/speckit.clarify` workflow. A slide-over keeps the list context loosely visible while providing ample horizontal and vertical space for long paragraph wrapping compared to a standard center modal.
- **Alternatives considered:** Modal dialogs, expanding accordion rows. Moderating emails works best when inbox list logic remains accessible.

## Testing Framework
- **Decision:** Use existing Vitest and Playwright integration.
- **Rationale:** Discovered `vitest` and `@playwright/test` explicitly configured in `package.json` devDependencies.
- **Alternatives considered:** N/A (respecting project defaults).

## Data Fetching Limits
- **Decision:** Firestore query will strictly limit to the 50 most recent undeleted submissions.
- **Rationale:** Agreed upon during clarification. Infinite scroll is overkill for a generally "zero-inbox" moderation queue, and 50 is more than enough backlog to address per session.
- **Alternatives considered:** Infinite scroll plugin, standard pagination logic.

# Data Model: ContactUsModeration Dashboard
- **Decision:** Smart/Dumb component separation. 
  - `ContactUsModerationComponent` (Smart): Injects `ContactSubmissionService` (Adapter), manages observables and actions (status toggle, soft delete, reply).
  - Handles automated transitions: `new -> read` on view contact, and `* -> resolved` on reply action.
- `FeedbackListUIComponent` (Dumb): Pure structural Tailwind list that accepts inputs of submissions and emits output actions for delete/status/view.
- **Rationale:** Constitution Principle IV explicitly mandates this layer separation.
