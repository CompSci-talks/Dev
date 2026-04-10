# Quickstart: Contact Us Page

This guide provides immediate context for implementing the Contact Us feature based on the Phase 1 design.

## Core Concepts

1. **Adapter Pattern**: You must implement the backend persistence using the `IContactSubmissionService` interface. You must *never* inject `Firestore` directly into the UI components.
2. **Glassmorphism UI**: Do not build custom Angular Wrappers for inputs or buttons. Use native HTML elements with standard Tailwind semantic classes (e.g., `.input-field`, `.btn`, `.btn-primary`).
3. **No Outbound Email**: Despite the project having a `FirebaseEmailService`, this feature *only* performs a Firestore `addDoc` operation to a `contact_submissions` collection. No email is dispatched.

## Expected Implementation Layers

1. **Models/Contracts (`src/app/core/contracts`)**: The `contact-submission.interface.ts` containing the TS definitions.
2. **Firebase Adapter (`src/app/firebase-adapters/`)**: Concrete `FirebaseContactSubmissionService` that implements `IContactSubmissionService` and injects Firestore to write to `contact_submissions`.
3. **Angular Providers (`src/app/app.config.ts`)**: Bind the interface token to the concrete adapter class.
4. **UI Component (`src/app/contact/`)**: A lazy-loaded standalone component at `src/app/contact`. It injects `IContactSubmissionService` to submit standard Reactive Angular Forms.

## Important Constraints

- Hard stop on the message field at 1000 characters.
- Must display success directly on the page, with a "Send another message" inline reset action.
- Ensure the `isDeleted` flag is explicitly set to `false`, and `status` to `'new'` on the outbound payload to the interface.
