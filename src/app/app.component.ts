import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MockAuthService } from './core/services/mock-auth.service';
import { ToastComponent } from './core/components/toast/toast.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { BehaviorSubject, filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, ToastComponent, FooterComponent],
  template: `
    <div class="fixed top-0 left-0 w-full h-progress z-progress bg-transparent pointer-events-none">
      <div class="h-full bg-primary transition-all duration-300 ease-out w-0" 
           [class.w-full]="isLoading$ | async"
           [class.animate-progress-indeterminate]="isLoading$ | async"></div>
    </div>

    <header class="bg-surface-card border-b border-border shadow-sm p-4 sticky top-0 z-50">
      <div class="max-w-5xl mx-auto flex justify-between items-center">
        <a routerLink="/" class="text-xl font-bold text-primary">CompSci Talks</a>
        <div class="flex gap-4 items-center">
          <a routerLink="/schedule" class="text-sm font-medium text-text-muted hover:text-primary transition-colors">Schedule</a>
          <a routerLink="/archive" class="text-sm font-medium text-text-muted hover:text-primary transition-colors">Archive</a>
          
          <ng-container *ngIf="auth.currentUser$ | async as user; else guestLinks">
            <a *ngIf="user.role === 'admin'" routerLink="/admin" class="text-sm font-semibold text-primary hover:text-primary-hover transition-colors ml-4 hidden md:inline">Admin Dashboard</a>
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
export class AppComponent implements OnInit {
  auth = inject(MockAuthService);
  private router = inject(Router);

  isLoading$ = new BehaviorSubject<boolean>(false);

  ngOnInit() {
    // Navigation Loader Logic
    this.router.events.pipe(
      filter(event =>
        event instanceof NavigationStart ||
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ),
      map(event => event instanceof NavigationStart)
    ).subscribe(loading => this.isLoading$.next(loading));

    // Admin Redirection Logic
    this.auth.currentUser$.subscribe(user => {
      if (user?.role === 'admin' && (this.router.url === '/' || this.router.url === '/login')) {
        this.router.navigate(['/admin']);
      }
    });
  }

  logout() {
    this.auth.signOut().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
