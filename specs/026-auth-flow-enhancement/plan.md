# Implementation Plan: Auth Flow Enhancement

**Branch**: `026-auth-flow-enhancement` | **Date**: 2026-04-03 | **Spec**: [026-auth-flow-enhancement/spec.md](file:///D:/website/compscitalks/specs/026-auth-flow-enhancement/spec.md)

## Summary
Enhance the authentication experience by enforcing mandatory email verification and providing a custom, in-app password reset flow. This replaces default Firebase UI with a cohesive, glassmorphic experience consistent with the platform's design language.

## Technical Context
- **Language/Version**: TypeScript / Angular 21
- **Primary Dependencies**: `@angular/fire`, `firebase-admin` (for migration)
- **Storage**: Cloud Firestore
- **Testing**: Vitest
- **Target Platform**: Web (Responsive)
- **Project Type**: Web Application
- **Constraints**: Spark Tier Firebase (No custom domains for native action links; using in-app redirection).

## Constitution Check
- **Principle I (Adapter Pattern)**: **PASS**. All auth logic is encapsulated in `FirebaseAuthService` implementing `IAuthService`.
- **Principle II (Vertical Slicing)**: **PASS**. Auth pages and services are contained within `auth` and `core` feature slices.
- **Principle III (Interface-First)**: **PASS**. `IAuthService` was extended before implementation.
- **Principle VII (Strict Typing)**: **PASS**. `User` model updated to include `email_verified` and administrative timestamps.

## Proposed Changes

### Core Logic
#### [MODIFY] [IAuthService](file:///d:/website/compscitalks/src/app/core/contracts/auth.interface.ts)
- Add `sendPasswordResetEmail`, `verifyPasswordResetCode`, and `confirmPasswordReset` methods.

#### [MODIFY] [FirebaseAuthService](file:///d:/website/compscitalks/src/app/firebase-adapters/firebase-auth.service.ts)
- Implement password reset methods using Firebase Auth SDK.
- Update `mapFirebaseUser` to sync `emailVerified` state.
- Add `reloadUser` method for polling support.

#### [MODIFY] [AuthGuard](file:///d:/website/compscitalks/src/app/core/auth.guard.ts)
- Implement strict redirection to `/verify-email` for unverified users.

### UI Components
- [x] T005 Implement 5s auto-polling with `distinctUntilChanged` for stability.
- [x] T006 Add 60s resend cooldown.
- [x] T007 [NEW] Add status-based "Spam Folder" alert (Design: Warning yellow, centered below action button).

#### [MODIFY] [RegisterComponent](file:///d:/website/compscitalks/src/app/auth/pages/register/register.component.ts)
- [x] T007b Trigger `sendVerificationEmail()` and redirect to `/verify-email` upon successful registration (FR-003).

#### [NEW] [ForgotPasswordComponent](file:///d:/website/compscitalks/src/app/auth/pages/forgot-password/forgot-password.component.ts)
- [x] T008 Request password reset links (Design: Glassmorphic card, max-width 450px).

#### [NEW] [ResetPasswordComponent](file:///d:/website/compscitalks/src/app/auth/pages/reset-password/reset-password.component.ts)
- [x] T009 Handle `oobCode` verification and password update.

#### [MODIFY] [LoginComponent](file:///d:/website/compscitalks/src/app/auth/pages/login/login.component.ts)
- [x] T009b Add "Forgot Password?" link adjacent to password field (FR-005).

### Migration & Admin
#### [NEW] [verify-all-users.js](file:///d:/website/compscitalks/scripts/verify-all-users.js)
- Bulk-verify existing users in Firebase Auth and sync to Firestore.

## Verification Plan

### Automated Tests
- Run `npm test` to verify `FirebaseAuthService` unit tests.

### Manual Verification
1.  **Strict Guard**: Attempt to access `/dashboard` without verification; expect redirect to `/verify-email`.
2.  **Verified User Logic**: Manually access `/verify-email` as a verified user; expect redirect to `/dashboard`.
3.  **Polling Stability**: Watch the `/verify-email` page for 30s; ensure the email text does not flicker.
4.  **Password Reset Flow**: Request link -> Open in-app -> Update password -> Login successfully.
