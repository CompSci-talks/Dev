# Data Model: ContactUsModeration Dashboard

## Entities

### ContactSubmission
Represents a message sent via the public "Contact Us" form, now including fields for administrative moderation.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier (Firestore document ID) |
| `name` | `string` | Submitter's full name |
| `email` | `string` | Submitter's email address |
| `subject` | `string` | One of: 'General Feedback', 'Bug Report', 'Speaker Suggestion', 'Other' |
| `message` | `string` | The full body text of the submission |
| `submitterUid` | `string \| null` | UID if the user was authenticated during submission |
| `createdAt` | `Timestamp` | Server-side timestamp of submission |
| `status` | `string` | Moderation state: 'new' (default), 'read', 'resolved' |
| `isDeleted` | `boolean` | Soft-deletion flag (hidden from UI if true) |

## State Transitions

### `status`
- **new**: Initial state upon submission.
- **read**: Set when an admin opens the detail view/slide-over.
- **resolved**: Set when the admin has addressed the inquiry or replied.

### `isDeleted`
- **false**: Visible in the moderation dashboard list (default).
- **true**: Permanently hidden from the admin dashboard UI.

## Validation Rules
- **Subject**: Must match one of the predefined categories.
- **Message**: Required, non-empty.
- **Email**: Must be a valid email format (validated on submission).
- **Fetch Limit**: The dashboard list will only query for the 50 most recent records where `isDeleted == false`.
