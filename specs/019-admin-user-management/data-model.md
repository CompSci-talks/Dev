# Data Model: Admin User Management

## User Profile
- **uid**: `string` (Primary Key, matches Firebase Auth UID)
- **displayName**: `string`
- **email**: `string`
- **role**: `'admin' | 'user' | 'moderator'`
- **photoURL**: `string` (optional)
- **createdAt**: `Timestamp`
- **lastLogin**: `Timestamp`

## User Activity
- **id**: `string`
- **userId**: `string` (Foreign Key to User)
- **type**: `'seminar_attendance' | 'comment_posted' | 'comment_replied' | 'profile_updated'`
- **targetId**: `string` (ID of the related seminar or comment)
- **timestamp**: `Timestamp`
- **metadata**: `Record<string, any>` (e.g., seminar title, comment snippet)

## Relationships
- **User** (1) <---> (N) **Seminar Attendance**
- **User** (1) <---> (N) **Comments**
- **User** (1) <---> (N) **Activity Logs**
