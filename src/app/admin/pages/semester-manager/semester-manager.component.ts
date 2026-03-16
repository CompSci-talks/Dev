import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SemesterListComponent } from './semester-list.component';
import { SemesterFormComponent } from './semester-form.component';
import { SEMESTER_SERVICE, ISemesterService } from '../../../core/contracts/semester.interface';
import { Semester } from '../../../core/models/semester.model';
import { Observable } from 'rxjs';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-semester-manager',
  standalone: true,
  imports: [CommonModule, SemesterListComponent, SemesterFormComponent],
  template: `
    <div class="max-w-4xl">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Semester Manager</h1>
          <p class="text-slate-600">Define academic terms and set the active semester.</p>
        </div>
        <button *ngIf="!showForm" (click)="onCreate()" 
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          + New Semester
        </button>
      </div>

      <div *ngIf="showForm" class="mb-8">
        <app-semester-form 
          [semester]="editingSemester" 
          (onSave)="saveSemester($event)" 
          (onCancel)="closeForm()">
        </app-semester-form>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <app-semester-list 
          [semesters]="semesters"
          [loading]="loading"
          (onEdit)="editSemester($event)"
          (onActivate)="setActive($event)"
          (onDelete)="deleteSemester($event)">
        </app-semester-list>
      </div>
    </div>
  `
})
export class SemesterManagerComponent implements OnInit {
  private semesterService = inject(SEMESTER_SERVICE);
  private toastService = inject(ToastService);
  semesters: Semester[] = [];
  loading = true;
  showForm = false;
  editingSemester: Semester | null = null;

  constructor() { }

  ngOnInit() {
    this.loadSemesters();
  }

  private loadSemesters() {
    this.loading = true;
    this.semesterService.getSemesters().subscribe({
      next: (semesters) => {
        this.semesters = semesters;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.semesters = [];
      }
    });
  }

  onCreate() {
    this.editingSemester = null;
    this.showForm = true;
  }

  editSemester(semester: Semester) {
    this.editingSemester = semester;
    this.showForm = true;
  }

  deleteSemester(id: string) {
    if (confirm('Are you sure you want to delete this semester?')) {
      this.semesterService.deleteSemester(id).subscribe(() => this.refresh());
    }
  }

  saveSemester(semesterData: Omit<Semester, 'id'>) {
    if (this.editingSemester) {
      this.semesterService.updateSemester(this.editingSemester.id, semesterData).subscribe({
        next: () => {
          this.toastService.success('Semester updated successfully');
          this.refresh();
        },
        error: (err: any) => this.toastService.error(err.message || 'Failed to update semester')
      });
    } else {
      this.semesterService.createSemester(semesterData).subscribe({
        next: () => {
          this.toastService.success('Semester created successfully');
          this.refresh();
        },
        error: (err: any) => this.toastService.error(err.message || 'Failed to create semester')
      });
    }
  }

  setActive(id: string) {
    this.semesterService.setActiveSemester(id).subscribe(() => this.refresh());
  }

  closeForm() {
    this.showForm = false;
    this.editingSemester = null;
  }

  private refresh() {
    this.closeForm();
    this.loadSemesters();
  }
}
