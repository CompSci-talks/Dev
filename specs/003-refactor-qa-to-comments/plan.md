# Implementation Plan: Refactoring Q&A to Comments (with Replies)

**Branch**: `003-refactor-qa-to-comments` | **Date**: 2026-03-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-refactor-qa-to-comments/spec.md`

## Summary

Refactor the existing Q&A module into a Comments module and add support for single-level nested replies, allowing users and speakers to have focused discussions.

## Technical Context

**Language/Version**: TypeScript 5.4, Angular 19
**Primary Dependencies**: rxjs, @supabase/supabase-js, tailwindcss
**Storage**: Supabase Postgres (comments table)
**Testing**: Standard Angular tests
**Target Platform**: Web Browsers
**Project Type**: web-application
**Performance Goals**: Real-time comment updates via Supabase subscriptions
**Constraints**: Single-level nesting constraint (no sub-replies), robust terminology replacement
**Scale/Scope**: High interactivity on Seminar Detail pages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Adapter Pattern**: Changes will be made to the `ICommentService` interface first. Mock and Supabase adapters will be updated synchronously.
- [x] **II. Clean Architecture**: The `comments-container` will remain the smart component. `comment-list` and `comment-form` will be pure dumb components.
- [x] **V. Auth-Gated Content**: Unauthenticated users will continue to see the login prompt instead of the comment form and reply buttons.
- [x] **VII. Strict Typing Everywhere**: `Comment` interface will be strictly typed, adding the `parent_id` property. No `any` types.

## Project Structure

### Documentation (this feature)

```text
specs/003-refactor-qa-to-comments/
├── plan.md              # This file
├── research.md          # Technical approach decisions
├── data-model.md        # Entity definitions
└── tasks.md             # Execution steps
```

### Source Code

```text
src/app/
├── core/
│   ├── contracts/comment.interface.ts
│   ├── models/comment.model.ts
│   └── services/mock-comment.service.ts
├── seminar-room/
│   ├── components/
│   │   ├── comments-container/
│   │   ├── comment-list/
│   │   └── comment-form/
└── supabase-adapters/
    └── supabase-comment.service.ts
```

## Complexity Tracking

No constitution violations detected. Complexity is extremely low, leveraging existing component hierarchy.
