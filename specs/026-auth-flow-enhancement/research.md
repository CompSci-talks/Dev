# Research: Auth Flow Implementation Patterns

## Decision 1: Custom Password Reset URL
- **Problem**: Default Firebase reset emails lead to a non-branded Firebase page.
- **Decision**: Configure Firebase Action URL to point to our Angular app's route: `/auth/reset-password`.
- **Implementation**: 
    - Construct the reset link using `auth.generatePasswordResetLink(email, actionCodeSettings)` if we want to send it ourselves, or simply update the template in Firebase Console to point to our domain.
    - The link will look like: `https://[domain]/auth/reset-password?oobCode=[CODE]&apiKey=[KEY]&...`
- **Rationale**: Maintains brand consistency and provides a premium user experience.

## Decision 2: Handling oobCode (Action Code)
- **Problem**: The app needs to verify and apply the reset code.
- **Decision**: Use `AngularFire`'s `verifyPasswordResetCode` and `confirmPasswordReset` methods.
- **Workflow**:
    1. `ResetPasswordComponent` extracts `oobCode` from URL.
    2. Calls `authService.verifyResetCode(code)` to validate link and get user email.
    3. User submits new password.
    4. Calls `authService.confirmReset(code, newPassword)`.
- **Rationale**: Secure and standard way to handle Firebase action codes in-app.

## Decision 3: Strict Verification Guard
- **Problem**: Redirecting from "any" route (including Home) when logged in but unverified.
- **Decision**: Update `authGuard` to check verification status for all routes it protects.
- **Logic**:
    ```typescript
    if (user && !user.email_verified && state.url !== '/verify-email') {
        return router.createUrlTree(['/verify-email']);
    }
    ```
- **Application**: Apply `authGuard` to the root route `''` in `app.routes.ts`. This will trigger for Home, Archive, etc. 
- **Caveat**: Must ensure the guard allows the user to actually *be* on `/verify-email` and still allows unauthenticated users to see public pages.
- **Refined Logic**:
    - If user exists -> Check verification -> redirect if needed.
    - If user does not exist -> Allow public routes (Home, Schedule, etc.), redirect to login for protected routes (Dashboard).

## Decision 4: Polling & Cooldown
- **Decision**: Use RxJS `interval(5000)` for polling and a local timer for the 60s cooldown.
- **Rationale**: Simple, effective, and fulfills UX requirements.
