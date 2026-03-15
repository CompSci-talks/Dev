# Research: Firebase Migration Strategy

**Feature**: Firebase Backend Migration | **Date**: 2026-03-15

## Decision 1: Firestore Denormalization Strategy

**Decision**: Embed `Speaker` and `Tag` metadata directly into the `Seminar` documents.

**Rationale**: 
- **Read Optimization**: The Archive and Schedule pages are the most visited views. Embedding related data allows these views to be rendered with a single collection fetch (O(n) reads), whereas normalized data would require O(n * 3) reads (Seminar + Speaker + Tags).
- **Consistency**: While denormalization increases write complexity, the frequency of "Speaker" or "Tag" updates is low compared to "Seminar" reads.

**Alternatives Considered**:
- **Reference-only (Normalized)**: Rejected. Firestore doesn't support server-side joins. Client-side joins would result in "waterfall" loading and poor user experience on mobile.
- **Subcollections**: Rejected. Fetching subcollections for every seminar in a list would exceed free-tier read limits rapidly.

---

## Decision 2: Authentication State Management

**Decision**: Use a dedicated `FirebaseInitialized$` stream in the `FirebaseAuthService` to gate application readiness.

**Rationale**: 
- The existing Supabase implementation uses an `isInitialized$` behavioral subject to prevent guards from running before the session is determined. Firebase Auth initializes asynchronously, so mirroring this pattern ensures 100% compatibility with existing guards.

**Alternatives Considered**:
- **Imperative Checks**: Rejected. Violates Constitution Principle VIII (Reactive & Declarative).

---

## Decision 3: AngularFire Standalone Initialization

**Decision**: Use `provideFirebaseApp`, `provideFirestore`, and `provideAuth` in `src/app/app.config.ts`.

**Rationale**: 
- This is the standard pattern for Angular 17+ standalone applications. It allows for tree-shakable providers and integrates perfectly with Angular's dependency injection system, satisfying the Adapter Pattern (Principle I).

**Alternatives Considered**:
- **Module-based `AngularFireModule`**: Rejected. Deprecated in newer versions of Angular and less performant.
