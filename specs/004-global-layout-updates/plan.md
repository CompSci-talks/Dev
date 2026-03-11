# Implementation Plan: Global Layout Updates

**Branch**: `004-global-layout-updates` | **Date**: 2026-03-11 | **Spec**: [spec.md](file:///d:/Faculty%20of%20science/volunteering/website/compsci-talks/specs/004-global-layout-updates/spec.md)
**Input**: Feature specification from `/specs/004-global-layout-updates/spec.md`

## Summary

Implement a global shared `FooterComponent` across all portal pages and introduce a new `ScheduleComponent` page route based on the provided reference HTML. Update the existing global `NavbarComponent` to include a navigation link to the new Schedule page.

## Technical Context

**Language/Version**: TypeScript, Angular 19 (Zoneless)  
**Primary Dependencies**: Tailwind CSS, Angular Router  
**Storage**: N/A (Presentational changes)  
**Testing**: Angular default (Jasmine/Karma)  
**Target Platform**: Web Browsers  
**Project Type**: Web Application  
**Performance Goals**: Instant rendering of static layout elements  
**Constraints**: Must match the provided reference HTML exactly using existing Tailwind configuration.  
**Scale/Scope**: 2 new components (Footer, Schedule Layout), 1 updated component (Navbar).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Separation of Concerns**: N/A (UI only).
- **II. Vertical Slicing**: Footer belongs in `core/components/` as it's a shared cross-cutting UI element. Schedule belongs in `portal/pages/schedule/` as a specific portal route.
- **III. Interface-First**: N/A (No new data services required for the static layout placeholders).
- **IV. Smart vs. Dumb**: `FooterComponent` will be strictly a dumb, presentational component. `ScheduleComponent` will start as a smart-container stub that currently renders static placeholders but is positioned to fetch `Seminar` data later.
- **VII. Strict Typing**: Enforced for component classes.

*Conclusion: PASSES all gates.*

## Project Structure

### Documentation (this feature)

```text
specs/004-global-layout-updates/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (pending)
```

### Source Code (repository root)

```text
src/app/
├── core/
│   └── components/
│       └── footer/
│           ├── footer.component.ts
│           └── footer.component.html
└── portal/
    └── pages/
        └── schedule/
            ├── schedule.component.ts
            └── schedule.component.html
```

**Structure Decision**: Web application utilizing Angular's component architecture. The Footer is placed in the `core` module because it is a global element shared across the entire application (similar to the Navbar). The Schedule page is placed in the `portal` feature module as a routable page.

## Complexity Tracking

No violations of the constitution. Complexity is extremely low as this is primarily HTML/CSS integration into Angular components.
