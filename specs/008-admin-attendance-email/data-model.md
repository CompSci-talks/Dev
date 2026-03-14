# Data Model: Admin Attendance Emailing

## Entities

### Attendee (Projection)
Represent a user who has marked attendance for a seminar.
- `id`: string (UUID)
- `name`: string
- `email`: string
- `markedAt`: Date
- `status`: 'confirmed' | 'pending' | 'attended'

### AttendanceFilter
State object for the filtering UI.
- `status?`: 'confirmed' | 'pending' | 'attended'
- `searchQuery?`: string
- `dateRange?`: { start: Date, end: Date }

### EmailPayload
The structure sent to the `EmailService`.
- `to`: string[] (list of email addresses)
- `subject`: string
- `body`: string (HTML content from Rich-Text editor)
- `metadata`: { seminarId: string, senderId: string }

## State Transitions

1. **Idle**: Admin views seminar dashboard.
2. **Filtering**: Admin enters criteria, UI updates attendance list.
3. **Composing**: Admin opens draft, populates body with WYSIWYG.
4. **Sending**: System calls `EmailService.send()`.
5. **Complete**: Success/Error message displayed.
