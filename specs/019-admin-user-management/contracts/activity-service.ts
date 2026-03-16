import { Observable } from 'rxjs';

export interface IUserActivityService {
    /**
     * Fetches activity logs for a specific user.
     * @param userId The user ID.
     * @param limit Maximum number of records to fetch.
     */
    getUserActivity(userId: string, limit?: number): Observable<ActivityLog[]>;
}

export interface ActivityLog {
    id: string;
    type: string;
    targetId: string;
    timestamp: Date;
    metadata: any;
}
