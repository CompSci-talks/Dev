import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map, take } from 'rxjs';
import { MockAuthService } from './services/mock-auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(MockAuthService);

    return authService.currentUser$.pipe(
        take(1),
        map(user => {
            if (user) {
                return true;
            }

            // Store the attempted URL for redirecting after login
            return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
        })
    );
};
