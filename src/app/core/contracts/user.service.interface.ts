import { Observable } from 'rxjs';
import { UserProfile } from '../models/user-profile.model';
import { InjectionToken } from '@angular/core';

export const USER_SERVICE = new InjectionToken<IUserService>('USER_SERVICE');

export interface IUserService {
    getUsers(pageSize: number, lastUser?: UserProfile, filter?: string): Observable<UserProfile[]>;
    getUserById(uid: string): Observable<UserProfile | null>;
    getUserById$(uid: string): Observable<UserProfile | null>;
    updateUserRole(uid: string, role: 'admin' | 'moderator' | 'authenticated'): Observable<void>;
    sendBulkEmail(uids: string[], subject: string, body: string): Observable<void>;
    createUserProfile(profile: UserProfile): Observable<void>;
}
