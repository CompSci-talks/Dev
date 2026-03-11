# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

The Attendees Portal (Phase 1) provides unauthenticated users with a public schedule and past seminar archive, while allowing authenticated users to RSVP, submit Q&A questions, and view protected seminar materials (videos/PPTs). The architecture adheres strictly to a zero-cost, serverless model using Angular 17+ and Supabase/Firebase adapters.

## Technical Context

**Language/Version**: TypeScript 5.x (Angular 17+)
**Primary Dependencies**: Angular Core/Common/Router/Forms, RxJS
**Storage**: Supabase (PostgreSQL) + Google Drive (File Storage)
**Testing**: Jasmine/Karma (Angular Defaults)
**Target Platform**: Web Browser (Responsive SPA)
**Project Type**: Serverless Web Application
**Performance Goals**: < 3s Initial Load Time (LCP)
**Constraints**: Zero custom backend. Heavy assets stored externally. Authenticated routes guarded client-side.
**Scale/Scope**: Phase 1 limits interactions to Guest browsing + Authenticated RSVP/Q&A/Viewing. No admin moderation features yet.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Adapter Pattern Enforced**: YES (core contracts define ISeminarService, IAuthService, IRsvpService; no SDK imports in components).
- **Zero-Cost Serverless**: YES (Supabase free tier + Google Drive used exclusively).
- **Interface-First**: YES (`contracts/` directory created with TypeScript interfaces mapping to the data model).
- **Auth-Gated Materials**: YES (Models reflect that only authenticated users can access `video_material_id` and `presentation_material_id`).

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
└── app/
    ├── core/
    │   ├── contracts/         # ISeminarService, IAuthService
    │   ├── models/            # Seminar, User, Question
    │   ├── guards/            # Auth Guard
    │   └── services/          # Mock implementations for local dev
    ├── portal/                # Feature: Guest Schedule & Archive
    ├── auth/                  # Feature: Login/Register
    ├── seminar-room/          # Feature: Protected view (Video + Q&A)
    ├── dashboard/             # Feature: User RSVP list
    └── supabase-adapters/     # Concrete Suapbase implementations of core contracts
```

**Structure Decision**: A standard Angular Modular/Standalone Component structure implementing Constitution Principle II (Vertical Slicing feature organization). The `core` layer houses models and interfaces, while features (like `portal` or `seminar-room`) contain the smart/dumb component pairs.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*(No violations exist. Code adheres to all Constitution principles.)*
