import { Observable } from 'rxjs';

export interface EmailPayload {
    to: string[];
    subject: string;
    body: string; // HTML content from rich-text editor
    metadata?: Record<string, any>;
}

export interface IEmailService {
    /**
     * Sends a rich-text email to the specified recipients.
     * @param payload Recipients, subject, and HTML body.
     */
    send(payload: EmailPayload): Observable<void>;
}

import { InjectionToken } from '@angular/core';
export const EMAIL_SERVICE = new InjectionToken<IEmailService>('EMAIL_SERVICE');
