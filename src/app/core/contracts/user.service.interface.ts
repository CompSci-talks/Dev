import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { User } from '../models/user.model';

export const USER_SERVICE = new InjectionToken<IUserService>('USER_SERVICE');

export interface IUserService {
    getUsers(pageSize: number, lastUser?: User, filter?: string): Observable<User[]>;
    getUserById(uid: string): Observable<User | null>;
    getUserById$(uid: string): Observable<User | null>;
    updateUserRole(uid: string, role: 'admin' | 'moderator' | 'authenticated'): Observable<void>;
    sendBulkEmail(uids: string[], subject: string, body: string): Observable<void>;
    createUser(profile: User): Observable<void>;
    updateAttendanceCount(uid: string, delta: number): Observable<void>;
    updateAttendedSeminars(uid: string, seminarId: string, action: 'add' | 'remove'): Observable<void>;
    updatePhotoURL(uid: string, photoURL: string): Observable<void>;
}
