import { Injectable, inject } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Firestore, collection, addDoc, serverTimestamp, query, orderBy, getDocs } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { sanitizeForFirestore } from '../core/utils/firestore-utils';
import { IEmailService, EmailPayload, SentEmail } from '../admin/services/email.service';

@Injectable({
    providedIn: 'root'
})
export class FirebaseEmailService implements IEmailService {
    private firestore = inject(Firestore);
    private auth = inject(Auth);

    send(payload: EmailPayload): Observable<void> {
        const currentUser = this.auth.currentUser;
        if (!currentUser) {
            return throwError(() => new Error('Unauthenticated user cannot send emails.'));
        }

        // Snippet logic: strip HTML tags and truncate
        const textSnippet = payload.body.replace(/<[^>]*>?/gm, '').substring(0, 150);

        const emailRecord = {
            senderUid: currentUser.uid,
            recipientUids: payload.to,
            subject: payload.subject,
            bodySnippet: textSnippet,
            sentAt: serverTimestamp(),
            ...payload.metadata
        };

        const sanitizedData = sanitizeForFirestore(emailRecord);
        const emailsRef = collection(this.firestore, 'SentEmails');

        return from(addDoc(emailsRef, sanitizedData).then(() => {
            // Assume sending logic handles based on the record
        })).pipe(
            catchError(error => {
                console.error('Failed to save email record:', error);
                return throwError(() => new Error('Failed to send email'));
            })
        );
    }

    getSentEmails(): Observable<SentEmail[]> {
        const emailsRef = collection(this.firestore, 'SentEmails');
        const q = query(emailsRef, orderBy('sentAt', 'desc'));

        return from(getDocs(q).then(snapshot => {
            return snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    senderUid: data['senderUid'],
                    recipientUids: data['recipientUids'],
                    subject: data['subject'],
                    bodySnippet: data['bodySnippet'],
                    sentAt: data['sentAt']?.toDate() || new Date()
                } as SentEmail;
            });
        }));
    }
}
