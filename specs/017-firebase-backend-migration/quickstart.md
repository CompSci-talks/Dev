# Quickstart: Firebase Migration Verification

How to verify the successfully migration of the CompSci Talks backend to Firebase.

## Prerequisites
- Firebase Console access for `compsci-b5aa2`.
- Local development environment (`npm install`).

## Verification Steps

### 1. Infrastructure Check
- [ ] Run `npm run build` to ensure `@angular/fire` is correctly integrated.
- [ ] Inspect `src/app/app.config.ts` to verify providers are correctly injected.

### 2. Authentication Flow
- [ ] Navigate to `/login`.
- [ ] Attempt sign-in with a test Firebase account.
- [ ] Verify that the `AuthStateService` correctly reflects the user profile.
- [ ] Logout and verify the session is cleared in the Firebase console.

### 3. Data Integrity (Public)
- [ ] Open the Schedule page.
- [ ] Verify seminars load from the `seminars` collection.
- [ ] Verify that filters (Tags/Speakers) work using Firestore composite queries.

### 4. Data Integrity (Admin)
- [ ] Log in as an Admin.
- [ ] Create a new Semester.
- [ ] Create a new Seminar and associate a Speaker.
- [ ] Verify that the Seminar document in Firestore contains the denormalized Speaker data.

### 5. Interaction Flow
- [ ] Post a comment on a seminar.
- [ ] Verify the comment appears in the UI and the `comment_count` increments on the Seminar document.
- [ ] Perform an RSVP and verify the `rsvps` collection record.
