import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { IEmailService, EmailPayload } from '../../../admin/services/email.service';

@Injectable({
    providedIn: 'root'
})
export class MockEmailAdapter implements IEmailService {
    /**
     * Simulates sending an email by logging the payload and delaying the response.
     */
    send(payload: EmailPayload): Observable<void> {
        console.log('--- MOCK EMAIL SENDER ---');
        console.log(`To: ${payload.to.join(', ')}`);
        console.log(`Subject: ${payload.subject}`);
        console.log(`Body: ${payload.body}`);
        console.log('-------------------------');

        // Simulate network delay
        return of(undefined).pipe(delay(1000));
    }
}
