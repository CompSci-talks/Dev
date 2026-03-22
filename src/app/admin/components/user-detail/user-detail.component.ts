import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfile } from '../../../core/models/user-profile.model';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-gray-800 shadow rounded-xl p-6 border border-gray-100 dark:border-gray-700">
      <div class="flex flex-col items-center text-center mb-6">
        <div class="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-2xl font-bold mb-3">
          {{ user.displayName.charAt(0).toUpperCase() }}
        </div>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ user.displayName }}</h2>
        <span class="mt-1 px-3 py-0.5 rounded-full text-xs font-semibold capitalize"
          [class.bg-red-100]="user.role === 'admin'"
          [class.text-red-700]="user.role === 'admin'"
          [class.bg-purple-100]="user.role === 'moderator'"
          [class.text-purple-700]="user.role === 'moderator'"
          [class.bg-green-100]="user.role === 'authenticated'"
          [class.text-green-700]="user.role === 'authenticated'"
        >{{ user.role }}</span>
      </div>

      <div class="space-y-4">
        <div>
          <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</label>
          <p class="text-sm text-gray-900 dark:text-white mt-0.5">{{ user.email }}</p>
        </div>
        <div>
          <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Enrollment Date</label>
          <p class="text-sm text-gray-900 dark:text-white mt-0.5">{{ user.enrollmentDate | date:'mediumDate' }}</p>
        </div>
        <div>
          <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Active</label>
          <p class="text-sm text-gray-900 dark:text-white mt-0.5">{{ user.lastActiveTimestamp | date:'medium' }}</p>
        </div>
        <div>
          <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Preferred Topics</label>
          <div class="flex flex-wrap gap-2 mt-1">
            <span *ngFor="let topic of user.preferredTopicAreas"
              class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-600 dark:text-gray-300">
              {{ topic }}
            </span>
            <span *ngIf="!user.preferredTopicAreas?.length" class="text-sm text-gray-400 italic">None specified</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UserDetailComponent {
  @Input({ required: true }) user!: UserProfile;
}