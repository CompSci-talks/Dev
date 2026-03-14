# Quickstart: UX Enhancements Integration

## Overview
This feature integrates global navigation feedback, skeleton loaders, and intelligent admin redirection.

## Integration Steps

1. **Global Loader**:
   - The `AppComponent` manages the global loading state using `Router` events.
   - Design tokens from `tailwind.config.js` (`bg-primary`, `animate-progress-indeterminate`) are used for styling.

2. **Skeleton Cards**:
   - Use `app-skeleton-card` within an `ng-template` named `#loading` in your page components.
   - Example:
     ```html
     <ng-container *ngIf="data$ | async as data; else loading">...</ng-container>
     <ng-template #loading><app-skeleton-card *ngFor="let i of [1,2,3]"></app-skeleton-card></ng-template>
     ```

3. **Admin Redirection**:
   - Automatic redirection for admins is handled in `AppComponent.ngOnInit`.
   - Ensure `MockAuthService` (or real adapter) is injected to access the user role.

4. **Image Fallbacks**:
   - In `SeminarCardComponent`, use `(load)="imageLoaded = true"` and `(error)="hasError = true"`.
   - Show a placeholder div while `!imageLoaded && !hasError`.
   - Show a fallback icon or image if `hasError`.
