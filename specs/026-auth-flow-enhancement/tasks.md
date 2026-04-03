# Tasks: Auth Flow Enhancement Implementation

## Phase 1: Core Logic & Routing
1. [ ] Update `IAuthService` contract with password reset methods <!-- id: 100 -->
2. [ ] Implement `sendPasswordResetEmail`, `verifyPasswordResetCode`, and `confirmPasswordReset` in `FirebaseAuthService` <!-- id: 101 -->
3. [ ] Update `authGuard` to enforce strict redirection for unverified users <!-- id: 102 -->
4. [ ] Register `/auth/forgot-password` and `/auth/reset-password` in `app.routes.ts` <!-- id: 103 -->

## Phase 2: UI Enhancements (Verification)
5. [ ] Update `VerifyEmailComponent` with auto-polling (5s interval) <!-- id: 104 -->
6. [ ] Implement 60s resend cooldown timer and UI state in `VerifyEmailComponent` <!-- id: 105 -->

## Phase 3: UI Implementation (Password Recovery)
7. [ ] Add "Forgot Password?" link to `LoginComponent` <!-- id: 106 -->
8. [ ] Create `ForgotPasswordComponent` (Request link UI) <!-- id: 107 -->
9. [ ] Create `ResetPasswordComponent` (Apply reset UI with oobCode handling) <!-- id: 108 -->
10. [ ] Update `RegisterComponent` to trigger `sendVerificationEmail()` upon successful signup <!-- id: 112 -->

## Phase 4: Verification & Polishing
10. [ ] Add unit tests for `FirebaseAuthService` reset logic <!-- id: 109 -->
11. [ ] Perform full E2E manual verification of all flows <!-- id: 110 -->
12. [ ] Final design polish (glassmorphism, animations) <!-- id: 111 -->
