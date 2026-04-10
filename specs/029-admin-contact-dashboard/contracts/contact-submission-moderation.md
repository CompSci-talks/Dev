# Contract: ContactUsModeration Service (Moderation Port)

## Service Port: `IContactSubmissionService`
Extends the existing contact submission logic to include administrative moderation capabilities.

### Methods

#### `getSubmissions()`
Retrieves the most recent contact submissions for moderation.
- **Logic**: Filters by `isDeleted == false`, orders by `createdAt` descending.
- **Limit**: Strictly 50 items.
- **Returns**: `Observable<ContactSubmission[]>`

#### `updateStatus(id: string, status: 'new' | 'read' | 'resolved')`
Updates the moderation status of a specific submission.
- **Parameters**: 
  - `id`: The Firestore document ID.
  - `status`: The new status value.
- **Returns**: `Promise<void>`

#### `softDelete(id: string)`
Marks a submission as deleted so it no longer appears in the dashboard.
- **Parameters**:
  - `id`: The Firestore document ID.
- **Returns**: `Promise<void>`

### Injection Token
- **Token**: `CONTACT_SUBMISSION_SERVICE`
- **Location**: `src/app/core/contracts/contact-submission.interface.ts`
