import { Injectable, inject } from '@angular/core';
import { Observable, from, throwError, firstValueFrom } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Firestore, collection, addDoc, serverTimestamp, query, orderBy, getDocs, doc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { sanitizeForFirestore } from '../core/utils/firestore-utils';
import { IEmailService, EmailPayload, SentEmail } from '../admin/services/email.service';
import emailjs from '@emailjs/browser';

@Injectable({
    providedIn: 'root'
})
export class FirebaseEmailService implements IEmailService {
    private firestore = inject(Firestore);
    private auth = inject(Auth);

    /**
     * Sends an email using EmailJS. 
     * Configuration (serviceId, templateId, publicKey) is fetched from Firestore (email_config/smtp).
     */
    send(payload: EmailPayload): Observable<void> {
        const currentUser = this.auth.currentUser;
        if (!currentUser) {
            return throwError(() => new Error('Unauthenticated user cannot send emails.'));
        }

        return from(this.getEmailConfig()).pipe(
            switchMap(config => {
                if (!config?.serviceId || !config?.templateId || !config?.publicKey) {
                    throw new Error('Email configuration is missing or incomplete.');
                }

                // EmailJS send request
                // Note: The template in EmailJS should have variables like {{subject}}, {{message}}, {{to_email}}, {{from_name}}
                const templateParams = {
                    subject: payload.subject,
                    message: payload.body, // Rich text HTML
                    to_email: payload.to.join(', '),
                    from_name: currentUser.displayName || 'Admin',
                    ...payload.metadata
                };

                return from(emailjs.send(
                    config.serviceId,
                    config.templateId,
                    templateParams,
                    config.publicKey
                ));
            }),
            switchMap(() => {
                // Audit Log logic after successful send
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
                return from(addDoc(emailsRef, sanitizedData));
            }),
            switchMap(() => from(Promise.resolve())),
            catchError(error => {
                console.error('Failed to send email or save record:', error);
                return throwError(() => new Error(error.message || 'Failed to send email'));
            })
        );
    }

    private async getEmailConfig(): Promise<any> {
        const configDocRef = doc(this.firestore, 'email_config', 'smtp');
        const configSnap = await getDoc(configDocRef);
        return configSnap.exists() ? configSnap.data() : null;
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

