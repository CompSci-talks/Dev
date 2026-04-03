# Data Model: Authentication & Verification

## Existing Entity: User
The feature uses the existing `User` model defined in `src/app/core/models/user.model.ts`.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique Firebase UID |
| email | string | User's email address |
| email_verified | boolean | **CRITICAL**: Updated via `reloadUser()` to reflect Firebase status. |
| role | UserRole | Permissions level (admin/moderator/authenticated). |

## Transient UI State (Verification)
Managed within `VerifyEmailComponent`.

| State | Type | Description |
|-------|------|-------------|
| isResending | boolean | Loading state for the resend request. |
| resendCooldown | number | Seconds remaining (0-60) before next allowed resend. |
| isPollingActive | boolean | Whether the 5s status check is running. |

## Transient UI State (Password Reset)
Managed within `ResetPasswordComponent`.

| State | Type | Description |
|-------|------|-------------|
| oobCode | string | The action code extracted from URL. |
| email | string | The email associated with the reset code (verified via `verifyPasswordResetCode`). |
| isSubmitting | boolean | Loading state for the password update. |
