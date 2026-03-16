# Quickstart: Premium Toast Notifications

## Implementation details

The `ToastService` provides a simple API to trigger premium, glassmorphic notifications.

### Injecting the Service

```typescript
import { ToastService } from '@core/services/toast.service';

constructor(private toastService: ToastService) {}
```

### Triggering Toasts

```typescript
// Success (Auto-dismisses in 5s)
this.toastService.success('Record saved successfully!');

// Error (Persistent or long duration)
this.toastService.error('Failed to connect to the server.');

// Warning
this.toastService.warning('Your session will expire soon.');

// Info
this.toastService.info('New seminar added to your schedule.');
```

### Custom Duration

```typescript
this.toastService.show('Custom message', 'info', 10000); // 10 seconds
```

## Styling Notes
The UI uses `backdrop-blur-md` and `bg-opacity-70`. Ensure the parent container has a clear background or is placed over content to maximize the "glass" effect.
