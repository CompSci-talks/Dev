import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Semester } from '../../../core/models/semester.model';

@Component({
    selector: 'app-semester-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50 border-b border-slate-200">
            <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Start Date</th>
            <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">End Date</th>
            <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr *ngFor="let semester of semesters" class="hover:bg-slate-50 transition-colors">
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
                      class="text-slate-500 hover:text-slate-800 font-medium">
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class SemesterListComponent {
    @Input() semesters: Semester[] = [];
    @Output() onEdit = new EventEmitter<Semester>();
    @Output() onActivate = new EventEmitter<string>();
}
