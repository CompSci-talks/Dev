export interface Toast {
    type: 'success' | 'error' | 'info';
    message: string;
}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
    private toastSubject = new Subject<Toast>();
    toasts$ = this.toastSubject.asObservable();

    show(type: Toast['type'], message: string) {
        this.toastSubject.next({ type, message });
    }

    success(message: string) {
        this.show('success', message);
    }

    error(message: string) {
        this.show('error', message);
    }

    info(message: string) {
        this.show('info', message);
    }
}
