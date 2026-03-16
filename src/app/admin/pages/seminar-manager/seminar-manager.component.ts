import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeminarListComponent } from './seminar-list.component';
import { SeminarFormComponent } from './seminar-form.component';
import { ISeminarService, SEMINAR_SERVICE } from '../../../core/contracts/seminar.interface';
import { Seminar } from '../../../core/models/seminar.model';
import { Observable, take } from 'rxjs';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-seminar-manager',
  standalone: true,
  imports: [CommonModule, SeminarListComponent, SeminarFormComponent],
  template: `
    <div class="max-w-6xl">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Seminar Scheduling</h1>
          <p class="text-slate-500 mt-1 text-lg">Manage talk details, speaker assignments, and materials.</p>
        </div>
        <button *ngIf="!showForm" (click)="onCreate()" 
                class="btn-primary px-6 py-3 rounded-xl shadow-lg shadow-primary/20 flex items-center transform transition hover:-translate-y-0.5">
          <span class="mr-2 text-xl font-bold">+</span> Schedule Seminar
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
          [seminars]="seminars"
          [loading]="loading"
          (onEdit)="editSeminar($event)"
          (onDelete)="deleteSeminar($event)">
        </app-seminar-list>
      </div>
    </div>
  `
})
export class SeminarManagerComponent implements OnInit {
  private seminarService = inject(SEMINAR_SERVICE);
  private toastService = inject(ToastService);
  seminars: Seminar[] = [];
  loading = true;
  showForm = false;
  editingSeminar: Seminar | null = null;

  constructor() { }

  ngOnInit() {
    this.loadSeminars();
  }

  private loadSeminars() {
    this.loading = true;
    this.seminarService.getSeminars().pipe(take(1)).subscribe({
      next: (seminars) => {
        this.seminars = seminars;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.seminars = [];
      }
    });
  }

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
      this.seminarService.updateSeminar(this.editingSeminar.id, seminarData).subscribe({
        next: () => {
          this.toastService.success('Seminar updated successfully');
          this.refresh();
        },
        error: (err: any) => this.toastService.error(err.message || 'Failed to update seminar')
      });
    } else {
      this.seminarService.createSeminar(seminarData).subscribe({
        next: () => {
          this.toastService.success('Seminar scheduled successfully');
          this.refresh();
        },
        error: (err: any) => this.toastService.error(err.message || 'Failed to schedule seminar')
      });
    }
  }

  deleteSeminar(id: string) {
    if (confirm('Are you sure you want to delete this seminar?')) {
      this.seminarService.deleteSeminar(id).subscribe({
        next: () => {
          this.toastService.success('Seminar deleted successfully');
          this.refresh();
        },
        error: (err: any) => this.toastService.error(err.message || 'Failed to delete seminar')
      });
    }
  }

  closeForm() {
    this.showForm = false;
    this.editingSeminar = null;
  }

  private refresh() {
    this.closeForm();
    this.loadSeminars();
  }
}
