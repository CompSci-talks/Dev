import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeminarListComponent } from './seminar-list.component';
import { SeminarFormComponent } from './seminar-form.component';
import { ISeminarService } from '../../../core/contracts/seminar.interface';
import { Seminar } from '../../../core/models/seminar.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-seminar-manager',
  standalone: true,
  imports: [CommonModule, SeminarListComponent, SeminarFormComponent],
  template: `
    <div class="max-w-6xl">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Seminar Scheduling</h1>
          <p class="text-slate-500 mt-1">Manage talk details, speaker assignments, and materials.</p>
        </div>
        <button *ngIf="!showForm" (click)="onCreate()" 
                class="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center">
          <span class="mr-2">+</span> Schedule Seminar
        </button>
      </div>

      <div *ngIf="showForm" class="mb-10">
        <app-seminar-form 
          [seminar]="editingSeminar" 
          (onSave)="saveSeminar($event)" 
          (onCancel)="closeForm()">
        </app-seminar-form>
      </div>
      
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <app-seminar-list 
          [seminars]="(seminars$ | async) || []"
          (onEdit)="editSeminar($event)"
          (onDelete)="deleteSeminar($event)">
        </app-seminar-list>
      </div>
    </div>
  `
})
export class SeminarManagerComponent implements OnInit {
  seminars$: Observable<Seminar[]>;
  showForm = false;
  editingSeminar: Seminar | null = null;

  constructor(@Inject('ISeminarService') private seminarService: ISeminarService) {
    this.seminars$ = this.seminarService.getSeminars();
  }

  ngOnInit() { }

  onCreate() {
    this.editingSeminar = null;
    this.showForm = true;
  }

  editSeminar(seminar: Seminar) {
    this.editingSeminar = seminar;
    this.showForm = true;
  }

  saveSeminar(seminarData: Omit<Seminar, 'id'>) {
    if (this.editingSeminar) {
      this.seminarService.updateSeminar(this.editingSeminar.id, seminarData).subscribe(() => this.refresh());
    } else {
      this.seminarService.createSeminar(seminarData).subscribe(() => this.refresh());
    }
  }

  deleteSeminar(id: string) {
    if (confirm('Are you sure you want to delete this seminar?')) {
      this.seminarService.deleteSeminar(id).subscribe(() => this.refresh());
    }
  }

  closeForm() {
    this.showForm = false;
    this.editingSeminar = null;
  }

  private refresh() {
    this.closeForm();
    this.seminars$ = this.seminarService.getSeminars();
  }
}
