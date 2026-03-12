# Data Model: Global Layout Updates

This feature is primarily **presentational** and focuses on global routing and layout.

## Entities Interacted With

### `Seminar` (Existing)
While the `ScheduleComponent` will eventually display seminars, this specific feature scope only covers building the layout shells and static text (e.g., "Coming Soon" empty states). No new metadata fields or storage updates are required for the `Seminar` entity at this time.

## State Management
- **Routing State**: The application will now track navigation to the `/schedule` route.
- **Component State**: The `NavbarComponent` will need to track its active link state to highlight "Schedule" when the user is on that route.
