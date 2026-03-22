import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Seminar, Speaker, Tag } from '../../../core/models/seminar.model';
import { SPEAKER_SERVICE, ISpeakerService } from '../../../core/contracts/speaker.interface';
import { TAG_SERVICE, ITagService } from '../../../core/contracts/tag.interface';
import { MultiSelectComponent } from '../../../shared/components/multi-select/multi-select.component';
import { Observable, map } from 'rxjs';
function driveUrlValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value || !value.trim()) return null;

  // Reject folder URLs explicitly
  if (/drive\.google\.com\/drive\/folders\//.test(value)) {
    return { invalidDriveUrl: true };
  }

  const isPlainId = /^[a-zA-Z0-9_-]{25,}$/.test(value.trim());
  const isFileUrl = /drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+/.test(value);
  const isOpenUrl = /drive\.google\.com\/open\?id=[a-zA-Z0-9_-]+/.test(value);

  if (isPlainId || isFileUrl || isOpenUrl) return null;
  return { invalidDriveUrl: true };
}
@Component({
  selector: 'app-seminar-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MultiSelectComponent],
  template: `
    <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl max-w-3xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold text-slate-900">{{ seminar ? 'Edit' : 'Schedule' }} Seminar</h3>
        <button (click)="onCancel.emit()" class="text-slate-400 hover:text-slate-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <form [formGroup]="seminarForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Basic Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-slate-700 mb-2">Seminar Title</label>
            <input type="text" formControlName="title" placeholder="e.g. Advanced Machine Learning Patterns"
                   class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                   [class.border-red-400]="isInvalid('title')">
            <p *ngIf="isInvalid('title')" class="text-xs text-red-500 mt-1">Title is required.</p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Date & Time</label>
            <input type="datetime-local" formControlName="date_time"
                   class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                   [class.border-red-400]="isInvalid('date_time')">
            <p *ngIf="isInvalid('date_time')" class="text-xs text-red-500 mt-1">Date & time is required.</p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Location</label>
            <input type="text" formControlName="location" placeholder="e.g. Hall A or Zoom Link"
                   class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                   [class.border-red-400]="isInvalid('location')">
            <p *ngIf="isInvalid('location')" class="text-xs text-red-500 mt-1">Location is required.</p>
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">Abstract (Markdown supported)</label>
          <textarea formControlName="abstract" rows="4" placeholder="Describe the seminar..."
                    class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all resize-none"
                    [class.border-red-400]="isInvalid('abstract')"></textarea>
          <p *ngIf="isInvalid('abstract')" class="text-xs text-red-500 mt-1">Abstract is required.</p>
        </div>

        <!-- Speakers & Tags -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Speakers</label>
            <app-multi-select
                [items]="(speakerItems$ | async) || []"
                placeholder="Find speakers..."
                formControlName="speaker_ids">
            </app-multi-select>
            <p *ngIf="isInvalid('speaker_ids')" class="text-xs text-red-500 mt-1">At least one speaker is required.</p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Tags</label>
            <app-multi-select
                [items]="(tagItems$ | async) || []"
                placeholder="Add tags..."
                formControlName="tag_ids">
            </app-multi-select>
            <p *ngIf="isInvalid('tag_ids')" class="text-xs text-red-500 mt-1">At least one tag is required.</p>
          </div>
        </div>

        <!-- Materials -->
        <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
          <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Materials & Media</h4>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-500 mb-1">Video Material ID / URL</label>
              <input type="text" formControlName="video_material_id"
                     placeholder="Google Drive ID or URL"
                     class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                     [class.border-red-400]="isInvalid('video_material_id')">
              <p *ngIf="isInvalid('video_material_id')" class="text-xs text-red-500 mt-1">
                Must be a valid Google Drive URL or file ID.
              </p>
              <p *ngIf="!isInvalid('video_material_id')" class="text-xs text-slate-400 mt-1">
                Paste a Drive link or leave empty.
              </p>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-500 mb-1">Presentation Material ID / URL</label>
              <input type="text" formControlName="presentation_material_id"
                     placeholder="Google Drive ID or URL"
                     class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                     [class.border-red-400]="isInvalid('presentation_material_id')">
              <p *ngIf="isInvalid('presentation_material_id')" class="text-xs text-red-500 mt-1">
                Must be a valid Google Drive URL or file ID.
              </p>
              <p *ngIf="!isInvalid('presentation_material_id')" class="text-xs text-slate-400 mt-1">
                Paste a Drive link or leave empty.
              </p>
            </div>

            <div class="md:col-span-2">
              <label class="block text-xs font-semibold text-slate-500 mb-1">Thumbnail URL</label>
              <input type="text" formControlName="thumbnail_url"
                     placeholder="e.g. https://assets.example.com/thumb.jpg"
                     class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                     [class.border-red-400]="isInvalid('thumbnail_url')">
              <p *ngIf="isInvalid('thumbnail_url')" class="text-xs text-red-500 mt-1">
                Must be a valid URL starting with http:// or https://
              </p>
              <p *ngIf="!isInvalid('thumbnail_url')" class="text-xs text-slate-400 mt-1">
                Direct image link or leave empty.
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <input type="checkbox" formControlName="is_hidden" id="is_hidden"
                   class="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500">
            <!-- <label for="is_hidden" class="text-sm text-slate-700 font-medium">
              Hide from public feed (Draft/Moderation)
            </label> -->
          </div>
        </div>

        <div class="flex justify-end items-center space-x-4 pt-6 border-t border-slate-100 mt-4">
          <button type="button" (click)="onCancel.emit()"
                  class="btn-outline px-6 py-3 rounded-xl font-semibold border-slate-300">
            Discard
          </button>
          <button type="submit" [disabled]="seminarForm.invalid"
                  class="btn-primary px-10 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 disabled:opacity-30 disabled:grayscale transition-all transform hover:-translate-y-0.5 active:scale-95">
            {{ seminar ? 'Update Seminar' : 'Schedule Seminar' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class SeminarFormComponent implements OnInit {
  @Input() seminar: Seminar | null = null;
  @Output() onSave = new EventEmitter<Omit<Seminar, 'id'>>();
  @Output() onCancel = new EventEmitter<void>();

  seminarForm: FormGroup;
  speakerItems$: Observable<{ id: string, name: string }[]>;
  tagItems$: Observable<{ id: string, name: string }[]>;

  constructor(
    private fb: FormBuilder,
    @Inject(SPEAKER_SERVICE) private speakerService: ISpeakerService,
    @Inject(TAG_SERVICE) private tagService: ITagService
  ) {
    this.speakerItems$ = this.speakerService.getSpeakers().pipe(
      map(speakers => speakers.map(s => ({ id: s.id, name: `${s.name} (${s.affiliation})` })))
    );
    this.tagItems$ = this.tagService.getTags().pipe(
      map(tags => tags.map(t => ({ id: t.id, name: t.name })))
    );

    this.seminarForm = this.fb.group({
      title: ['', Validators.required],
      date_time: ['', Validators.required],
      location: ['', Validators.required],
      abstract: ['', Validators.required],
      speaker_ids: [[], Validators.required],
      tag_ids: [[], Validators.required],
      video_material_id: ['', driveUrlValidator],
      presentation_material_id: ['', driveUrlValidator],
      is_hidden: [false],
      thumbnail_url: ['', Validators.pattern(/^(https?:\/\/.+)?$/)]
    });
  }

  ngOnInit() {
    if (this.seminar) {
      this.seminarForm.patchValue({
        ...this.seminar,
        date_time: this.formatDate(this.seminar.date_time)
      });
    }
  }

  isInvalid(field: string): boolean {
    const control = this.seminarForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  }

  onSubmit() {
    this.seminarForm.markAllAsTouched();
    if (this.seminarForm.invalid) return;

    const val = this.seminarForm.value;
    this.onSave.emit({
      ...val,
      date_time: new Date(val.date_time),
      speaker_ids: val.speaker_ids.filter((id: string) => !!id),
      tag_ids: val.tag_ids.filter((id: string) => !!id),
      video_material_id: this.extractDriveId(val.video_material_id),
      presentation_material_id: this.extractDriveId(val.presentation_material_id),
      thumbnail_url: val.thumbnail_url?.trim() || null
    });
  }

  private extractDriveId(input: string): string | null {
    if (!input || !input.trim()) return null;
    if (/^[a-zA-Z0-9_-]{25,}$/.test(input.trim())) return input.trim();
    const fileMatch = input.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch) return fileMatch[1];
    const folderMatch = input.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    if (folderMatch) return folderMatch[1];
    const openMatch = input.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (openMatch) return openMatch[1];
    return input;
  }
}