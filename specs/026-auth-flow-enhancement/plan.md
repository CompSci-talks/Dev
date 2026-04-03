# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

The goal is to integrate a robust authentication flow including strict email verification and a custom in-app password reset experience using Firebase. This involves updating the `IAuthService` interface, implementing missing reset logic in `FirebaseAuthService`, and creating/updating UI components for verification and recovery while enforcing strict route guarding.

## Proposed Changes

### Core & Infrastructure
- [MODIFY] [auth.interface.ts](file:///d:/website/compscitalks/src/app/core/contracts/auth.interface.ts)
  - Add `sendPasswordResetEmail(email: string): Observable<void>`
  - Add `verifyPasswordResetCode(code: string): Observable<string>`
  - Add `confirmPasswordReset(code: string, newPassword: string): Observable<void>`
- [MODIFY] [firebase-auth.service.ts](file:///d:/website/compscitalks/src/app/firebase-adapters/firebase-auth.service.ts)
  - Implement new interface methods using Firebase `sendPasswordResetEmail`, `verifyPasswordResetCode`, and `confirmPasswordReset`.
- [MODIFY] [auth.guard.ts](file:///d:/website/compscitalks/src/app/core/auth.guard.ts)
  - Implement strict redirection: If `user` is logged in but `!email_verified`, redirect to `/verify-email`.
- [MODIFY] [app.routes.ts](file:///d:/website/compscitalks/src/app/app.routes.ts)
  - Register new routes: `/auth/forgot-password` and `/auth/reset-password`.

---

### UI Components
- [MODIFY] [login.component.html](file:///d:/website/compscitalks/src/app/auth/pages/login/login.component.html)
  - Add "Forgot Password?" link below the password field.
- [NEW] [forgot-password.component.ts](file:///d:/website/compscitalks/src/app/auth/pages/forgot-password/forgot-password.component.ts)
  - Form to input email and trigger reset link.
- [NEW] [reset-password.component.ts](file:///d:/website/compscitalks/src/app/auth/pages/reset-password/reset-password.component.ts)
  - Extract `oobCode` from URL, verify it, and provide new/confirm password fields.
- [MODIFY] [verify-email.component.ts](file:///d:/website/compscitalks/src/app/portal/pages/verify-email/verify-email.component.ts)
  - Add `interval(5000)` polling that calls `authService.reloadUser()`.
  - Implement 60s cooldown for the "Resend" button using a local timer.

## Verification Plan

### Automated Tests
- **Unit Test**: Create `src/app/firebase-adapters/firebase-auth.service.spec.ts` to verify the reset logic (mocking Firebase SDK).
- **Command**: `npm test -- --include src/app/firebase-adapters/firebase-auth.service.spec.ts`

### Manual Verification
1. **Verification Check**: Login with unverified account -> Verify redirect to `/verify-email`. Try to go to `/archive` -> Verify redirect back to `/verify-email`.
2. **Polling**: While on `/verify-email`, click verification link in another tab -> Verify app automatically detects and redirects to Home.
3. **Cooldown**: Click "Resend Email" -> Verify button disabled for 60s with a countdown.
4. **Password Reset**: Click "Forgot Password" on login -> Enter email -> Click link in email -> Enter new password -> Verify success redirect to login.

## Technical Context

**Language/Version**: TypeScript / Angular 17+  
**Primary Dependencies**: @angular/fire (Firebase v10+), RxJS  
**Storage**: Firebase Authentication, Firestore (for user profile)  
**Testing**: Jasmine/Karma (existing)  
**Target Platform**: Web Browser  
**Project Type**: Web Application  
**Performance Goals**: < 1s for auth state transitions, < 5s for verification polling updates.  
**Constraints**: Firebase Spark (Free) tier compatibility; Standard 60s cooldown for email resending.  
**Scale/Scope**: All authenticated users; 3-4 key screens (Login, Signup, Verify, Reset).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Principle I (Adapter Pattern)**: Changes to `IAuthService` ensure UI remains decoupled from `FirebaseAuth`.
- [x] **Principle II (Vertical Slicing)**: Authentication logic is contained within the `auth` and `core` layers.
- [x] **Principle V (Auth-Gating)**: Directly addresses the requirement for strict verification checks in `authGuard`.
- [x] **Principle VI (Zero-Cost)**: Verified compatible with Firebase Spark tier.
- [x] **Principle XI (Centralized Styling)**: New components will use existing design tokens and glassmorphism styles.

## Project Structure

### Documentation (this feature)

```text
specs/026-auth-flow-enhancement/
├── plan.md              # This file
├── research.md          # Implementation details for custom reset link
├── data-model.md        # User state and Verification state
├── quickstart.md        # How to test the new flows
├── contracts/           # Updated IAuthService
└── tasks.md             # Actionable task list
```

### Source Code (repository root)

```text
src/app/
├── auth/
│   └── pages/
│       ├── login/               # Add "Forgot Password" link
│       ├── register/           # Update redirect logic
│       ├── forgot-password/    # [NEW] Request reset email
│       └── reset-password/     # [NEW] Confirm new password
├── portal/
│   └── pages/
│       └── verify-email/       # Add polling and cooldown
├── core/
│   ├── contracts/
│   │   └── auth.interface.ts   # Update with reset methods
│   └── auth.guard.ts           # Update strict redirect logic
└── firebase-adapters/
    └── firebase-auth.service.ts # Implement new methods
```

**Structure Decision**: Angular-based feature slicing as per existing project layout. New auth-related recovery components will live in `src/app/auth/pages`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
