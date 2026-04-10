export type SubjectCategory = 'General Feedback' | 'Bug Report' | 'Speaker Suggestion' | 'Other';
export type SubmissionStatus = 'new' | 'read' | 'resolved';

export interface ContactSubmission {
    id?: string;
    name: string;
    email: string;
    subject: SubjectCategory;
    message: string;
    createdAt: Date;
    status: SubmissionStatus;
    isDeleted: boolean;
    submitterUid: string | null;
}

export interface IContactSubmissionService {
    /**
     * Submits a new contact message and persists it to the data store.
     * @param submission The contact submission payload.
     * @returns A promise that resolves when the submission is successfully saved.
     */
    submitContactMessage(submission: Omit<ContactSubmission, 'id' | 'createdAt' | 'status' | 'isDeleted'>): Promise<void>;
}
