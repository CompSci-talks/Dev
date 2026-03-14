# Implementation Plan: UX Enhancements: Loaders, Placeholders, and Admin Navigation

**Branch**: `007-ux-enhancements` | **Date**: 2026-03-14 | **Spec**: [spec.md](file:///D:/website/compscitalks/specs/007-ux-enhancements/spec.md)
**Input**: Feature specification from `/specs/007-ux-enhancements/spec.md`

## Summary

This feature improves the user experience by implementing global navigation loaders, skeleton placeholders for seminar lists/images, and a streamlined admin entry experience with automatic redirection and persistent navigation links.

## Technical Context

**Language/Version**: TypeScript 5.9, Angular 21.2.0  
**Primary Dependencies**: `@angular/core`, `@angular/router`, `@supabase/supabase-js`, `tailwindcss`, `rxjs`  
**Storage**: Supabase (via adapters)  
**Testing**: Vitest  
**Target Platform**: Web  
**Project Type**: Web Application  
**Performance Goals**: SC-001 (<100ms feedback), SC-002 (CLS < 0.1)  
**Constraints**: Zero-cost infrastructure, reactive data flow  
**Scale/Scope**: Academic seminar platform

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **Principle I: Adapter Pattern** - The redirection logic MUST depend on the auth interface, not the Supabase SDK.
2. **Principle III: Interface-First** - Navigation and Loading states SHOULD be managed through well-defined service interfaces.
3. **Principle IV: Smart/Dumb Components** - Placeholder components (skeletons) MUST be dumb; the containers handling the loading state MUST be smart.
4. **Principle IX: Graceful Error Handling** - Image load failures MUST be handled gracefully with fallbacks.
5. **Principle XI: Centralized Styling** - All loader and placeholder styles MUST use Tailwind CSS design tokens from `tailwind.config.js`.

## Project Structure

### Documentation (this feature)

```text
specs/007-ux-enhancements/
├── spec.md              # Original requirements
├── plan.md              # This file
├── research.md          # Research findings
├── data-model.md        # Feature design entities
├── quickstart.md        # Integration guide
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
src/app/
├── core/
│   ├── components/      # Global components (Toast, Footer)
│   ├── services/        # Service Interfaces & Core Logic
│   └── pipes/           # Semantic pipes (Status)
├── portal/
│   ├── components/      # Feature components (SeminarCard, SkeletonCard)
│   └── pages/           # Public pages (Archive, Schedule)
├── admin/               # Admin feature slice
└── auth/                # Auth feature slice
```

**Structure Decision**: Standard Angular feature-based structure with a clear `core` layer for cross-cutting concerns and `portal`/`admin` slices for vertical features.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
