import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TAG_SERVICE } from '../../../core/contracts/tag.interface';
import { Tag } from '../../../core/models/seminar.model';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-tag-manager',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="max-w-4xl">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Tag Manager</h1>
          <p class="text-slate-600">Categorize seminars with colorful tags.</p>
        </div>
        <button *ngIf="!showForm" (click)="showForm = true" 
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          + New Tag
        </button>
      </div>

      <!-- Quick Form -->
      <div *ngIf="showForm" class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
        <h3 class="text-lg font-bold mb-4">Add New Tag</h3>
        <form [formGroup]="tagForm" (ngSubmit)="saveTag()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Tag Name</label>
            <input type="text" formControlName="name" 
                   class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Color Code</label>
            <div class="flex space-x-2">
              <input type="color" formControlName="color_code" 
                     class="h-10 w-16 p-1 border rounded-lg cursor-pointer">
              <input type="text" formControlName="color_code" 
                     class="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono">
            </div>
          </div>
          <div class="md:col-span-2 flex justify-end space-x-3">
            <button type="button" (click)="showForm = false" class="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
            <button type="submit" [disabled]="tagForm.invalid" 
                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">Save Tag</button>
          </div>
        </form>
      </div>

      <!-- List -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden text-sm">
        <div class="p-4 border-b border-slate-100 bg-slate-50 font-bold grid grid-cols-3 gap-4">
          <span>Preview</span>
          <span>Name</span>
          <span>Actions</span>
        </div>
        <div *ngFor="let tag of tags$ | async" class="p-4 border-b border-slate-100 grid grid-cols-3 gap-4 hover:bg-slate-50 items-center">
          <div>
             <span [style.backgroundColor]="tag.color_code" class="px-3 py-1 rounded-full text-white text-xs font-bold shadow-sm">
               {{ tag.name }}
             </span>
          </div>
          <div class="font-medium text-slate-900 font-mono">{{ tag.color_code }}</div>
          <div>
            <button (click)="deleteTag(tag.id)" class="text-red-600 hover:text-red-800 font-medium">Delete</button>
          </div>
        </div>
        <div *ngIf="!(tags$ | async)?.length" class="p-12 text-center text-slate-400">
          No tags found. Create your first tag to get started.
        </div>
      </div>
    </div>
  `
})
export class TagManagerComponent implements OnInit {
    private tagService = inject(TAG_SERVICE);
    private fb = inject(FormBuilder);

    tags$ = this.tagService.getTags();
    showForm = false;
    tagForm: FormGroup = this.fb.group({
        name: ['', Validators.required],
        color_code: ['#3B82F6', Validators.required]
    });

    ngOnInit() { }

    saveTag() {
        if (this.tagForm.valid) {
            this.tagService.createTag(this.tagForm.value).subscribe(() => {
                this.showForm = false;
                this.tagForm.patchValue({ color_code: '#3B82F6' });
                this.tags$ = this.tagService.getTags();
            });
        }
    }

    deleteTag(id: string) {
        if (confirm('Are you sure?')) {
            this.tagService.deleteTag(id).subscribe(() => {
                this.tags$ = this.tagService.getTags();
            });
        }
    }
}
