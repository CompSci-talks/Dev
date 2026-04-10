# Data Model: Contact Us Page

## Entities

### `ContactSubmission`

Represents a single message sent via the Contact Us form.

#### Fields
| Name | Type | Description |
|------|------|-------------|
| `id` | `string` | Auto-generated document ID in Firestore. |
| `name` | `string` | The submitter's name. Required. |
| `email` | `string` | The submitter's email address. Required. Must be a valid email format. |
| `subject` | `SubjectCategory` | Category enum. Required. |
| `message` | `string` | The message body. Required. Min 20 chars, max 1000 chars. |
| `createdAt` | `Timestamp` | Standard Firestore timestamp of when the submission occurred. |
| `status` | `SubmissionStatus` | The processing state. Initializes as `new`. |
| `isDeleted` | `boolean` | Soft-delete flag. Initializes as `false`. |
| `submitterUid` | `string \| null` | Populated with the user's UID if they were authenticated at the time of submission, else null. |

#### Enums

```typescript
export type SubjectCategory = 'General Feedback' | 'Bug Report' | 'Speaker Suggestion' | 'Other';
export type SubmissionStatus = 'new' | 'read' | 'resolved';
```

## Validation Rules
- `name`: Must not be empty.
- `email`: Must match a valid email format.
- `subject`: Must be one of the `SubjectCategory` enum values.
- `message`: Length must be between 20 and 1000 characters inclusive.
- `status`: Must be `'new'` on creation.

## State Transitions (Future Admin Use)
While this feature only handles the initial creation state, future features will support State Transitions for `status` (`new` -> `read` -> `resolved`) and `isDeleted` (`false` -> `true`). The schema natively supports these transitions without needing migrations.
