import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, map } from 'rxjs';
import { IAuthService } from '../core/contracts/auth.interface';
import { User, UserRole } from '../core/models/user.model';
import { SupabaseService } from '../core/supabase.service';

@Injectable({ providedIn: 'root' })
export class SupabaseAuthService implements IAuthService {
    private userSubject = new BehaviorSubject<User | null>(null);
    currentUser$ = this.userSubject.asObservable();

    constructor(private supabase: SupabaseService) {
        this.initializeAuthListener();
    }

    private initializeAuthListener(): void {
        this.supabase.client.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                // Attempt to fetch custom User profile assuming public.users table exists
                const { data } = await this.supabase.client
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (data) {
                    this.userSubject.next({
                        id: data.id,
                        email: data.email,
                        display_name: data.display_name,
                        role: data.role as UserRole,
                        created_at: new Date(data.created_at)
                    });
                } else {
                    // Fallback to minimal user metadata if profile table isn't synced yet
                    this.userSubject.next({
                        id: session.user.id,
                        email: session.user.email || '',
                        display_name: session.user.user_metadata?.['display_name'] || 'User',
                        role: 'authenticated',
                        created_at: new Date()
                    });
                }
            } else {
                this.userSubject.next(null);
            }
        });
    }

    signIn(email: string, password: string): Observable<User> {
        return from(this.supabase.client.auth.signInWithPassword({ email, password })).pipe(
            map(response => {
                if (response.error) throw response.error;
                if (!response.data.user) throw new Error('No user returned');

                return {
                    id: response.data.user.id,
                    email: response.data.user.email!,
                    display_name: response.data.user.user_metadata?.['display_name'] || 'User',
                    role: 'authenticated' as UserRole,
                    created_at: new Date()
                };
            })
        );
    }

    signUp(email: string, password: string, displayName: string): Observable<User> {
        return from(this.supabase.client.auth.signUp({
            email,
            password,
            options: { data: { display_name: displayName } }
        })).pipe(
            map(response => {
                if (response.error) throw response.error;
                if (!response.data.user) throw new Error('No user returned');

                return {
                    id: response.data.user.id,
                    email: response.data.user.email!,
                    display_name: displayName,
                    role: 'authenticated' as UserRole,
                    created_at: new Date()
                };
            })
        );
    }

    signOut(): Observable<void> {
        return from(this.supabase.client.auth.signOut()).pipe(
            map(response => {
                if (response.error) throw response.error;
            })
        );
    }
}
