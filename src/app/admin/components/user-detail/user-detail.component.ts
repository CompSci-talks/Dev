import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfile } from '../../../core/models/user-profile.model';
import { UserActivity } from '../../../core/models/user-activity.model';
import { USER_ACTIVITY_SERVICE } from '../../../core/contracts/user-activity.service.interface';
import { Observable, catchError, of } from 'rxjs';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Profile Card -->
      <div class="md:col-span-1">
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div class="flex flex-col items-center">
            <img class="w-24 h-24 rounded-full mb-4" [src]="user.photoURL || 'https://ui-avatars.com/api/?name=' + user.displayName" alt="{{user.displayName}}">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{user.displayName}}</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 capitalize">{{user.role}}</p>
          </div>
          <div class="mt-6 space-y-4">
            <div>
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</label>
              <p class="text-sm text-gray-900 dark:text-white">{{user.email}}</p>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Enrollment Date</label>
              <p class="text-sm text-gray-900 dark:text-white">{{user.enrollmentDate | date:'mediumDate'}}</p>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Last Active</label>
              <p class="text-sm text-gray-900 dark:text-white">{{user.lastActiveTimestamp | date:'medium'}}</p>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Preferred Topics</label>
              <div class="flex flex-wrap gap-2 mt-1">
                <span *ngFor="let topic of user.preferredTopicAreas" class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full">
                  {{topic}}
                </span>
                <span *ngIf="!user.preferredTopicAreas?.length" class="text-sm text-gray-400">None specified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Activity Section -->
      <div class="md:col-span-2">
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
          </div>
          
          <!-- Loading State (Skeleton) -->
          <div *ngIf="loading" class="p-6 space-y-4">
            <div *ngFor="let i of [1,2,3]" class="animate-pulse flex space-x-4">
              <div class="rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10"></div>
              <div class="flex-1 space-y-2 py-1">
                <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>

          <!-- Activity List -->
          <ul *ngIf="!loading" class="divide-y divide-gray-200 dark:divide-gray-700">
            <li *ngFor="let activity of activities" class="p-6">
              <div class="flex items-center">
                <div [ngSwitch]="activity.type" class="flex-shrink-0">
                  <div *ngSwitchCase="'seminar_attendance'" class="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/></svg>
                  </div>
                  <div *ngSwitchCase="'comment_posted'" class="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-300">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/></svg>
                  </div>
                  <div *ngSwitchDefault class="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>
                  </div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    <ng-container [ngSwitch]="activity.type">
                      <span *ngSwitchCase="'seminar_attendance'">Attended: <strong>{{activity.metadata['seminarTitle']}}</strong></span>
                      <span *ngSwitchCase="'comment_posted'">Commented on <strong>{{activity.metadata['seminarTitle']}}</strong>: "{{activity.metadata['snippet']}}"</span>
                      <span *ngSwitchDefault>{{activity.type | titlecase}}</span>
                    </ng-container>
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{activity.timestamp | date:'medium'}}</p>
                </div>
              </div>
            </li>
            <li *ngIf="activities.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
              No recent activity recorded.
            </li>
          </ul>

          <!-- Partial Error State -->
          <div *ngIf="error" class="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-center text-sm">
            {{ error }}
          </div>
        </div>
      </div>
    </div>
  `
})
export class UserDetailComponent implements OnInit {
  @Input({ required: true }) user!: UserProfile;

  private activityService = inject(USER_ACTIVITY_SERVICE);

  activities: UserActivity[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadActivity();
  }

  loadActivity(): void {
    this.loading = true;
    this.activityService.getUserActivity(this.user.uid).pipe(
      catchError(err => {
        this.error = "Partial load failure: Some activity records couldn't be retrieved.";
        return of([]);
      })
    ).subscribe(acts => {
      this.activities = acts;
      this.loading = false;
    });
  }
}
