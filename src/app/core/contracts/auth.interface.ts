// contracts/auth.interface.ts
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

export interface IAuthService {
    /** Emits the current user, or null if unauthenticated */
    currentUser$: Observable<User | null>;

    signIn(email: string, password: string): Observable<User>;
    signUp(email: string, password: string, displayName: string): Observable<User>;
    signOut(): Observable<void>;
}
