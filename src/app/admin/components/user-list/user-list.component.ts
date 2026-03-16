import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfile } from '../../../core/models/user-profile.model';
import { RoleToggleComponent } from '../role-toggle/role-toggle.component';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [CommonModule, RoleToggleComponent],
    template: `
    <div class="overflow-x-auto shadow-md sm:rounded-lg">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="p-4">
              <div class="flex items-center">
                <input id="checkbox-all-search" type="checkbox" (change)="toggleAll($event)" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                <label for="checkbox-all-search" class="sr-only">checkbox</label>
              </div>
            </th>
            <th scope="col" class="px-6 py-3">Name</th>
            <th scope="col" class="px-6 py-3">Email</th>
            <th scope="col" class="px-6 py-3">Role</th>
            <th scope="col" class="px-6 py-3">Created</th>
            <th scope="col" class="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngIf="loading && users.length === 0">
            <td colspan="6" class="px-6 py-4 text-center">
              <div class="flex justify-center items-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span class="ml-3">Loading users...</span>
              </div>
            </td>
          </tr>
          <tr *ngIf="!loading && users.length === 0" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td colspan="6" class="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
              No users found.
            </td>
          </tr>
          <tr *ngFor="let user of users" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td class="w-4 p-4">
              <div class="flex items-center">
                <input id="checkbox-table-search-{{user.uid}}" type="checkbox" [checked]="selectedUserIds.has(user.uid)" (change)="toggleUser(user.uid)" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                <label for="checkbox-table-search-{{user.uid}}" class="sr-only">checkbox</label>
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
            <td class="px-6 py-4">{{user.createdAt | date:'mediumDate'}}</td>
            <td class="px-6 py-4">
              <button (click)="viewDetail.emit(user.uid)" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">View details</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class UserListComponent {
    @Input() users: UserProfile[] = [];
    @Input() loading: boolean = false;
    @Input() selectedUserIds: Set<string> = new Set();
    @Input() currentUserId: string | null = null;

    @Output() viewDetail = new EventEmitter<string>();
    @Output() selectionChange = new EventEmitter<Set<string>>();
    @Output() roleChange = new EventEmitter<{ uid: string, role: 'admin' | 'user' | 'moderator' }>();

    onRoleUpdate(uid: string, role: 'admin' | 'user' | 'moderator'): void {
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
