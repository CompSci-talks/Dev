# Phase 0: Research for Repliable Comments

## Unknown: UI Layout for Nested Replies

- **Decision**: Render sub-replies directly below the parent comment, visibly indented, but without nested `app-comment-list` components if possible to keep performance high.
- **Rationale**: Single-level nesting means we can simply sort comments such that a parent is followed by all its children chronologically. We don't need deeply recursive component trees. The UI just checks if `comment.parent_id` is truthy, applies an `ml-8` (margin-left) class, and renders it.
- **Alternatives considered**: Recursive component trees (rejected due to complexity over-indexing for a strict 1-level limit).

## Unknown: Reply State Management

- **Decision**: The `app-comment-list` component will emit a `replyInitiated` event with the target `parent_id`. The smart `app-comments-container` will capture this and pass the `activeReplyId` down to the `app-comment-list` or specific comment instances, rendering a localized `app-comment-form` for that specific thread.
- **Rationale**: Keeps the dumb components pure. The container holds the state of "which comment are we currently replying to" and binds it.
- **Alternatives considered**: Passing a service into `app-comment-list` (rejected due to constitution boundary rules against smart logic in dumb components).

## Unknown: Real-time Supabase Replication for Replies

- **Decision**: No structural changes to Postgres Realtime needed. The existing `public:comments` channel listens to all `INSERT` events matching the `seminar_id`. 
- **Rationale**: The `parent_id` comes down with the payload automatically. The Angular service will simply prepend/append it to the local Subject as normal, and the UI's structural sorting will place it where it belongs.
- **Alternatives considered**: Dedicated realtime filters for replies (rejected as unnecessary).
