import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AUTH_SERVICE } from '../../../core/contracts/auth.interface';
import { ToastService } from '../../../core/services/toast.service';
import { getAuthErrorMessage } from '../../../core/utils/auth-error-messages';


@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule
    ],
    templateUrl: './login.component.html'
})
export class LoginComponent {
    authService = inject(AUTH_SERVICE);
    router = inject(Router);
    route = inject(ActivatedRoute);
    toastService = inject(ToastService);

    email = '';
    password = '';
    errorMessage = '';
    isLoading = false;

    onSubmit() {
        if (!this.email || !this.password) return;

        this.isLoading = true;
        this.errorMessage = '';

        this.authService.signIn(this.email, this.password).subscribe({
            next: () => {
                // Redirect to intended URL or home
                const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                this.router.navigateByUrl(returnUrl);
            },
            error: (err) => {
                this.errorMessage = getAuthErrorMessage(err.code || err.message || 'auth/internal-error');
                this.isLoading = false;
                this.toastService.error(this.errorMessage);
            }
        });
    }
}
