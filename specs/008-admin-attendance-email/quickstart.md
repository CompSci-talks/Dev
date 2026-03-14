# Quickstart: Admin Attendance Emailing

## Prerequisites
- Branch: `008-admin-attendance-email`
- Implementation Plan: [plan.md](file:///d:/website/compscitalks/specs/008-admin-attendance-email/plan.md)

## Development Setup

1. **Service Interfaces**:
   - Define `AttendanceService` in `src/app/admin/services/attendance.service.ts`.
   - Define `EmailService` in `src/app/admin/services/email.service.ts`.

2. **Mock Implementation**:
   - Extend `MockSeminarService` to return mock attendees.
   - Implement `MockEmailAdapter` in `src/app/core/adapters/email/mock-email.adapter.ts` that logs to the console.

3. **Routing**:
   - Add `{ path: 'seminar/:id/attendance', component: AttendancePageComponent }` to admin routes.

4. **Libraries**:
   - Install `ngx-quill` for the rich-text editor components.

## Verification
- Run local dev server.
- Login as `admin@example.com`.
- Select a seminar, click "Attendance".
- Verify list filtering and email sending (via console logs).
