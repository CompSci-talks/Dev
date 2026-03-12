# Quickstart: Phase 2 — Admin Dashboard

This guide helps you set up and verify the Admin features in the development environment.

## 1. Local Mock Setup
1. Open `src/app/app.config.ts`.
2. Ensure `MockAuthService` is providing an Admin user with `role: 'admin'`.
3. The `MockSemesterService` and `MockSeminarService` are automatically wired for local development.

## 2. Navigating to Admin Dashboard
1. Log in with an admin account.
2. Navigate to `http://localhost:4200/admin`.
3. Use the Sidebar to switch between **Semesters**, **Seminars**, and **Moderation**.

## 3. Verification Steps
- **Create a Semester**: Add "Fall 2026", set dates, and toggle "Active".
- **Check Public Portal**: Navigate to `/schedule` and verify only "Fall 2026" talks appear.
- **Moderate Comments**: Go to `/admin/moderation`, find a comment, and click "Hide". Verify it disappears from the Seminar Room.

## 4. Troubleshooting
- **Guard Redirect**: If you are redirected from `/admin` to `/login`, check that your `currentUser$` has `role: 'admin'`.
- **Upload Failures**: Real material uploads require the `SupabaseMaterialAdapter` and valid Google API keys in `environment.ts`. Use the "Direct URL" fallback for testing without keys.
