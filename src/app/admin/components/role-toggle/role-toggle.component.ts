import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-role-toggle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <select 
      [(ngModel)]="role" 
      (ngModelChange)="onRoleChange($event)"
      [disabled]="disabled"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <option value="authenticated">User</option>
      <option value="moderator">Moderator</option>
      <option value="admin">Admin</option>
    </select>
  `
})
export class RoleToggleComponent {
  @Input() role: 'admin' | 'moderator' | 'authenticated' = 'authenticated';
  @Input() disabled: boolean = false;
  @Output() roleChange = new EventEmitter<'admin' | 'moderator' | 'authenticated'>();

  onRoleChange(newRole: 'admin' | 'moderator' | 'authenticated'): void {
    this.roleChange.emit(newRole);
  }
}
