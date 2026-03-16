import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './toast.component.html'
})
export class ToastComponent {
    private toastService = inject(ToastService);
    /**
     * Observable of all active toasts from the service.
     */
    toasts$ = this.toastService.toasts$;

    /**
     * Manually remove a toast via the service.
     * @param toast The toast object to remove.
     */
    remove(toast: Toast) {
        this.toastService.remove(toast.id);
    }
}
