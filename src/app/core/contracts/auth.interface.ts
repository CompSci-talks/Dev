import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { InjectionToken } from '@angular/core';

export interface IAuthService {
    /** Emits the current user, or null if unauthenticated */
    currentUser$: Observable<User | null>;

    /** Emits true when the initial session check has completed */
    isInitialized$: Observable<boolean>;

    signIn(email: string, password: string): Observable<User>;
    signUp(email: string, password: string, displayName: string): Observable<User>;
    signOut(): Observable<void>;
}

export const AUTH_SERVICE = new InjectionToken<IAuthService>('AUTH_SERVICE');
