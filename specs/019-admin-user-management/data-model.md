# Data Model: Admin User Management

## Entities

### UserProfile (Core)
- **uid**: string (Primary Key)
- **displayName**: string
- **email**: string
- **role**: 'admin' | 'user'
- **lastActiveTimestamp**: Timestamp
- **preferredTopicAreas**: string[]
- **createdAt**: Timestamp

### SeminarAttendance
- **userId**: string (Foreign Key to UserProfile.uid)
- **seminarId**: string (Foreign Key to Seminar.id)
- **timestamp**: Timestamp
- **attended**: boolean

### Seminar (Reference)
- **id**: string
- **title**: string
- **date_time**: Timestamp
- **location**: string

## Relationships
- **UserProfile** has-many **SeminarAttendance**
- **UserProfile** has-many **Comments** (stored in `seminars/{id}/comments`)

## Validation Rules
- **Role**: Must be either 'admin' or 'user'.
- **Self-Demotion Prevention**: The active user's UID must not match the UID being demoted if the active user is the only admin (soft check in UI/Guard).
