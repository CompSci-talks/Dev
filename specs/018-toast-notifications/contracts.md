# Service Contracts: Toast Notifications

## IToastService

The `ToastService` handles the lifecycle of toast notifications.

```typescript
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
  timestamp: number;
}

export interface IToastService {
  /**
   * Stream of active toast notifications.
   */
  readonly toasts$: Observable<Toast[]>;

  /**
   * Display a success toast.
   */
  success(message: string, duration?: number): void;

  /**
   * Display an error toast.
   */
  error(message: string, duration?: number): void;

  /**
   * Display a warning toast.
   */
  warning(message: string, duration?: number): void;

  /**
   * Display an info toast.
   */
  info(message: string, duration?: number): void;

  /**
   * Manually remove a specific toast.
   */
  remove(id: string): void;
}
```

## UI Implementation Details (ToastComponent)
- **Lifecycle**: Toasts are automatically removed after their `duration` (default 5s for success/info).
- **Positioning**: Stacks vertically from the **top-right** of the viewport.
- **Styling**: MUST implement **Glassmorphism** using `backdrop-blur` and translucent backgrounds.
- **Transitions**: Subtle **fade-in** and **fade-out** (no translate/slide).
- **Z-Index**: `z-[70]` (stays above navigation and progress loaders).
- **Icons**:
  - Success: Heroicons `CheckCircleIcon` (solid).
  - Error: Heroicons `ExclamationTriangleIcon` (solid).
  - Warning: Heroicons `ExclamationTriangleIcon` (solid) / Amber.
  - Info: Heroicons `InformationCircleIcon` (solid).
