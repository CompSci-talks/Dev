# Implementation Plan: 002 — Admin Dashboard

**Branch**: `002-admin-dashboard` | **Date**: 2026-03-12 | **Spec**: [spec.md](file:///D:/Faculty%20of%20science/volunteering/website/compsci-talks/specs/002-admin-dashboard/spec.md)
**Input**: Feature specification from `/specs/002-admin-dashboard/spec.md`

## Summary

Phase 2 focuses on an administrative management system to orchestrate the seminar platform. Key initiatives include Semester-based lifecycle management (active/archived talks), Seminar scheduling CRUD, secure decentralized material management (Google Drive / Direct URL hybrid), and a centralized comment moderation system. The technical approach follows the **Vertical Slicing** pattern, creating a self-contained `admin` module that consumes core service interfaces.

## Technical Context

**Language/Version**: Angular 19, TypeScript 5.4+
**Primary Dependencies**: RxJS, Supabase SDK (in adapters), Tailwind CSS
**Storage**: Supabase (Database), Google Drive (Materials via Hybrid Strategy) - **See research.md for Picker/signed-URL patterns.**
**Testing**: Angular Testing (Karma/Jasmine)
**Target Platform**: Web (Modern desktop/mobile browsers)
**Project Type**: Web Application (SPA)
**Performance Goals**: Instant reflection (<1s) of admin changes to the public portal via Realtime hooks.
**Constraints**: Zero-cost infrastructure, Strict BaaS Abstraction (Adapter Pattern), Offline-first mock compatibility.
**Scale/Scope**: ~4-5 core admin views, ~10-15 new service methods.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Rationale |
|------|--------|-----------|
| **I. Adapter Pattern** | Pass | All admin services (Semester, Seminar CRUD) will be defined as interfaces in `core` first. |
| **II. Vertical Slicing** | Pass | New `admin` folder will house all admin-only logic and UI. |
| **III. Interface-First** | Pass | No UI will be written before `ISemesterService` and `ISeminarService` extensions are defined. |
| **VII. Strict Typing** | Pass | `Semester` and updated `Seminar` models will be fully typed; `any` remains forbidden. |
| **X. Phase-Gating** | Pass | Admin code will be lazy-loaded and gated via `AdminGuard`. |

## Project Structure

### Documentation (this feature)

```text
specs/002-admin-dashboard/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/app/
├── admin/               # [NEW] Vertical slice for admin features
│   ├── components/
│   ├── pages/
│   └── services/        # Logic related only to admin orchestration
├── core/
│   ├── models/          # Semester and Seminar models (Implicit date-range relationship)
│   ├── contracts/       # ISemesterService and ISeminarService
│   └── admin.guard.ts   # [NEW] Role-based guard
├── supabase-adapters/   # Implementation of real adapters
└── portal/              # Public views (Modified to filter by Active Semester date range)
```

**Structure Decision**: Using **Option 2: Web application** (Vertical slicing). Seminars are no longer linked via ID to Semesters; they are grouped dynamically by date range.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
