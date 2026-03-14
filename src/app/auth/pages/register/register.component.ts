import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AUTH_SERVICE } from '../../../core/contracts/auth.interface';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './register.component.html'
})
export class RegisterComponent {
    authService = inject(AUTH_SERVICE);
    router = inject(Router);

    displayName = '';
    email = '';
    password = '';
    errorMessage = '';
    isLoading = false;

    onSubmit() {
        if (!this.email || !this.password || !this.displayName) return;

        this.isLoading = true;
        this.errorMessage = '';

        this.authService.signUp(this.email, this.password, this.displayName).subscribe({
            next: () => {
                // Automatically redirects to home upon successful registration 
                this.router.navigate(['/']);
            },
            error: (err) => {
                this.errorMessage = err.message || 'Registration failed';
                this.isLoading = false;
            }
        });
    }
}
