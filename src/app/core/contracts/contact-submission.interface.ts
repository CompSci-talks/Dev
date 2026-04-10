import { InjectionToken } from '@angular/core';

export interface ContactSubmission {
    id?: string;
    name: string;
    email: string;
    subject: 'General Feedback' | 'Bug Report' | 'Speaker Suggestion' | 'Other';
    message: string;
    submitterUid?: string | null;
    createdAt?: any; // Firestore serverTimestamp or Date string
    status?: 'new' | 'read' | 'resolved';
    isDeleted?: boolean;
}

export interface IContactSubmissionService {
    /**
     * Submits a new contact message and persists it.
     */
    submitContactMessage(submission: Omit<ContactSubmission, 'id' | 'createdAt' | 'status' | 'isDeleted'>): Promise<void>;
}

export const CONTACT_SUBMISSION_SERVICE = new InjectionToken<IContactSubmissionService>('IContactSubmissionService');
