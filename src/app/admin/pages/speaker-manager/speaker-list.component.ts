import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatedTableComponent } from '../../../shared/components/paginated-table/paginated-table.component';
import { Speaker } from '../../../core/models/seminar.model';

@Component({
  selector: 'app-speaker-list',
  standalone: true,
  imports: [CommonModule, PaginatedTableComponent],
  template: `
    <app-paginated-table
      [data]="speakers"
      [loading]="loading"
      [columnCount]="3"
      [headerTemplate]="headerTmpl"
      [rowTemplate]="rowTmpl"
      [skeletonTemplate]="skeletonTmpl"
      emptyMessage="No speakers found. Create your first speaker to get started."
    >
      <ng-template #headerTmpl>
        <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Name</th>
        <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Affiliation</th>
        <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Actions</th>
      </ng-template>

      <ng-template #rowTmpl let-speaker>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="font-medium text-slate-900">{{ speaker.name }}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-slate-600">
          {{ speaker.affiliation }}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex space-x-3">
            <button (click)="edit.emit(speaker)" class="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
            <button (click)="onDelete.emit(speaker.id)" class="text-red-600 hover:text-red-800 font-medium">Delete</button>
          </div>
        </td>
      </ng-template>

      <ng-template #skeletonTmpl>
        <tr *ngFor="let i of [1,2,3,4,5]" class="animate-pulse">
          <td class="px-6 py-4"><div class="h-4 bg-slate-200 rounded w-3/4"></div></td>
          <td class="px-6 py-4"><div class="h-4 bg-slate-200 rounded w-1/2"></div></td>
          <td class="px-6 py-4"><div class="h-4 bg-slate-200 rounded w-1/4"></div></td>
        </tr>
      </ng-template>
    </app-paginated-table>
  `
})
export class SpeakerListComponent {
  @Input() speakers: Speaker[] = [];
  @Input() loading = false;
  @Output() edit = new EventEmitter<Speaker>();
  @Output() onDelete = new EventEmitter<string>();
}
