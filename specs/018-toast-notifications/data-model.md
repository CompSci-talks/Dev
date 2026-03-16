# Data Model: Toast Notifications

## Toast Event Entity

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier (UUID or timestamp) |
| `type` | `'success' \| 'error' \| 'info' \| 'warning'` | The semantic type of the notification |
| `message` | `string` | The message content to display |
| `duration` | `number` | Time in ms before auto-dismiss (optional, default 5000) |
| `timestamp` | `number` | ms since epoch when created |

## Relationships
- **ToastService** maintains a collection of active `ToastEvent` objects.
- **ToastComponent** subscribes to the `ToastService` and renders the list.
