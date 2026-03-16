# Research: Toast Notifications

## Decision: Custom Tailwind + Angular Service

Based on the project requirements and current architecture, I have evaluated three paths for implementing modern toast notifications.

### 1. Custom Tailwind-Based Solution (SELECTED)
- **Rationale**: 
    - Full control over visual aesthetics to match the "modern" requirement.
    - Zero additional bundle weight (no external library dependency).
    - Perfect alignment with **Principle XI (Centralized Styling)** and **Principle VI (Zero-Cost)**.
    - Leverage existing `ToastService` and `ToastComponent` structure with enhanced transitions and icons.
- **Alternatives Considered**:
    - **Hot Toast / Ngx-Toastr**: Dismissed because they introduce external dependencies and can be harder to style strictly with the existing project's Tailwind config without CSS overrides.

### 2. Integration Pattern: Centralized Toast Service
- **Approach**: 
    - The existing `ToastService` in `src/app/core/services/toast.service.ts` will be updated to handle unique IDs for each toast and configurable durations.
    - The `ToastComponent` will be refactored to handle a stack of notifications with enter/leave animations using Tailwind's `animate-*` and Angular's `Transition` if necessary (though pure CSS is preferred for simplicity).

### 3. Visual Identity (REFINED)
- **Glassmorphism Styling**: 
    - Background: `bg-opacity-70` or `bg-white/70` (for light mode) / `bg-black/70` (for dark mode).
    - Blur: `backdrop-blur-md` or `backdrop-blur-lg`.
    - Border: `border-white/20` or `border-black/10` to define the edges.
    - Shadow: `shadow-xl` to provide depth without feeling "heavy".
- **Positioning**: 
    - Moved to **Top Right** (`top-6 right-6`) to follow modern notification patterns.
- **Animations**:
    - **Fade-only**: Using Tailwind's `transition-opacity` or `animate-fade-in` (custom).
    - No movement (slide) to keep the interaction subtle and professional.

## Verification Plan
- **Mock Service**: Extend `ToastService` to support manual triggering for testing.
- **Manual**: Trigger success/error toasts from various pages (e.g., Admin attendance, comments).
- **Automated**: Ensure E2E tests can detect toast presence and text content.
