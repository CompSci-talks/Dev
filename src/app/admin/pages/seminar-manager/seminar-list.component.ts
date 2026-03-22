import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Seminar } from '../../../core/models/seminar.model';
import { PaginatedTableComponent } from '../../../shared/components/paginated-table/paginated-table.component';

@Component({
  selector: 'app-seminar-list',
  standalone: true,
  imports: [CommonModule, RouterModule, PaginatedTableComponent],
  template: `
    <app-paginated-table
      [data]="seminars"
      [loading]="loading"
      [columnCount]="6"
      [headerTemplate]="header"
      [rowTemplate]="row"
      [skeletonTemplate]="skeleton"
      [showPagination]="false"
      emptyMessage="No seminars scheduled."
    >
      <ng-template #header>
        <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date & Time</th>
        <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Seminar Title</th>
        <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
        <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">RSVPs</th>
        <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
        <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
      </ng-template>

      <ng-template #row let-seminar>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
          {{ seminar.date_time | date:'short' }}
        </td>
        <td class="px-6 py-4">
          <a [routerLink]="['/seminar', seminar.id]" class="font-medium text-slate-900">{{ seminar.title }}</a>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
          {{ seminar.location }}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-blue-600">
          {{ getRSVPCount(seminar) }}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span *ngIf="!seminar.is_hidden" 
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
            Visible
          </span>
          <span *ngIf="seminar.is_hidden" 
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
            Hidden
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
          <a [routerLink]="['/admin/seminar', seminar.id, 'attendance']"
             class="text-admin hover:text-admin-hover font-medium mr-4">
            Attendance
          </a>
          <button (click)="onEdit.emit(seminar)"
                  class="text-blue-600 hover:text-blue-800 font-medium mr-4">
            Edit
          </button>
          <button (click)="onDelete.emit(seminar.id)"
                  class="text-red-500 hover:text-red-700 font-medium">
            Delete
          </button>
        </td>
      </ng-template>

      <ng-template #skeleton>
        <tr *ngFor="let i of [1,2,3,4,5]" class="animate-pulse">
          <td class="px-6 py-4"><div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div></td>
          <td class="px-6 py-4"><div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div></td>
          <td class="px-6 py-4"><div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div></td>
          <td class="px-6 py-4 text-center"><div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8 mx-auto"></div></td>
          <td class="px-6 py-4"><div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div></td>
          <td class="px-6 py-4 text-right"><div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 ml-auto"></div></td>
        </tr>
      </ng-template>
    </app-paginated-table>
  `
})
export class SeminarListComponent {
  @Input() seminars: Seminar[] = [];
  @Input() loading: boolean = false;
  @Output() onEdit = new EventEmitter<Seminar>();
  @Output() onDelete = new EventEmitter<string>();

  getRSVPCount(seminar: Seminar): number {
    return seminar.stats?.rsvp_count || 0;
  }
}
