# Research

## Technical Context Unknowns

Based on the feature specification for "Refactoring Q&A to Comments" (003), there are no remaining `NEEDS CLARIFICATION` tags. The requirements are straightforward: transition the existing Q&A UI, logic, and data entities to a simpler "Comments" paradigm.

## Key Decisions

### 1. Renaming Entities
- **Decision:** Rename all instances of `Question` to `Comment`.
- **Rationale:** Aligns the frontend codebase semantics with the new user experience, reducing cognitive load and debt. The user explicitly requested "just comments. not Q&A".
- **Impact:** We will need to map `question.model.ts` to `comment.model.ts` and update the properties (e.g., if there were specific "upvote" or "answered" states in the Question model, they may be removed if not needed for simple comments).

### 2. UI Component Refactoring
- **Decision:** Rename and refactor `qa-container`, `qa-form`, and `qa-list` to `comments-container`, `comment-form`, and `comment-list`.
- **Rationale:** Ensures clean vertical slicing and consistency with the new domain terminology.
- **Alternatives considered:** Leaving the component filenames as `qa-*` but changing the display text. Rejected to adhere to clean architecture and self-documenting code principles defined in the Constitution.

### 3. Authentication & Guest Users
- **Decision:** Authenticated users see the comment input field. Unauthenticated users see a "Log in to comment" prompt instead of the input field, but can still view the feed.
- **Rationale:** Required by `FR-004`.
