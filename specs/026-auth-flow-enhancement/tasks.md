# Tasks: Auth Flow Enhancement

**Input**: Design documents from `/specs/026-auth-flow-enhancement/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

## Phase 1: Setup (Shared Infrastructure)
- [x] T001 Initialize feature branch and specification directory <!-- US1 -->

## Phase 2: Foundational (Blocking Prerequisites)
- [x] T002 Extend `IAuthService` with password reset and reload methods (FR-001) <!-- US2 -->
- [x] T003 Implement password reset and user reload in `FirebaseAuthService` (FR-002) <!-- US2 -->
- [x] T004 Update `AuthGuard` to enforce `email_verified` check (SC-003) <!-- US1 -->

---

## Phase 3: User Story 1 - Mandatory Email Verification (Priority: P1) 🎯 MVP
**Goal**: Ensure all attendees are verified before accessing the portal.

- [x] T005 Implement 5s polling and 60s cooldown in `VerifyEmailComponent` (FR-006)
- [x] T006 Add prominent spam folder alert to `verify-email.component.html` (FR-006)
- [x] T007 Implement auto-redirect from `/verify-email` to `/dashboard` if user is already verified (Acceptance Scenario 4)
- [x] T007b Update `RegisterComponent` to trigger `sendVerificationEmail` and redirect to `/verify-email` (FR-003)

---

## Phase 4: User Story 2 - Custom Password Recovery (Priority: P2)
**Goal**: Replace Firebase default reset pages with in-app components.

- [x] T008 Implement `ForgotPasswordComponent` for reset link requests (FR-004)
- [x] T009 Implement `ResetPasswordComponent` for code-based password updates (FR-004)
- [x] T009b Add "Forgot Password?" link to `LoginComponent` template (FR-005)

---

## Phase 5: User Story 3 - Administrative Synchronization (Priority: P3)
**Goal**: Migrate existing users to a verified state in both Auth and Firestore.

- [x] T010 Create and run `scripts/verify-all-users.js` migration script

---

## Phase N: Polish & Verification
- [x] T011 Fix Vitest compatibility for `FirebaseAuthService.spec.ts`
- [x] T012 Resolve metadata linter errors across all auth components
- [x] T013 Verify glassmorphic styling consistency for new pages

---

## Execution Strategy
1. **MVP**: Complete US1 (T005-T007).
2. **Feature parity**: Complete US2 (T008-T009).
3. **Migration**: Complete US3 (T010).
4. **Validation**: Run all tests and manual E2E check.
