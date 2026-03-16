import { Observable } from 'rxjs';
import { UserProfile } from '../models/user-profile.model';
import { SeminarAttendance } from '../models/seminar-attendance.model';

export interface UserProfilePort {
    /**
     * Fetch all user profiles with pagination and filtering.
     */
    getAllProfiles(options: {
        page: number;
        limit: number;
        filter?: string;
    }): Observable<{ users: UserProfile[], hasMore: boolean }>;

    /**
     * Fetch a single user profile by UID.
     */
    getProfile(uid: string): Observable<UserProfile | null>;

    /**
     * Update a user's role. MUST include self-demotion guard in implementation.
     */
    updateUserRole(uid: string, role: 'admin' | 'moderator' | 'authenticated'): Observable<void>;

    /**
     * Fetch attendance history for a specific user.
     */
    getUserAttendance(uid: string): Observable<SeminarAttendance[]>;
}
