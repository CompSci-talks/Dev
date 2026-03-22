import { Injectable, inject, NgZone, signal } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser, setPersistence, browserLocalPersistence } from '@angular/fire/auth';
import { BehaviorSubject, Observable, from, map, take, tap, switchMap, Subscription, throwError } from 'rxjs';
import { IAuthService } from '../core/contracts/auth.interface';
import { USER_SERVICE } from '../core/contracts/user.service.interface';
import { User, UserRole } from '../core/models/user.model';
import { Firestore } from '@angular/fire/firestore';
import { isNameUnique } from '../core/utils/firestore-utils';

@Injectable({
    providedIn: 'root'
})
export class FirebaseAuthService implements IAuthService {
    private zone = inject(NgZone);
    private auth = inject(Auth);
    private userService = inject(USER_SERVICE);
    private firestore = inject(Firestore);

    private userSubject = new BehaviorSubject<User | null>(null);
    private initializedSubject = new BehaviorSubject<boolean>(false);

    currentUser$ = this.userSubject.asObservable();
    isInitialized$ = this.initializedSubject.asObservable();

    private profileSub?: Subscription;
    currentUserSignal = signal<User | null>(null);

    constructor() {
        // Listen to Firebase Auth state changes
        onAuthStateChanged(this.auth, (firebaseUser) => {
            console.log('[FirebaseAuthService] Auth state changed. User:', firebaseUser?.email);
            this.profileSub?.unsubscribe();

            if (firebaseUser) {
                console.log('[FirebaseAuthService] Subscribing to profile for UID:', firebaseUser.uid);
                // Enrich user with real-time role from Firestore
                this.profileSub = this.userService.getUserById$(firebaseUser.uid).subscribe(profile => {
                    console.log('[FirebaseAuthService] Received profile update:', profile);
                    this.zone.run(() => {
                        const mappedUser = this.mapFirebaseUser(firebaseUser, profile?.role, profile?.photo_url);
                        console.log('[FirebaseAuthService] Emitting user with role:', mappedUser.role);
                        this.userSubject.next(mappedUser);
                        this.currentUserSignal.set(mappedUser);

                        if (!this.initializedSubject.value) {
                            this.initializedSubject.next(true);
                        }
                    });
                });
            } else {
                this.zone.run(() => {
                    this.userSubject.next(null);
                    this.currentUserSignal.set(null);
                    if (!this.initializedSubject.value) {
                        this.initializedSubject.next(true);
                    }
                });
            }
        });
    }

    currentUser(): User | null {
        return this.currentUserSignal();
    }
    signIn(email: string, password: string): Observable<User> {
        return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
            switchMap(credential => this.userService.getUserById(credential.user.uid).pipe(
                map(profile => this.mapFirebaseUser(credential.user, profile?.role, profile?.photo_url))
            )),
            tap(user => this.userSubject.next(user))
        );
    }

    signUp(email: string, password: string, displayName: string): Observable<User> {
        return from(isNameUnique(this.firestore, 'users', 'displayName', displayName)).pipe(
            switchMap(isUnique => {
                if (!isUnique) return throwError(() => new Error('This display name is already taken.'));
                return from(createUserWithEmailAndPassword(this.auth, email, password));
            }),
            switchMap(credential => {
                const firebaseUser = credential.user;
                const user = this.mapFirebaseUser(firebaseUser);

                // Real implementation: create Firestore profile
                const profile: User = {
                    id: firebaseUser.uid,
                    display_name: displayName || firebaseUser.displayName || 'Authenticated User',
                    email: firebaseUser.email || email,
                    role: 'authenticated',
                    created_at: new Date(),
                    last_active_at: new Date(),
                    attendance_count: 0
                };

                return this.userService.createUser(profile).pipe(
                    map(() => user)
                );
            })
        );
    }

    signOut(): Observable<void> {
        return from(signOut(this.auth));
    }

    private mapFirebaseUser(firebaseUser: FirebaseUser, role?: UserRole, photoURL?: string | null): User {
        return {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            display_name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            role: role || 'authenticated',
            photo_url: photoURL || firebaseUser.photoURL || null,
            created_at: new Date()
        };
    }
}
