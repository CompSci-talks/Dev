# Feature Specification: Auth Flow Enhancement

**Feature Branch**: `026-auth-flow-enhancement`  
**Created**: 2026-04-03  
**Status**: Draft  
**Input**: User description: "integrate the flow of authentication with verification and forgot password through the firebase"

## Clarifications

### Session 2026-04-03
- Q: Clarify strictness of verification redirect. → A: Users MUST be redirected to `/verify-email` from ANY route (including Landing Page) if not verified and logged in.
- Q: Clarify password reset UI flow. → A: The reset link should lead to a custom in-app form (New/Confirm Password). [Spark tier compatible]
- Q: Clarify verification status check strategy. → A: Automatic polling every 5 seconds while on the Verification page.
- Q: Clarify resend verification cooldown. → A: 60-second cooldown timer active after each "Resend" click.
- Q: Clarify post-reset action. → A: Redirect to Login page with a success message after successful password reset.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Email Verification Flow (Priority: P1)

As a new user, I want to receive an email verification link after signing up so that I can confirm my identity. If I am logged in but unverified, I must be strictly redirected to the verification page whenever I attempt to access any other route.

**Why this priority**: Correct identity verification is critical for security. The strict redirect ensures users cannot bypass verification to access application features.

**Independent Test**: Register a new account. System should redirect to `/verify-email`. Receive an email from Firebase. Click the link. Return to the site; the system should automatically (within 5s) detect the verification and allow access to the dashboard.

**Acceptance Scenarios**:

1. **Given** I am on the registration page, **When** I successfully sign up, **Then** I am redirected to the `/verify-email` page and a verification email is sent automatically.
2. **Given** I am on the `/verify-email` page, **When** I click "Resend Email", **Then** a new verification email is sent and a 60-second cooldown is enforced on the button.
3. **Given** I have clicked the verification link in my email, **When** I wait for the next auto-polling cycle, **Then** I am automatically redirected to the home page (or dashboard) as a verified user.

---

### User Story 2 - Password Reset Flow (Priority: P1)

As a user who has forgotten my password, I want to request a password reset link. Clicking the link should prompt me to enter and confirm a new password to recover my account.

**Why this priority**: Password recovery is a fundamental requirement. Providing a clear reset form ensures a smooth recovery experience.

**Independent Test**: Navigate to `/login`. Click "Forgot Password?". Enter a valid email address and submit. Receive a custom reset link. Click it, set a new password on the in-app form. Successfully log in with the new password.

**Acceptance Scenarios**:

1. **Given** I am on the login page, **When** I click the "Forgot Password?" link, **Then** I am taken to the `/auth/forgot-password` page.
2. **Given** I have entered my email on the forgot password page, **When** I click "Send Reset Link", **Then** system-wide notification confirms the email was sent if the account exists.
3. **Given** I have received the reset email, **When** I follow the link to the custom `/auth/reset-password` page, **Then** I can set a new password and subsequently log in using the new credentials.

---

### Edge Cases

- **Invalid Email on Reset**: If a user enters an email that doesn't exist, the system should still show a generic "If an account matches this email, a reset link has been sent" for security (preventing account enumeration).
- **Expired Verification Link**: If a user clicks an old verification link, Firebase handles the error, but our app should handle the re-check gracefully.
- **Unverified User accessing Dashboard**: The `authGuard` should catch any attempt to access `/dashboard` or `/profile` and redirect to `/verify-email`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `IAuthService` MUST include a `sendPasswordResetEmail(email: string)` method.
- **FR-002**: `FirebaseAuthService` MUST implement Firebase's `sendPasswordResetEmail` functionality.
- **FR-003**: `RegisterComponent` MUST trigger `sendVerificationEmail()` immediately upon successful account creation.
- **FR-004**: System MUST provide a dedicated `ForgotPasswordComponent` with a clean, responsive UI.
- **FR-005**: `LoginComponent` MUST feature a clearly visible "Forgot Password?" link near the password field.
- **FR-006**: `VerifyEmailComponent` UI MUST be optimized for UX, following the project's glassmorphism/premium design language.

### Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can request a password reset from the login page in under 3 clicks.
- **SC-002**: Password reset and email verification emails are delivered within 60 seconds of request (depending on mail provider/Firebase).
- **SC-003**: 100% of unverified users are blocked from `/dashboard` and redirected to `/verify-email` via `authGuard`.
- **SC-004**: Users report the verification/forgot-password experience as seamless and visually consistent with the rest of the application.
