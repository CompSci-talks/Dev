import { Observable } from 'rxjs';
import { Semester } from '../models/semester.model';

export interface ISemesterService {
    /** Fetch all semesters for the admin list */
    getSemesters(): Observable<Semester[]>;

    /** Fetch the currently active semester */
    getActiveSemester(): Observable<Semester | null>;

    /** CRUD: Create a new semester */
    createSemester(semester: Omit<Semester, 'id'>): Observable<Semester>;

    /** CRUD: Update existing semester details */
    updateSemester(id: string, updates: Partial<Semester>): Observable<Semester>;

    /** orchestration: Switch the active status to a new semester */
    setActiveSemester(id: string): Observable<void>;
}
