# Data Model: UX Enhancements

## Key Entities

### LoadingState (Client-side)
| Field | Type | Description |
|-------|------|-------------|
| isLoading | boolean | Whether a route navigation is currently in progress. |
| timeoutReached | boolean | Whether navigation has exceeded 10s threshold. |
| currentUrl | string | The URL currently being navigated to. |

### ImageState (Client-side)
| Field | Type | Description |
|-------|------|-------------|
| loaded | boolean | Whether the image has successfully loaded. |
| error | boolean | Whether the image failed to load. |

## Validation & Rules
- **Rule 1**: `isLoading` MUST be set to true immediately on `NavigationStart`.
- **Rule 2**: `timeoutReached` MUST be set to true if `isLoading` remains true for > 10,000ms.
- **Rule 3**: `loaded` and `error` in `ImageState` are mutually exclusive once a final state is reached.
