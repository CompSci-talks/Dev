import { Injectable, inject, NgZone } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser, setPersistence, browserLocalPersistence } from '@angular/fire/auth';
import { BehaviorSubject, Observable, from, map, take, tap, switchMap, Subscription } from 'rxjs';
import { IAuthService } from '../core/contracts/auth.interface';
import { USER_SERVICE } from '../core/contracts/user.service.interface';
import { User } from '../core/models/user.model';

@Injectable({
    providedIn: 'root'
})
export class FirebaseAuthService implements IAuthService {
    private zone = inject(NgZone);
    private auth = inject(Auth);
    private userService = inject(USER_SERVICE);

    private userSubject = new BehaviorSubject<User | null>(null);
    private initializedSubject = new BehaviorSubject<boolean>(false);

    currentUser$ = this.userSubject.asObservable();
    isInitialized$ = this.initializedSubject.asObservable();

    private profileSub?: Subscription;

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
                        const mappedUser = this.mapFirebaseUser(firebaseUser, profile?.role);
                        console.log('[FirebaseAuthService] Emitting user with role:', mappedUser.role);
                        this.userSubject.next(mappedUser);

                        if (!this.initializedSubject.value) {
                            this.initializedSubject.next(true);
                        }
                    });
                });
            } else {
                this.zone.run(() => {
                    this.userSubject.next(null);
                    if (!this.initializedSubject.value) {
                        this.initializedSubject.next(true);
                    }
                });
            }
        });
    }

    signIn(email: string, password: string): Observable<User> {
        return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
            switchMap(credential => this.userService.getUserById(credential.user.uid).pipe(
                map(profile => this.mapFirebaseUser(credential.user, profile?.role))
            )),
            tap(user => this.userSubject.next(user))
        );
    }

    signUp(email: string, password: string, displayName: string): Observable<User> {
        return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
            switchMap(credential => {
                const firebaseUser = credential.user;
                const user = this.mapFirebaseUser(firebaseUser);

                // Real implementation: create Firestore profile
                const profile = {
                    uid: firebaseUser.uid,
                    displayName: displayName || firebaseUser.displayName || 'Authenticated User',
                    email: firebaseUser.email || email,
                    role: 'authenticated' as const,
                    createdAt: new Date(),
                    lastLogin: new Date(),
                    lastActiveTimestamp: new Date(),
                    attendanceCount: 0
                };

                return this.userService.createUserProfile(profile).pipe(
                    map(() => user)
                );
            })
        );
    }

    signOut(): Observable<void> {
        return from(signOut(this.auth));
    }

    private mapFirebaseUser(firebaseUser: FirebaseUser, role?: 'admin' | 'moderator' | 'authenticated'): User {
        return {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            display_name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            role: role || 'authenticated',
            created_at: new Date()
        };
    }
}
