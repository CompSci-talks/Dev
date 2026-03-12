# Research: Phase 2 — Admin Dashboard

This document consolidates research findings and technical decisions for the Admin Dashboard implementation.

## Decisions & Rationale

### 1. External Material Storage (Google Drive)
- **Problem**: Need to upload and reference materials securely from a serverless frontend.
- **Decision**: Use a **Hybrid Storage Strategy**. 
  - **Primary**: The `SupabaseMaterialAdapter` will implement the `IMaterialService` using the **Google Picker API** for file selection and the **Google Drive API** for uploads via a signed-in Admin session.
  - **Failsafe**: A "Direct URL" field will exist in the `Seminar` model to allow manual link pasting if the automated upload fails or for external resources not hosted by the platform.
- **Rationale**: Keeps infrastructure cost at zero. Using the Picker API avoids the need for a complex custom upload UI.
- **Alternatives Considered**: 
  - *Supabase Storage*: Rejected for large video files (quota limits), though technically simpler.
  - *S3*: Rejected due to potential cost and complexity of IAM management for a small volunteer project.

### 2. Admin Security & Guarding
- **Problem**: Prevent non-admin users from accessing `/admin` routes.
- **Decision**: Implement a **Role-Based Guard** (`AdminGuard`) in `core`.
  - **Mechanism**: The `SupabaseAuthService` will expose a `role$` observable (derived from user metadata or a `user_roles` join).
  - **Flow**: Direct navigation to `/admin` triggers the guard → check role → redirect to `/login` with `returnUrl` if not authorized.
- **Rationale**: Minimal overhead while providing strict URL-level protection.
- **Alternatives Considered**: 
  - *Claims*: Supabase JWT claims are ideal but require database-level configuration (triggers). We will start with a simpler query-based role check abstracted in the adapter.

### 3. Active Semester Filtering
- **Problem**: Portal must automatically show seminars from the "Active Semester".
- **Decision**: **Reactive Contextual Filtering**.
  - **Pattern**: A `GlobalStateService` (or `SemesterService`) will provide an `activeSemester$` observable.
  - **Implementation**: The `SeminarService.getSeminars()` will accept a `semesterId` parameter. Page components will pipe the `activeSemester$` into the seminar fetch stream.
- **Rationale**: Ensures the UI reacts immediately if an admin switches the active semester in another tab (via Supabase Realtime).

## Best Practices

### Google Drive Integration in Angular
- Use the `@types/google.picker` and `@types/gapi` for type safety.
- Initialize the API client in the `AdminModule` constructor or via a dedicated `GoogleDriveService`.
- **Security Check**: Ensure the API Key is restricted to the specific domain in the Google Cloud Console.

### Admin UI (Tailwind)
- Use a distinct Sidebar/Shell for the admin area to provide a "professional dashboard" feel.
- Implement "Optimistic UI" for moderation tasks (hiding comments) to ensure the admin experience feels snappy.
