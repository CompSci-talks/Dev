import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SemesterListComponent } from './semester-list.component';
import { SemesterFormComponent } from './semester-form.component';
import { SEMESTER_SERVICE, ISemesterService } from '../../../core/contracts/semester.interface';
import { Semester } from '../../../core/models/semester.model';
import { Observable } from 'rxjs';

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
          [semesters]="(semesters$ | async) || []"
          (onEdit)="editSemester($event)"
          (onActivate)="setActive($event)">
        </app-semester-list>
      </div>
    </div>
  `
})
export class SemesterManagerComponent implements OnInit {
    semesters$: Observable<Semester[]>;
    showForm = false;
    editingSemester: Semester | null = null;

    constructor(@Inject(SEMESTER_SERVICE) private semesterService: ISemesterService) {
        this.semesters$ = this.semesterService.getSemesters();
    }

    ngOnInit() { }

    onCreate() {
        this.editingSemester = null;
        this.showForm = true;
    }

    editSemester(semester: Semester) {
        this.editingSemester = semester;
        this.showForm = true;
    }

    saveSemester(semesterData: Omit<Semester, 'id'>) {
        if (this.editingSemester) {
            this.semesterService.updateSemester(this.editingSemester.id, semesterData).subscribe(() => this.refresh());
        } else {
            this.semesterService.createSemester(semesterData).subscribe(() => this.refresh());
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
        this.semesters$ = this.semesterService.getSemesters();
    }
}
