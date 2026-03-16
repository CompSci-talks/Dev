import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Semester } from '../../../core/models/semester.model';
import { PaginatedTableComponent } from '../../../shared/components/paginated-table/paginated-table.component';

@Component({
  selector: 'app-semester-list',
  standalone: true,
  imports: [CommonModule, PaginatedTableComponent],
  template: `
    <app-paginated-table
      [data]="semesters"
      [loading]="loading"
      [columnCount]="5"
      [headerTemplate]="header"
      [rowTemplate]="row"
      [skeletonTemplate]="skeleton"
      [showPagination]="false"
      emptyMessage="No semesters found."
    >
      <ng-template #header>
        <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
        <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
        <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Start Date</th>
        <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">End Date</th>
        <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
      </ng-template>

      <ng-template #row let-semester>
        <td class="px-6 py-4 whitespace-nowrap">
          <span *ngIf="semester.is_active" 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            ACTIVE
          </span>
          <span *ngIf="!semester.is_active" 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
            INACTIVE
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{{ semester.name }}</td>
        <td class="px-6 py-4 whitespace-nowrap text-slate-600 text-sm">{{ semester.start_date | date:'longDate' }}</td>
        <td class="px-6 py-4 whitespace-nowrap text-slate-600 text-sm">{{ semester.end_date | date:'longDate' }}</td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
          <button *ngIf="!semester.is_active" (click)="onActivate.emit(semester.id)"
                  class="text-blue-600 hover:text-blue-800 font-medium mr-4">
            Set Active
          </button>
          <button (click)="onEdit.emit(semester)"
                  class="text-slate-500 hover:text-slate-800 font-medium mr-4">
            Edit
          </button>
          <button (click)="onDelete.emit(semester.id)"
                  class="text-red-500 hover:text-red-700 font-medium">
            Delete
          </button>
        </td>
      </ng-template>

      <ng-template #skeleton>
        <tr *ngFor="let i of [1,2,3]" class="animate-pulse">
          <td class="px-6 py-4"><div class="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div></td>
          <td class="px-6 py-4"><div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div></td>
          <td class="px-6 py-4"><div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28"></div></td>
          <td class="px-6 py-4"><div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28"></div></td>
          <td class="px-6 py-4 text-right"><div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 ml-auto"></div></td>
        </tr>
      </ng-template>
    </app-paginated-table>
  `
})
export class SemesterListComponent {
  @Input() semesters: Semester[] = [];
  @Input() loading: boolean = false;
  @Output() onEdit = new EventEmitter<Semester>();
  @Output() onActivate = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<string>();
}
