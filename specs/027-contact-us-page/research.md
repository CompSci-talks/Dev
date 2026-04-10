# Research: Contact Us Page

## 1. UI Components for Forms and Buttons (Glassmorphism)

**Decision**: Use native HTML forms and inputs applying existing global semantic Tailwind classes (`.input-field`, `.btn`, `.btn-primary`).

**Rationale**: 
Upon inspecting the codebase (specifically `forgot-password.component.html`), it is evident that the application does not wrap basic form elements into Angular components (`<app-button>`, `<app-input>`). Instead, it relies on centralized styling via global CSS classes defined in the tailwind configuration and global stylesheet. Using `.input-field` for inputs/textareas and `.btn .btn-primary` for the submit button perfectly aligns with the project's glassmorphism UI rules (Constitution check XI) and existing authentication pages without duplicating CSS or building unnecessary Angular component wrappers.

**Alternatives Considered**: 
Building reusable `<app-input>` and `<app-button>` components under `src/app/core/shared/components`. Rejected because it would introduce a new pattern that differs from the existing Auth views, violating consistency.

## 2. Firestore Adapter Pattern for Submissions

**Decision**: Create an `IContactSubmissionService` interface in `src/app/core/contracts/` and a concrete `FirebaseContactSubmissionService` in `src/app/firebase-adapters/`.

**Rationale**:
The codebase's Constitution (Rule I & III) strictly mandates the Adapter pattern and "Interface-First Development." By creating a clear `IContactSubmissionService` contract, the contact form component remains completely decoupled from Firestore. The concrete `FirebaseContactSubmissionService` will then inject AngularFire to perform the `addDoc` operation to the `contact_submissions` collection. 

**Alternatives Considered**: 
Injecting `Firestore` directly into the `ContactComponent`. Rejected because it explicitly violates Constitution Rule I (Separation of Concerns via Adapter Pattern) which states "No component or service may directly import or reference a specific provider SDK."
