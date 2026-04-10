# Tasks: ContactUsModeration Dashboard

## Phase 2: Core Service Implementation
- [x] Update `IContactSubmissionService` contract in `src/app/core/contracts/contact-submission.interface.ts` [P]
- [x] Implement `getSubmissions` in `FirebaseContactSubmissionService` (limit 50, isDeleted: false)
- [x] Implement `updateStatus` in `FirebaseContactSubmissionService`
- [x] Implement `softDelete` in `FirebaseContactSubmissionService`

## Phase 3: Routing & Basic Dashboard
- [x] Register `/admin/feedback` in `src/app/app.routes.ts`
- [x] [NEW] Create `FeedbackModerationComponent` in `src/app/admin/pages/contact-us-moderation/` (Smart)
  - Implement automated status updates (read on view, resolved on reply)
- [x] Connect `FeedbackModerationComponent` to `CONTACT_SUBMISSION_SERVICE`

## Phase 4: UI Components (Dumb)
- [x] [NEW] Create `FeedbackListUIComponent` in `src/app/admin/components/feedback-list-ui/`
- [x] [NEW] Create `FeedbackDetailUIComponent` in `src/app/admin/components/feedback-detail-ui/`
- [x] Implement status visuals using Tailwind glassmorphism tokens
- [x] Implement status toggle/dropdown in List and Detail views

## Phase 5: Action Bridging & Layout
- [x] Implement "Reply" logic to seed `EmailSelectionService` and route to composer
- [x] Add Sidebar link for "User Feedback" in `AdminLayoutComponent`
- [x] Implement return-to-dashboard path in `EmailComposerPage` (handled via returnUrl)ink

## Phase 6: Verification
- [ ] Unit Test: `FirebaseContactSubmissionService` (query logic)
- [ ] Unit Test: `FeedbackModerationComponent` (state handling)
- [ ] Manual: Verify access control (Admin only)
- [ ] Manual: Verify soft-delete and status update persistence
- [ ] Manual: Verify Slide-over responsive appearance and scrollability
