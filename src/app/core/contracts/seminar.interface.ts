// contracts/seminar.interface.ts
import { Observable } from 'rxjs';
import { Seminar } from '../models/seminar.model';

export interface ISeminarService {
    /** Fetch all seminars, optionally filtered by Tag, Speaker, or Date Range */
    getSeminars(tagId?: string, speakerId?: string, startDate?: Date, endDate?: Date): Observable<Seminar[]>;

    /** Fetch a specific seminar by ID */
    getSeminarById(id: string): Observable<Seminar | null>;

    /** CRUD: Create a new seminar */
    createSeminar(seminar: Omit<Seminar, 'id'>): Observable<Seminar>;

    /** CRUD: Update existing seminar */
    updateSeminar(id: string, updates: Partial<Seminar>): Observable<Seminar>;

    /** CRUD: Delete a seminar */
    deleteSeminar(id: string): Observable<void>;
}

import { InjectionToken } from '@angular/core';
export const SEMINAR_SERVICE = new InjectionToken<ISeminarService>('SEMINAR_SERVICE');
