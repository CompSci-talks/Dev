import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MockAuthService } from '../../../core/services/mock-auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './register.component.html'
})
export class RegisterComponent {
    authService = inject(MockAuthService);
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
