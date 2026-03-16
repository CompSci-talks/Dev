import { Observable } from 'rxjs';

export type UserRole = 'admin' | 'authenticated' | 'moderator';

export interface User {
    uid: string;
    displayName: string;
    email: string;
    role: UserRole;
    photoURL?: string;
    createdAt: any;
    lastLogin: any;
    lastActiveTimestamp?: any;
    attendanceCount?: number;
    preferredTopicAreas?: string[];
}

export interface IUserService {
    /**
     * Fetches a paginated list of users.
     */
    getUsers(pageSize: number, lastVisible?: any, filter?: string): Observable<UserPage>;

    /**
     * Updates a user's role.
     */
    updateUserRole(uid: string, role: string): Observable<void>;

    /**
     * Fetches a single user by ID (One-time fetch).
     */
    getUserById(uid: string): Observable<User | null>;

    /**
     * Fetches a single user by ID (Real-time listener).
     */
    getUserById$(uid: string): Observable<User | null>;
}

export interface UserPage {
    users: User[];
    lastVisible: any;
    hasMore: boolean;
}
