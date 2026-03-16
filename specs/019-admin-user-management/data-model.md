# Data Model: Admin User Management

This document defines the entities and relationships for the Admin User Management feature.

## 1. UserProfile (Extended)

Represents basic user identity and administrative metadata.

| Field | Type | Description |
|-------|------|-------------|
| `uid` | `string` | Unique identifier (Firebase Auth UID) |
| `displayName` | `string` | User's visible name |
| `email` | `string` | User's primary email address |
| `role` | `'admin' \| 'moderator' \| 'authenticated'` | System-wide permissions |
| `photoURL` | `string` | URL to user's profile image |
| `createdAt` | `Timestamp \| Date` | Registration timestamp |
| `lastActiveTimestamp` | `Timestamp \| Date` | Last activity recorded in system |
| `preferredTopicIds` | `string[]` | IDs of Tag entities (topics of interest) |
| `attendanceCount` | `number` | Aggregated count of attended seminars |

## 2. SeminarAttendance

Represents a link between a user and a seminar event.

| Field | Type | Description |
|-------|------|-------------|
| `uid` | `string` | Unique identifier for the attendance record |
| `userUid` | `string` | Reference to UserProfile.uid |
| `seminarUid` | `string` | Reference to Seminar.uid |
| `seminarTitle` | `string` | Denormalized title for quick display |
| `date` | `Timestamp \| Date` | Date of the seminar |
| `role` | `'attendee' \| 'speaker' \| 'moderator'` | User's role in the specific seminar |

## 3. Relationships

- **UserProfile 1:N SeminarAttendance**: One user can attend many seminars.
- **Seminar 1:N SeminarAttendance**: One seminar has many attendees.
- **UserProfile 1:N PreferredTopicIds**: A user can have multiple topic preferences referencing the `Tags` collection.
