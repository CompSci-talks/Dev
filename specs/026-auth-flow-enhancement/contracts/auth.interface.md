# Contract: IAuthService(Updated)

File: `src/app/core/contracts/auth.interface.ts`

    ```typescript
export interface IAuthService {
    // Existing methods...
    currentUser$: Observable<User | null>;
    isInitialized$: Observable<boolean>;
    currentUser(): User | null;
    signIn(email: string, password: string): Observable<User>;
    signUp(email: string, password: string, displayName: string): Observable<User>;
    signOut(): Observable<void>;
    sendVerificationEmail(): Observable<void>;
    reloadUser(): Observable<void>;

    /** 
     * NEW: Requests a password reset email from Firebase.
     * Firebase will send a link to the configured Action URL.
     */
    sendPasswordResetEmail(email: string): Observable<void>;

    /** 
     * NEW: Verifies the oobCode (action code) from the reset link.
     * Returns the email address associated with the link.
     */
    verifyPasswordResetCode(code: string): Observable<string>;

    /** 
     * NEW: Completes the password reset using the action code and a new password.
     */
    confirmPasswordReset(code: string, newPassword: string): Observable<void>;
}
```
