# Data Model: Comments

## Entities

### Comment
Replaces the legacy `Question` entity representing user-generated text on a seminar.

**Fields:**
- `id` (string): Unique identifier.
- `text` (string): The body of the comment.
- `authorId` (string): Reference to the `User` who posted it.
- `authorName` (string): Display name of the user for immediate rendering.
- `seminarId` (string): Reference to the `Seminar` this comment is attached to.
- `createdAt` (Date | string): Timestamp of submission.

**Validation Rules:**
- `text` MUST NOT be empty or purely whitespace length > 0 (FR-005).

**Differences from legacy `Question` (Assumed):**
- Removing concepts like `isAnswered` or `upvotes` if they existed in the Q&A context, as this is a flat comment feed.
