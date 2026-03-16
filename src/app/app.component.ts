import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AUTH_SERVICE } from './core/contracts/auth.interface';
import { ToastComponent } from './core/components/toast/toast.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { BehaviorSubject, filter, map, switchMap, timer, tap, of, finalize, Subscription } from 'rxjs';
import { ToastService } from './core/services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, ToastComponent, FooterComponent],
  template: `
    <div class="fixed top-0 left-0 w-full h-progress z-progress bg-transparent pointer-events-none">
      <div class="h-full bg-primary transition-all duration-300 ease-out" 
           [style.width]="(isLoading$ | async) ? '100%' : '0%'"
           [class.animate-progress-indeterminate]="isLoading$ | async"></div>
    </div>

    <header class="bg-surface-card border-b border-border shadow-sm p-4 sticky top-0 z-50">
      <div class="max-w-5xl mx-auto flex justify-between items-center">
        <a routerLink="/" class="text-xl font-bold text-primary tracking-tight">CompSci Talks</a>
        <div class="flex gap-1 md:gap-4 items-center">
          <a routerLink="/schedule" routerLinkActive="text-primary font-semibold" class="text-xs md:text-sm font-medium text-text-muted hover:text-primary transition-colors">Schedule</a>
          <a routerLink="/archive" routerLinkActive="text-primary font-semibold" class="text-xs md:text-sm font-medium text-text-muted hover:text-primary transition-colors">Archive</a>
          
          <ng-container *ngIf="auth.currentUser$ | async as user; else guestLinks">
            <!-- Enhanced Admin Dashboard Link (T007) -->
            <a *ngIf="user.role === 'admin'" routerLink="/admin" 
               class="text-xs md:text-sm font-bold text-admin border border-admin px-2 py-1 rounded hover:bg-admin-light transition-all ml-1 md:ml-2">
              Admin
            </a>
            <a routerLink="/dashboard" class="text-xs md:text-sm font-medium text-text-muted hover:text-primary transition-colors ml-1 md:ml-4 hidden sm:inline">Dashboard</a>
            <span class="text-xs md:text-sm font-medium text-text-main hidden md:inline ml-4 border-l pl-4 border-border">Hi, {{ user.display_name }}</span>
            <button (click)="logout()" class="btn btn-outline py-1 px-2 md:px-3 text-xs md:text-sm ml-2 md:ml-4">Logout</button>
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
  auth = inject(AUTH_SERVICE);
  private router = inject(Router);
  private toastservice = inject(ToastService);

  isLoading$ = new BehaviorSubject<boolean>(false);
  private slowConnectionSub?: Subscription;

  ngOnInit() {
    // Navigation Loader Logic with 10s Timeout (T002, T004)
    this.router.events.pipe(
      filter(event =>
        event instanceof NavigationStart ||
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ),
      map(event => event instanceof NavigationStart),
      tap(loading => this.isLoading$.next(loading)),
      switchMap(loading => {
        if (loading) {
          return timer(10000).pipe(
            tap(() => {
              if (this.isLoading$.value) {
                this.toastservice.info('Loading is taking longer than expected. Please check your connection.');
              }
            })
          );
        }
        return of(null);
      })
    ).subscribe();

    // Admin Redirection Logic - Deep-link preservation (T006)
    this.auth.currentUser$.subscribe(user => {
      console.log('[AppComponent] Current user role:', user?.role);
      const currentUrl = this.router.url;
      const isEntryRoute = currentUrl === '/' || currentUrl === '/login';
      if (user?.role === 'admin' && isEntryRoute) {
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
