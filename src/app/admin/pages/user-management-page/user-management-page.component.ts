import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { USER_SERVICE } from '../../../core/contracts/user.service.interface';
import { AUTH_SERVICE } from '../../../core/contracts/auth.interface';
import { UserProfile } from '../../../core/models/user-profile.model';
import { UserListComponent } from '../../components/user-list/user-list.component';
import { TextFilterComponent } from '../../../shared/components/text-filter/text-filter.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ToastService } from '../../../core/services/toast.service';
import { BehaviorSubject, combineLatest, debounceTime, map, startWith, switchMap, tap } from 'rxjs';

@Component({
    selector: 'app-user-management-page',
    standalone: true,
    imports: [CommonModule, UserListComponent, TextFilterComponent, PaginationComponent],
    template: `
    <div class="p-6">
      <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <div class="flex items-center space-x-3">
          <button 
            *ngIf="selectedUserIds.size > 0"
            (click)="onEmailSelected()"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-colors"
          >
            Email Selected ({{ selectedUserIds.size }})
          </button>
          <app-text-filter 
            class="w-full md:w-64"
            placeholder="Search by name..."
            (filterChange)="onFilterChange($event)"
          ></app-text-filter>
        </div>
      </div>

      <app-user-list
        [users]="users"
        [loading]="loading"
        [selectedUserIds]="selectedUserIds"
        [currentUserId]="currentUserId"
        (viewDetail)="onViewDetail($event)"
        (selectionChange)="onSelectionChange($event)"
        (roleChange)="onRoleChange($event)"
      ></app-user-list>

      <div class="mt-4">
        <app-pagination
          [currentPage]="currentPage"
          [hasMore]="hasMore"
          (pageChange)="onPageChange($event)"
        ></app-pagination>
      </div>
    </div>
  `
})
export class UserManagementPageComponent implements OnInit {
    private userService = inject(USER_SERVICE);
    private authService = inject(AUTH_SERVICE);
    private toastService = inject(ToastService);
    private router = inject(Router);

    users: UserProfile[] = [];
    loading = true;
    currentPage = 1;
    hasMore = false;
    selectedUserIds: Set<string> = new Set();
    currentUserId: string | null = null;

    private filter$ = new BehaviorSubject<string>('');
    private page$ = new BehaviorSubject<number>(1);
    private pageSize = 10;
    private lastUsers: (UserProfile | undefined)[] = [undefined]; // For back navigation cursor tracking

    ngOnInit(): void {
        // Get current user for self-demotion check
        this.authService.currentUser$.subscribe(user => this.currentUserId = user?.id || null);

        combineLatest([this.filter$, this.page$]).pipe(
            debounceTime(100),
            tap(() => this.loading = true),
            switchMap(([filter, page]) => {
                const lastUser = this.lastUsers[page - 1];
                return this.userService.getUsers(this.pageSize, lastUser, filter);
            })
        ).subscribe({
            next: (users) => {
                this.users = users;
                this.loading = false;
                this.hasMore = users.length === this.pageSize;

                // Track the last user of the current page to support next page navigation
                if (this.hasMore) {
                    this.lastUsers[this.currentPage] = users[users.length - 1];
                }
            },
            error: (err) => {
                console.error('Failed to load users', err);
                this.loading = false;
                this.users = [];
            }
        });
    }

    onFilterChange(filter: string): void {
        this.filter$.next(filter);
        this.currentPage = 1;
        this.page$.next(1);
        this.lastUsers = [undefined];
        this.selectedUserIds.clear();
    }

    onPageChange(direction: 'prev' | 'next'): void {
        if (direction === 'next' && this.hasMore) {
            this.currentPage++;
            this.page$.next(this.currentPage);
        } else if (direction === 'prev' && this.currentPage > 1) {
            this.currentPage--;
            this.page$.next(this.currentPage);
        }
    }

    onViewDetail(uid: string): void {
        this.router.navigate(['/admin/user', uid]);
    }

    onSelectionChange(selected: Set<string>): void {
        this.selectedUserIds = new Set(selected);
    }

    onRoleChange(event: { uid: string, role: 'admin' | 'user' | 'moderator' }): void {
        this.userService.updateUserRole(event.uid, event.role).subscribe({
            next: () => this.toastService.success(`Role updated to ${event.role}`),
            error: () => this.toastService.error('Failed to update role')
        });
    }

    onEmailSelected(): void {
        if (this.selectedUserIds.size === 0) {
            this.toastService.error('Please select at least one user.');
            return;
        }
        if (this.selectedUserIds.size > 50) {
            this.toastService.error('You can only email up to 50 users at a time.');
            return;
        }

        this.userService.sendBulkEmail(Array.from(this.selectedUserIds), 'Subject', 'Message body').subscribe({
            next: () => {
                this.toastService.success(`Emailing ${this.selectedUserIds.size} users...`);
                this.selectedUserIds.clear();
            },
            error: () => this.toastService.error('Failed to initiate bulk email')
        });
    }
}
