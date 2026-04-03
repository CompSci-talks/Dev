# Data Model: Authentication Enhancement

## Updated Entities

### User
The `User` entity has been extended to include fields necessary for verification states and administrative tracking.

| Field | Type | Description |
|-------|------|-------------|
| `email_verified` | boolean | Live status from Firebase Auth. |
| `last_login` | Timestamp/Date | Last successful sign-in time. |
| `last_active_timestamp` | Timestamp/Date | Last interaction with the platform. |

## Identity & Uniqueness
- **UID**: The primary key is the Firebase Authentication `uid`.
- **DisplayName**: Captured during signup and synchronized to both Auth Profile and Firestore doc.

## Lifecycle Transitions
1. **Unverified**: Status immediately after registration. Access restricted by `authGuard`.
2. **Verified**: Successfully clicked link or bulk-verified by administrator. Full access granted.
