import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { USER_SERVICE } from '../../../core/contracts/user.service.interface';
import { COMMENT_SERVICE } from '../../../core/contracts/comment.interface';
import { UserActivity } from '../../../core/models/user-activity.model';
import { UserDetailComponent } from '../../components/user-detail/user-detail.component';
import { ActivityHistoryComponent } from '../../components/user-activity/activity-history.component';
import { of, switchMap, catchError, finalize } from 'rxjs';
import { Comment } from '../../../core/models/comment.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-detail-page',
  standalone: true,
  imports: [CommonModule, UserDetailComponent, ActivityHistoryComponent, RouterModule],
  template: `
    <div class="p-6 max-w-7xl mx-auto">
      <div class="mb-6">
        <nav class="flex mb-4" aria-label="Breadcrumb">
          <ol class="inline-flex items-center space-x-1 md:space-x-3">
            <li class="inline-flex items-center">
              <a routerLink="/admin/user-management" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white transition-colors">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>
                User Management
              </a>
            </li>
            <li aria-current="page">
              <div class="flex items-center">
                <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg>
                <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">User Detail</span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">User Profile Detail</h1>
      </div>

      <div *ngIf="loading" class="space-y-6">
        <div class="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl shadow-sm"></div>
        <div class="h-96 bg-gray-100 dark:bg-gray-900/50 animate-pulse rounded-xl border border-gray-200 dark:border-gray-800"></div>
      </div>

      <div *ngIf="!loading && user" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-1 space-y-6">
          <app-user-detail [user]="user"></app-user-detail>
          
          <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
             <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
             <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-gray-500 dark:text-gray-400 text-sm">Attendance</span>
                  <span class="text-blue-600 dark:text-blue-400 font-bold">{{ user.attendance_count || 0 }} Seminars</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-500 dark:text-gray-400 text-sm">Member Since</span>
                  <span class="text-gray-900 dark:text-white text-sm">{{ user.created_at | date:'mediumDate' }}</span>
                </div>
             </div>
          </div>
        </div>

        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">Activity History</h2>
              <span *ngIf="loadingActivity" class="text-xs text-blue-500 animate-pulse font-medium">Updating...</span>
            </div>
            <div class="p-6">
              <div *ngIf="activityError" class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 border border-red-100 dark:border-red-900 flex items-center" role="alert">
                <svg class="flex-shrink-0 inline w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                <div><span class="font-medium">Notice:</span> Some activity logs could not be loaded.</div>
              </div>

              <!-- Comments list -->
              <div *ngIf="!loadingActivity">
                <div *ngIf="comments.length === 0" class="text-center py-8 text-gray-400 italic">
                  No activity history found for this user.
                </div>
                <div *ngFor="let comment of comments" class="flex gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      <span class="font-medium text-gray-700 dark:text-gray-300">
                        {{ comment.parent_id ? 'Replied in' : 'Commented on' }}
                      </span>
                      seminar
                      <a [routerLink]="['/seminar', comment.seminar_id]"
                         class="text-blue-600 hover:underline ml-1">{{ comment.seminar_title }}</a>
                    </p>
                    <p class="text-sm text-gray-800 dark:text-gray-200 italic truncate">"{{ comment.text }}"</p>
                    <p class="text-xs text-gray-400 mt-1">{{ comment.created_at | date:'medium' }}</p>
                  </div>
                </div>
              </div>

              <div *ngIf="loadingActivity && comments.length === 0" class="space-y-4">
                <div *ngFor="let i of [1,2,3,4]" class="flex space-x-3">
                  <div class="rounded-full bg-gray-200 dark:bg-gray-700 h-8 w-8 animate-pulse"></div>
                  <div class="flex-1 space-y-2 py-1">
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                    <div class="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && !user" class="p-12 text-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 max-w-lg mx-auto mt-20">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">User Not Found</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6 italic">This user may have been deleted or the UID is invalid.</p>
        <button routerLink="/admin/user-management" class="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all">
          Return to User Management
        </button>
      </div>
    </div>
  `
})
export class UserDetailPageComponent implements OnInit {
  private userService = inject(USER_SERVICE);
  private commentService = inject(COMMENT_SERVICE);
  private route = inject(ActivatedRoute);

  user: User | null = null;
  comments: Comment[] = [];
  loading = true;
  loadingActivity = false;
  activityError = false;

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => {
        const id = params['id'];
        if (id) {
          this.loadComments(id);
          return this.userService.getUserById(id);
        }
        return of(null);
      })
    ).subscribe(user => {
      this.user = user;
      this.loading = false;
    });
  }

  private loadComments(userId: string): void {
    this.loadingActivity = true;
    this.activityError = false;

    this.commentService.getAllComments().pipe(
      catchError(err => {
        console.error('Failed to load comments', err);
        this.activityError = true;
        return of([]);
      }),
      finalize(() => this.loadingActivity = false)
    ).subscribe(comments => {
      this.comments = comments
        .filter(c => c.author_id === userId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    });
  }
}