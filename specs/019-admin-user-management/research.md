# Research: Admin User Management

This document consolidation findings on technical unknowns and best practices for the Admin User Management feature.

## 1. Skeleton Screens for Angular

**Decision**: Use `ng-content` or `ng-template` based skeletons in reusable components.
**Rationale**: CSS-only skeletons with `animate-pulse` provide the best performance and simplest implementation without external dependencies.
**Alternatives considered**: 
- `ngx-skeleton-loader`: Rejected to minimize bundle size and maintain vanilla Tailwind control.

## 2. WYSIWYG Editor for Email Composer

**Decision**: Use `ngx-editor` or a simple `contenteditable` wrapper with standard execCommand/modern replacement.
**Rationale**: `ngx-editor` is lightweight and well-integrated with Angular's reactive forms.
**Alternatives considered**:
- `Quill`: Powerful but heavy; overkill for simple administrative emails.
- `TinyMCE`: Requires API keys/cloud connection; violates "Serverless-First" if self-hosting is difficult.

## 3. User Activity Aggregation in Firestore

**Decision**: Parallel fetch and client-side merge using `combineLatest`.
**Rationale**: Firestore does not support cross-collection joins. Fetching "Attendance" and "Comments" separately by `uid` and merging them in an observable stream is the standard reactive pattern for this platform.
**Constraints**: 
- Individual error handling for each stream (FR-018).
- Limit returned activity to most recent 50 entries to ensure SC-001 results.

## 4. Name Uniqueness Enforcement

**Decision**: Case-insensitive query validation in the `FirebaseAdapter`.
**Rationale**: Prevents accidental duplicates (e.g., "AI" vs "ai").
**Implementation**: Use `where('nameLower', '==', name.toLowerCase())` indexing or fetch all and filter if the collection size is guaranteed small (<100).
