# Phase 1: Data Model & Contracts

## Entity Structure

### `Comment`

The domain entity mapping user feedback, questions, and replies to Seminars.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` (UUID) | Yes | Primary key |
| `seminar_id` | `string` (UUID) | Yes | Foreign key reference to the parent Seminar |
| `author_id` | `string` (UUID) | Yes | Foreign key reference to the creating User |
| `text` | `string` | Yes | The body of the comment/reply. Must not be empty whitespace. |
| `created_at` | `Date` (ISO) | Yes | Timestamp of insertion |
| `is_hidden` | `boolean` | Yes | Moderation flag; defaults to false |
| `parent_id` | `string` (UUID) | No | **[NEW]** Foreign key reference to another `Comment`. If present, this comment is a reply. |

## Interface Contracts

### `ICommentService` Updates

The core service interface requires an update to accept an optional `parentId` argument when submitting a new comment.

```typescript
export interface ICommentService {
    getCommentsForSeminar$(seminarId: string): Observable<Comment[]>;
    
    // Updated signature:
    submitComment(seminarId: string, text: string, parentId?: string): Observable<Comment>;
}
```

The underlying mock and Supabase adapters must implement this updated signature.

## Component Input/Output Contracts

### `CommentsContainerComponent` (Smart)
- **State**: Tracks `activeReplyId: string | null`.
- **Logic**: Injects `ICommentService`. Handles `onReplySubmitted(text, parentId)`.

### `CommentListComponent` (Dumb)
- **Inputs**: `@Input() comments: Comment[]`, `@Input() activeReplyId: string | null`
- **Outputs**: `@Output() replyClicked = new EventEmitter<string>()` (emits parent ID).

### `CommentFormComponent` (Dumb)
- **Inputs**: `@Input() isReply: boolean`, `@Input() parentId?: string`
- **Outputs**: `@Output() commentSubmitted = new EventEmitter<{text: string, parentId?: string}>()`
