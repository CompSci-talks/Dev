import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Seminar } from '../../../core/models/seminar.model';

@Component({
    selector: 'app-seminar-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50 border-b border-slate-200">
            <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date & Time</th>
            <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Seminar Title</th>
            <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
            <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">RSVPs</th>
            <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr *ngFor="let seminar of seminars" class="hover:bg-slate-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
              {{ seminar.date_time | date:'short' }}
            </td>
            <td class="px-6 py-4">
              <div class="font-medium text-slate-900">{{ seminar.title }}</div>
              <div class="text-xs text-slate-500 truncate max-w-xs">{{ seminar.location }}</div>
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
              <button (click)="onEdit.emit(seminar)"
                      class="text-blue-600 hover:text-blue-800 font-medium mr-4">
                Edit
              </button>
              <button (click)="onDelete.emit(seminar.id)"
                      class="text-red-500 hover:text-red-700 font-medium">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class SeminarListComponent {
    @Input() seminars: Seminar[] = [];
    @Output() onEdit = new EventEmitter<Seminar>();
    @Output() onDelete = new EventEmitter<string>();

    getRSVPCount(seminar: Seminar): number {
        // Mock RSVP count logic - in a real app this would be joined or fetched via service
        return Math.floor(Math.random() * 50);
    }
}
