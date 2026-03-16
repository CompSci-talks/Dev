import { Observable } from 'rxjs';

export interface User {
    uid: string;
    displayName: string;
    email: string;
    role: 'admin' | 'user' | 'moderator';
    photoURL?: string;
    createdAt: any;
    lastLogin: any;
}

export interface IUserService {
    /**
     * Fetches a paginated list of users.
     * @param pageSize Number of users per page.
     * @param lastVisible Last user from the previous page for cursor-based pagination.
     * @param filter Text filter (optional).
     */
    getUsers(pageSize: number, lastVisible?: any, filter?: string): Observable<UserPage>;

    /**
     * Updates a user's role.
     * @param uid User ID.
     * @param role New role.
     */
    updateUserRole(uid: string, role: string): Observable<void>;

    /**
     * Fetches a single user by ID.
     * @param uid User ID.
     */
    getUserById(uid: string): Observable<User | null>;
}

export interface UserPage {
    users: User[];
    lastVisible: any;
    hasMore: boolean;
}
