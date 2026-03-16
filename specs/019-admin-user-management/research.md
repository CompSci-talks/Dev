# Research: Unified Paginated List Components

## Technical Context
- **Framework**: Angular 19+ (Standalone)
- **Styling**: Tailwind CSS
- **Data Source**: Firestore (via adapters)
- **Interaction Pattern**: Template-based content projection for rows/cells.

## Decision: Specialized vs Generic Component
- **Decision**: Implement two specialized components: `PaginatedTableComponent` and `PaginatedGridComponent`.
- **Rationale**: 
  - Tables and Grids have fundamentally different DOM structures (`<table>` vs `<div>` grid).
  - Attempting a single component would lead to complex conditional logic and poor accessibility.
  - Common logic (pagination, filtering, loading states) can be shared via documentation or a common interface/base class if needed, but simple duplication for specific UI needs is cleaner for Angular components.
- **Alternatives Considered**: 
  - One generic `UnifiedListComponent`: Rejected because it makes semantic HTML (`<thead>`, `<tbody>`, etc.) difficult to maintain.

## Research Task: Angular Content Projection Best Practices
- **Goal**: Ensure the component is flexible enough for any row layout.
- **Finding**: Using `TemplateRef` with `@Input` (as currently implemented) is more flexible than simple `<ng-content>` because it allows the child to pass a "context" (the item data) back to the parent's template.
- **Decision**: Stick with `itemTemplate: TemplateRef<any>` pattern.

## Research Task: Skeleton Screens in Tailwind
- **Goal**: Implement smooth pulse animations.
- **Finding**: Tailwind's `animate-pulse` is sufficient. Using CSS Grid for skeleton cards and `<tr>` with dummy `<td>` for tables maintains layout stability.
- **Decision**: Use `animate-pulse` on container elements with fixed heights.
