// contracts/seminar.interface.ts
import { Observable } from 'rxjs';
import { Seminar } from '../models/seminar.model';

export interface ISeminarService {
    /** Fetch all seminars, optionally filtered by Tag or Speaker */
    getSeminars(tagId?: string, speakerId?: string): Observable<Seminar[]>;

    /** Fetch a specific seminar by ID */
    getSeminarById(id: string): Observable<Seminar | null>;
}
