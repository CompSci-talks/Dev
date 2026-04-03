import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AUTH_SERVICE } from '../../../core/contracts/auth.interface';
import { ToastService } from '../../../core/services/toast.service';
import { take } from 'rxjs';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule
    ],
    templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
    private authService = inject(AUTH_SERVICE);
    private toastService = inject(ToastService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    newPassword = '';
    confirmPassword = '';
    oobCode = '';
    email = ''; // Loaded from verifyPasswordResetCode
    isLoading = false;
    isValidCode = false;
    isVerifying = true;

    ngOnInit() {
        this.oobCode = this.route.snapshot.queryParams['oobCode'];
        if (!this.oobCode) {
            this.toastService.error('Invalid or missing reset code');
            this.router.navigate(['/login']);
            return;
        }

        this.verifyCode();
    }

    verifyCode() {
        this.isVerifying = true;
        this.authService.verifyPasswordResetCode(this.oobCode).pipe(take(1)).subscribe({
            next: (email) => {
                this.email = email;
                this.isValidCode = true;
                this.isVerifying = false;
            },
            error: (err) => {
                this.toastService.error('Invalid or expired reset link');
                this.isVerifying = false;
                this.router.navigate(['/login']);
            }
        });
    }

    onSubmit() {
        if (!this.newPassword || this.newPassword !== this.confirmPassword) {
            this.toastService.error('Passwords do not match');
            return;
        }

        this.isLoading = true;
        this.authService.confirmPasswordReset(this.oobCode, this.newPassword).pipe(take(1)).subscribe({
            next: () => {
                this.toastService.success('Password reset successful! You can now log in.');
                this.router.navigate(['/login']);
            },
            error: (err) => {
                this.isLoading = false;
                this.toastService.error(err.message || 'Failed to reset password');
            }
        });
    }
}
