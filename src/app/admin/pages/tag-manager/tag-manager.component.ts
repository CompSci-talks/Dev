import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TAG_SERVICE } from '../../../core/contracts/tag.interface';
import { Tag } from '../../../core/models/seminar.model';
import { TagListComponent } from './tag-list.component';
import { ToastService } from '../../../core/services/toast.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-tag-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TagListComponent],
  template: `
    <div class="max-w-4xl">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-text-main font-display">Tag Manager</h1>
          <p class="text-text-muted">Categorize seminars with colorful tags.</p>
        </div>
        <button *ngIf="!showForm" (click)="showForm = true" 
                class="btn btn-primary">
          + New Tag
        </button>
      </div>

      <!-- Quick Form -->
      <div *ngIf="showForm" class="bg-surface-card p-6 rounded-xl border border-border shadow-premium mb-8 animate-fade-in">
        <h3 class="text-lg font-bold text-text-main mb-4 font-display">{{ editingTag ? 'Edit Tag' : 'Add New Tag' }}</h3>
        <form [formGroup]="tagForm" (ngSubmit)="saveTag()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-text-main mb-1">Tag Name</label>
            <input type="text" formControlName="name" 
                   class="input-field w-full" placeholder="e.g. AI, Research, Web">
          </div>
          <div>
            <label class="block text-sm font-medium text-text-main mb-1">Color Code</label>
            <div class="flex space-x-2">
              <input type="color" formControlName="color_code" 
                     class="h-10 w-16 p-1 border border-border rounded-lg cursor-pointer bg-surface">
              <input type="text" formControlName="color_code" 
                     class="flex-1 input-field uppercase font-mono" placeholder="#000000">
            </div>
          </div>
          <div class="md:col-span-2 flex justify-end space-x-3 mt-2">
            <button type="button" (click)="cancelEdit()" class="btn btn-ghost">Cancel</button>
            <button type="submit" [disabled]="tagForm.invalid" 
                    class="btn btn-primary min-w-[120px]">
              {{ editingTag ? 'Update Tag' : 'Save Tag' }}
            </button>
          </div>
        </form>
      </div>

      <!-- List -->
      <app-tag-list
        [tags]="tags"
        [loading]="loading"
        (edit)="editTag($event)"
        (onDelete)="deleteTag($event)"
      ></app-tag-list>
    </div>
  `
})
export class TagManagerComponent implements OnInit {
  private tagService = inject(TAG_SERVICE);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  tags: Tag[] = [];
  loading = false;
  showForm = false;
  editingTag: Tag | null = null;
  tagForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    color_code: ['#3B82F6', Validators.required]
  });

  ngOnInit() {
    this.loadTags();
  }

  private loadTags() {
    this.loading = true;
    this.tagService.getTags().pipe(take(1)).subscribe({
      next: (tags) => {
        this.tags = tags;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.tags = [];
      }
    });
  }

  editTag(tag: Tag) {
    this.editingTag = tag;
    this.showForm = true;
    this.tagForm.patchValue(tag);
  }

  cancelEdit() {
    this.showForm = false;
    this.editingTag = null;
    this.tagForm.reset({ color_code: '#3B82F6' });
  }

  saveTag() {
    if (this.tagForm.valid) {
      const operation = this.editingTag
        ? this.tagService.updateTag(this.editingTag.id, this.tagForm.value)
        : this.tagService.createTag(this.tagForm.value);

      operation.subscribe({
        next: () => {
          this.toastService.success(this.editingTag ? 'Tag updated successfully' : 'Tag created successfully');
          this.cancelEdit();
          this.loadTags();
        },
        error: (err: any) => {
          this.toastService.error(err.message || 'Failed to save tag');
        }
      });
    }
  }

  deleteTag(id: string) {
    if (confirm('Are you sure?')) {
      this.tagService.deleteTag(id).subscribe({
        next: () => {
          this.toastService.success('Tag deleted successfully');
          this.loadTags();
        },
        error: (err: any) => this.toastService.error(err.message || 'Failed to delete tag')
      });
    }
  }
}
