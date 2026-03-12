# Research: Global Layout Updates

## Decisions & Findings

**Decision 1: Implementation of Footer**
- **Rationale**: The user provided `index.html` and `schedule.html` which include a standardized Tailwind footer. We will extract this into an Angular `FooterComponent` positioned in the `core/components` module. It requires no dynamic data or services, so it will remain a pure presentational component. 
- **Alternatives Considered**: Injecting it per page (rejected due to DRY violation).

**Decision 2: Implementation of Schedule Page**
- **Rationale**: The user wants a dedicated `ScheduleComponent`. We will create a routable component in `portal/pages/schedule` that contains the Hero banner and static placeholders for "Next Seminar" and "Featured Talks" as seen in the HTML templates.
- **Alternatives Considered**: Using the Homepage (rejected as the spec requests a distinct layout).

*All technical unknowns are resolved. The stack (Angular 19, Tailwind) is well-understood.*
