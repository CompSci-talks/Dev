# Research: Auth Flow Optimization

## Decisions

### 1. In-App Password Reset
- **Decision**: Implement custom Angular components (`ForgotPassword`, `ResetPassword`) instead of using Firebase's default hosted pages.
- **Rationale**: Maintains the platform's **glassmorphic design** and keeps the user within the application context.
- **Alternatives**: Firebase Default Action URL (Rejected for poor branding/UX).

### 2. Auto-Polling for Verification
- **Decision**: Use a 5-second polling interval using `rxjs` `interval` and `auth.currentUser.reload()`.
- **Rationale**: Provides a seamless "instant" transition once the user clicks the email link in another tab, without requiring a manual refresh.
- **Alternatives**: Manual "Refresh" button only (Rejected as less intuitive).

### 3. Bulk Verification via Admin SDK
- **Decision**: Create a Node.js script using `firebase-admin` to update existing users.
- **Rationale**: Efficiently handles migration of test accounts that were created before the mandatory verification requirement.

## External Documentation
- [Firebase Auth: Manage Users](https://firebase.google.com/docs/auth/admin/manage-users)
- [AngularFire: Authentication](https://github.com/angular/angularfire/blob/master/docs/auth/getting-started.md)
