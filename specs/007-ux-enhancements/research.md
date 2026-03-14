# Research: UX Enhancements

## Global Navigation Loader
- **Current State**: `AppComponent` listens to `Router` events and toggles an `isLoading$` BehaviorSubject. A progress bar is displayed at the top.
- **Decision**: Keep the current progress bar but enhance it to meet SC-001 and edge cases.
- **Rationale**: The existing reactive setup is solid but lacks user feedback for slow connections.
- **Finding**: Need to add a 10s timeout to show "Loading taking longer than expected".

## Skeleton Loaders & Placeholders
- **Current State**: `SkeletonCardComponent` exists and is used in `Archive` and `Schedule` pages via `ng-template #loading`.
- **Decision**: Refine `SkeletonCardComponent` styles to ensure it matches the final card dimensions and reduces CLS (SC-002).
- **Rationale**: Reducing CLS is a primary requirement.
- **Finding**: `SeminarCardComponent` needs a visual placeholder for the speaker image while loading.

## Admin Entry & Redirection
- **Current State**: `AppComponent` has a subscription to `currentUser$` that redirects to `/admin` if the user is an admin and on `/` or `/login`.
- **Decision**: Standardize this logic.
- **Rationale**: Persistent redirection ensures admins always land on their workspace.
- **Finding**: Redirection works but should be verified against "deep-linking" edge case (spec says don't redirect if following a deep link).

## Admin Navigation Link
- **Current State**: Link is present in `AppComponent` header.
- **Decision**: Keep existing implementation as it correctly gates visibility via RBAC.
- **Rationale**: Minimal change needed, already follows SC-003.
