# Research: Admin User Management

## Decision 1: Firestore Pagination Strategy
**Decision**: Use `query.startAfter()` or `query.limit()` with a cursor-based approach.
**Rationale**: Firestore does not support traditional offset pagination efficiently (you pay for all skipped documents). Cursor-based pagination is the standard and most performant way to handle large collections.
**Alternatives considered**: 
- **Offset pagination**: Rejected due to cost and performance issues at scale.
- **Client-side pagination**: Rejected because the user list could grow beyond a reasonable size for the client to handle efficiently.

## Decision 2: Reusable Logic in Core
**Decision**: Create standalone components for `Pagination` and `Filter` in `src/app/core/shared/components`.
**Rationale**: These are purely presentational/coordinating components (Dumb Components) that can be reused across different feature lists (e.g., Attendees, User Management).
**Alternatives considered**:
- **Logic-only Service**: Rejected because UI consistency is just as important as logic consistency in this project.

## Decision 3: Role Management
**Decision**: Use Firestore document-based roles (e.g., `users/{uid}/role`) combined with Firebase Auth custom claims if necessary for security.
**Rationale**: Easier to manage and query within the application dashboard.
**Alternatives considered**:
- **Custom Claims ONLY**: Harder to list all admins/users efficiently without a server-side SDK.

## Decision 4: Multi-Recipient Email
**Decision**: Pass a list of email strings to the `EmailService.openComposer(recipients: string[])` method.
**Rationale**: Consistent with how the attendee email feature was intended to work.
**Alternatives considered**:
- **Direct Mailgun/SendGrid integration**: Rejected to follow the "No Custom Backend" principle (Constitution VI).
