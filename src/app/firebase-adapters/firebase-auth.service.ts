import { Injectable, inject, NgZone } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser, setPersistence, browserLocalPersistence } from '@angular/fire/auth';
import { BehaviorSubject, Observable, from, map, take, tap } from 'rxjs';
import { IAuthService } from '../core/contracts/auth.interface';
import { User } from '../core/models/user.model';

@Injectable({
    providedIn: 'root'
})
export class FirebaseAuthService implements IAuthService {
    private zone = inject(NgZone);
    private auth = inject(Auth);

    private userSubject = new BehaviorSubject<User | null>(null);
    private initializedSubject = new BehaviorSubject<boolean>(false);

    currentUser$ = this.userSubject.asObservable();
    isInitialized$ = this.initializedSubject.asObservable();

    constructor() {
        // Listen to Firebase Auth state changes
        onAuthStateChanged(this.auth, (firebaseUser) => {
            this.zone.run(() => {
                if (firebaseUser) {
                    this.userSubject.next(this.mapFirebaseUser(firebaseUser));
                } else {
                    this.userSubject.next(null);
                }

                // Mark as initialized once the first auth state is determined
                if (!this.initializedSubject.value) {
                    this.initializedSubject.next(true);
                }
            });
        });
    }

    signIn(email: string, password: string): Observable<User> {
        return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
            map(credential => this.mapFirebaseUser(credential.user)),
            tap(user => this.userSubject.next(user))
        );
    }

    signUp(email: string, password: string, displayName: string): Observable<User> {
        return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
            map(credential => {
                // Note: Real implementation would likely update profile with displayName
                return this.mapFirebaseUser(credential.user);
            })
        );
    }

    signOut(): Observable<void> {
        return from(signOut(this.auth));
    }

    private mapFirebaseUser(firebaseUser: FirebaseUser): User {
        return {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            display_name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            role: (firebaseUser.email === 'admin@compsci.test' || firebaseUser.email === 'admin@test.com') ? 'admin' : 'authenticated',
            created_at: new Date()
        };
    }
}
