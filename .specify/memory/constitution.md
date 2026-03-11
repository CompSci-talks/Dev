# CompSci Talks Platform Constitution

## Core Principles

### I. Separation of Concerns via Adapter Pattern (NON-NEGOTIABLE)
- All external service interactions (authentication, database, storage) **must** be accessed through well-defined interfaces (ports).
- Concrete implementations (adapters) for any provider (Supabase, Firebase, Google Drive, etc.) are injected at runtime.
- Swapping a backend provider **must not** require changes to any application logic, UI component, or routing — only a new adapter implementation and a configuration change.
- No component or service may directly import or reference a specific provider SDK.

### II. Clean Architecture with Vertical Slicing
- The codebase is organized by **feature** (e.g., `seminars`, `auth`, `admin`, `q-and-a`), not by technical layer.
- Each feature slice owns its own models, services, components, and routes.
- Cross-cutting concerns (error handling, logging, guards) live in a shared `core` layer that every feature can depend on, but the `core` layer depends on nothing.
- No feature slice may directly depend on another feature slice; shared data flows through the `core` layer or well-defined public APIs.

### III. Interface-First Development
- Every service **must** begin as a TypeScript interface (port) before any implementation is written.
- Mock/stub implementations of each interface **must** exist and be usable for offline development and testing.
- UI components are developed and validated against mock services first, then connected to real adapters.
- This ensures the UI is never blocked by backend availability or provider decisions.

### IV. Smart vs. Dumb Component Boundary
- **Smart (container) components** handle data fetching, state management, and coordination by consuming injected services.
- **Dumb (presentational) components** receive data exclusively via inputs and emit events via outputs; they contain zero business logic and no service dependencies.
- This separation is strictly enforced — a dumb component must never inject a service or manage subscriptions.

### V. Authentication-Gated Content by Default
- All seminar materials (videos, slides, Q&A) are treated as **protected resources**.
- Route guards enforce authentication at the routing level; no material endpoint should be reachable without a valid session.
- Guest users may browse public metadata (schedule, talk titles, speaker info) but are redirected to authentication when accessing any protected content.
- Authorization logic lives in the `core` layer and is provider-agnostic.

### VI. Zero-Cost & Serverless-First
- The platform must operate within free-tier limits of all third-party services by default.
- No custom backend server, VM, or container may be introduced; all backend logic runs through managed serverless services or client-side code.
- Heavy assets (videos, presentations) are stored externally (e.g., cloud drive) and referenced by ID in the database — never stored in the database or application bundle itself.

### VII. Strict Typing Everywhere (NON-NEGOTIABLE)
- `any` is forbidden across the entire codebase.
- All data models, API responses, service method signatures, and component inputs/outputs **must** be explicitly typed.
- Shared types and interfaces live in the `core` layer and are the single source of truth.
- Generic types are preferred over union type duplication.

### VIII. Reactive & Declarative Data Flow
- The application follows a **reactive** paradigm — data is modeled as observable streams, not imperative callbacks.
- Subscriptions are managed through declarative patterns (e.g., async pipes, takeUntil, or framework-native lifecycle hooks) to prevent memory leaks.
- State mutations follow a unidirectional flow: user action → service → state update → view re-render.

### IX. Graceful Error Handling & User Feedback
- Every service call **must** have explicit error handling — silent failures are not acceptable.
- Errors are categorized (network, auth, validation, unknown) and surfaced to the user with actionable, human-readable messages.
- A centralized error-handling mechanism intercepts unhandled errors and prevents application crashes.
- Loading, empty, and error states are designed for every data-driven view — no view may assume data is always available.

### X. Progressive Delivery & Phase-Gating
- Features are developed and released in defined phases (Phase 1: Attendees Portal, Phase 2: Admin Dashboard, etc.).
- Later-phase code **must not** be shipped, imported, or bootstrapped until its phase is active.
- Feature boundaries are enforced through lazy loading and route-level code splitting.

## Development Workflow

- **Interface → Mock → UI → Adapter**: This is the mandatory build order for every feature.
- **One feature slice at a time**: Complete a vertical slice end-to-end (interface, mock, UI, tests) before starting the next.
- **No premature optimization**: Ship simple, correct implementations first. Optimize only when a measured bottleneck exists.
- **Consistent naming**: Follow a project-wide naming convention for files, classes, interfaces, and routes. Names should be self-documenting.

## Quality Gates

- Every component must render correctly with mock data before being connected to a real adapter.
- Route guards must be tested for both authenticated and unauthenticated scenarios.
- No pull request may introduce `any` types, direct provider SDK imports outside adapter files, or cross-feature dependencies.

## Governance

- This constitution is the **highest authority** on architectural and development decisions for the CompSci Talks platform.
- Any amendment requires explicit documentation of the rationale, impact analysis, and a migration plan for existing code.
- All code reviews must verify compliance with these principles before approval.

**Version**: 1.0.0 | **Ratified**: 2026-03-11 | **Last Amended**: 2026-03-11
