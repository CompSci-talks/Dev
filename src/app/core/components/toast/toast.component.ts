import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './toast.component.html'
})
export class ToastComponent implements OnInit {
    private toastService = inject(ToastService);
    toasts: Toast[] = [];

    ngOnInit() {
        this.toastService.toasts$.subscribe(toast => {
            this.toasts.push(toast);
            setTimeout(() => this.remove(toast), 4000);
        });
    }

    remove(toast: Toast) {
        this.toasts = this.toasts.filter(t => t !== toast);
    }
}
