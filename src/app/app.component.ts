import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MockAuthService } from './core/services/mock-auth.service';
import { ToastComponent } from './core/components/toast/toast.component';
import { FooterComponent } from './core/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, ToastComponent, FooterComponent],
  template: `
    <header class="bg-surface-card border-b border-border shadow-sm p-4 sticky top-0 z-50">
      <div class="max-w-5xl mx-auto flex justify-between items-center">
        <a routerLink="/" class="text-xl font-bold text-primary">CompSci Talks</a>
        <div class="flex gap-4 items-center">
          <a routerLink="/schedule" class="text-sm font-medium text-text-muted hover:text-primary transition-colors">Schedule</a>
          <a routerLink="/archive" class="text-sm font-medium text-text-muted hover:text-primary transition-colors">Archive</a>
          
          <ng-container *ngIf="auth.currentUser$ | async as user; else guestLinks">
            <a routerLink="/dashboard" class="text-sm font-medium text-text-muted hover:text-primary transition-colors ml-4 hidden md:inline">Dashboard</a>
            <span class="text-sm font-medium text-text-main hidden md:inline ml-4 border-l pl-4 border-border">Hi, {{ user.display_name }}</span>
            <button (click)="logout()" class="btn btn-outline py-1 px-3 text-sm ml-4">Logout</button>
          </ng-container>
          
          <ng-template #guestLinks>
            <a routerLink="/login" class="btn btn-primary py-1 px-3 text-sm ml-4">Login</a>
          </ng-template>
        </div>
      </div>
    </header>

    <main class="min-h-screen pb-12">
      <router-outlet></router-outlet>
    </main>

    <app-footer></app-footer>
    <app-toast></app-toast>
  `
})
export class AppComponent {
  auth = inject(MockAuthService);

  logout() {
    this.auth.signOut().subscribe();
  }
}
