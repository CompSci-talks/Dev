import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfile } from '../../../core/models/user-profile.model';
import { RoleToggleComponent } from '../role-toggle/role-toggle.component';
import { PaginatedTableComponent } from '../../../shared/components/paginated-table/paginated-table.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RoleToggleComponent, PaginatedTableComponent],
  template: `
    <app-paginated-table
      [data]="users"
      [loading]="loading"
      [columnCount]="7"
      [headerTemplate]="header"
      [rowTemplate]="row"
      [skeletonTemplate]="skeleton"
      [showPagination]="true"
      [currentPage]="currentPage"
      [hasMore]="hasMore"
      (pageChange)="pageChange.emit($event)"
      [trackByProperty]="'uid'"
      emptyMessage="No users found."
    >
      <ng-template #header>
        <th scope="col" class="p-4">
          <div class="flex items-center">
            <input id="checkbox-all-search" type="checkbox" (change)="toggleAll($event)" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            <label for="checkbox-all-search" class="sr-only">checkbox</label>
          </div>
        </th>
        <th scope="col" class="px-6 py-3">Name</th>
        <th scope="col" class="px-6 py-3">Email</th>
        <th scope="col" class="px-6 py-3">Role</th>
        <th scope="col" class="px-6 py-3 text-center">Attendance</th>
        <th scope="col" class="px-6 py-3">Created</th>
        <th scope="col" class="px-6 py-3">Action</th>
      </ng-template>

      <ng-template #row let-user>
        <td class="w-4 p-4">
          <div class="flex items-center">
            <input [id]="'checkbox-' + user.uid" type="checkbox" [checked]="selectedUserIds.has(user.uid)" (change)="toggleUser(user.uid)" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            <label [for]="'checkbox-' + user.uid" class="sr-only">Select {{ user.displayName }}</label>
          </div>
        </td>
        <th scope="row" class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
          <img class="w-10 h-10 rounded-full" [src]="user.photoURL || 'https://ui-avatars.com/api/?name=' + user.displayName" alt="{{user.displayName}} image">
          <div class="pl-3">
            <div class="text-base font-semibold">{{user.displayName}}</div>
            <div class="font-normal text-gray-500">Last active: {{user.lastActiveTimestamp | date:'short'}}</div>
          </div>
        </th>
        <td class="px-6 py-4">{{user.email}}</td>
        <td class="px-6 py-4">
           <app-role-toggle 
             [role]="user.role" 
             [disabled]="user.uid === currentUserId"
             (roleChange)="onRoleUpdate(user.uid, $event)"
           ></app-role-toggle>
        </td>
        <td class="px-6 py-4 text-center text-sm font-medium text-gray-900 dark:text-white">
          {{user.attendanceCount || 0}}
        </td>
        <td class="px-6 py-4">{{user.createdAt | date:'mediumDate'}}</td>
        <td class="px-6 py-4">
          <button (click)="viewDetail.emit(user.uid)" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">View details</button>
        </td>
      </ng-template>

      <ng-template #skeleton>
        <tr *ngFor="let i of [1,2,3,4,5]" class="animate-pulse">
          <td class="p-4"><div class="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
          <td class="px-6 py-4 flex items-center">
            <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div class="pl-3">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
          </td>
          <td class="px-6 py-4"><div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40"></div></td>
          <td class="px-6 py-4"><div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div></td>
          <td class="px-6 py-4 text-center"><div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8 mx-auto"></div></td>
          <td class="px-6 py-4"><div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div></td>
          <td class="px-6 py-4"><div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div></td>
        </tr>
      </ng-template>
    </app-paginated-table>
  `,
})
export class UserListComponent {
  @Input() users: UserProfile[] = [];
  @Input() loading: boolean = false;
  @Input() selectedUserIds: Set<string> = new Set();
  @Input() currentUserId: string | null = null;
  @Input() currentPage: number = 1;
  @Input() hasMore: boolean = false;

  @Output() viewDetail = new EventEmitter<string>();
  @Output() selectionChange = new EventEmitter<Set<string>>();
  @Output() roleChange = new EventEmitter<{ uid: string, role: 'admin' | 'moderator' | 'authenticated' }>();
  @Output() pageChange = new EventEmitter<'prev' | 'next'>();

  onRoleUpdate(uid: string, role: 'admin' | 'moderator' | 'authenticated'): void {
    this.roleChange.emit({ uid, role });
  }

  toggleUser(uid: string): void {
    if (this.selectedUserIds.has(uid)) {
      this.selectedUserIds.delete(uid);
    } else {
      this.selectedUserIds.add(uid);
    }
    this.selectionChange.emit(this.selectedUserIds);
  }

  toggleAll(event: any): void {
    if (event.target.checked) {
      this.users.forEach((u) => this.selectedUserIds.add(u.uid));
    } else {
      this.selectedUserIds.clear();
    }
    this.selectionChange.emit(this.selectedUserIds);
  }
}
