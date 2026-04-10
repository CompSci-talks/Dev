import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, serverTimestamp } from '@angular/fire/firestore';
import { IContactSubmissionService, ContactSubmission } from '../core/contracts/contact-submission.interface';

@Injectable({
    providedIn: 'root'
})
export class FirebaseContactSubmissionService implements IContactSubmissionService {
    private firestore: Firestore = inject(Firestore);

    async submitContactMessage(submission: Omit<ContactSubmission, 'id' | 'createdAt' | 'status' | 'isDeleted'>): Promise<void> {
        const contactRef = collection(this.firestore, 'contact_submissions');
        const enrichedPayload = {
            ...submission,
            createdAt: serverTimestamp(),
            status: 'new',
            isDeleted: false
        };

        await addDoc(contactRef, enrichedPayload);
    }
}
