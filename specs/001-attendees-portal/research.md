# Research: Phase 1 — Attendees Portal

## 1. Technical Context Unknowns Resolution

### Language/Version
- **Decision**: TypeScript 5.x via Angular 17+
- **Rationale**: Strict typing is a non-negotiable constitution principle (VII). Angular provides a robust, opinionated framework for SPA development with built-in RxJS support for reactive data flow (Principle VIII).

### Primary Dependencies
- **Decision**: Angular (Core, Router, Common, Forms), RxJS
- **Rationale**: Best suited for the architecture principles (Vertical Slicing, Smart/Dumb components). No specific provider SDKs will be directly tied to components (Adapter Pattern - Principle I).

### Backend/Storage
- **Decision**: Supabase (PostgreSQL) adapter + Google Drive adapter
- **Rationale**: The user indicated Supabase or Firebase. Supabase plays nicely with relational data (Seminars, Speakers, Tags, RSVPs). Google Drive is pre-selected for heavy asset storage. Zero-cost serverless constraints (Principle VI) are met.

### Testing
- **Decision**: Jasmine/Karma (Angular Default) + Mock Services
- **Rationale**: Constitution Principle III requires Interface-First development with mocks. Jasmine is the standard for testing Angular component states against mock injected services.

### Target Platform
- **Decision**: Web Browser (Mobile-Responsive SPA)
- **Rationale**: The attendees portal is a public-facing website.

### Project Type
- **Decision**: Web Application (Client-Side Serverless SPA)
- **Rationale**: 100% serverless architecture with backend-as-a-service.

### Performance Goals
- **Decision**: < 3s Initial Load Time (LCP)
- **Rationale**: Defined in Success Criteria SC-001.

### Constraints
- **Decision**: Zero custom backend. Heavy assets stored externally. Authenticated routes guarded client-side.
- **Rationale**: Constitution Principles V and VI.

### Scale/Scope
- **Decision**: Phase 1: Guest browsing + Authenticated RSVP/Q&A/Viewing. No admin features or complex moderation.

---

## 2. Architecture & Patterns (Constitution Alignment)

### Vertical Slicing Strategy
The application will be divided into the following feature modules:
1. `core`: Interfaces, generic services, route guards, error handlers.
2. `portal`: Public-facing schedule, searchable archive.
3. `auth`: Login, registration, session management.
4. `seminar-room`: Protected viewing area for videos, slides, and Q&A.
5. `dashboard`: Personalized view of upcoming RSVPs.

### Adapter Pattern Implementation
We will define interfaces in `core` (e.g., `ISeminarService`, `IAuthService`). We will create a `supabase-adapters` module that implements these interfaces. The `AppModule` or `app.config.ts` will provide the Supabase implementations for the interfaces using Angular's DI token system.
