import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Seminar, Speaker, Tag } from '../../../core/models/seminar.model';
import { SPEAKER_SERVICE, ISpeakerService } from '../../../core/contracts/speaker.interface';
import { TAG_SERVICE, ITagService } from '../../../core/contracts/tag.interface';
import { MultiSelectComponent } from '../../../shared/components/multi-select/multi-select.component';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-seminar-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MultiSelectComponent],
  template: `
    <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl max-w-3xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold text-slate-900">{{ seminar ? 'Edit' : 'Schedule' }} Seminar</h3>
        <button (click)="onCancel.emit()" class="text-slate-400 hover:text-slate-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      
      <form [formGroup]="seminarForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Basic Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-slate-700 mb-2">Seminar Title</label>
            <input type="text" formControlName="title" placeholder="e.g. Advanced Machine Learning Patterns"
                   class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all">
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Date & Time</label>
            <input type="datetime-local" formControlName="date_time"
                   class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all">
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Location</label>
            <input type="text" formControlName="location" placeholder="e.g. Hall A or Zoom Link"
                   class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all">
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">Abstract (Markdown supported)</label>
          <textarea formControlName="abstract" rows="4" placeholder="Describe the seminar..."
                    class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all resize-none"></textarea>
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
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Tags</label>
            <app-multi-select 
                [items]="(tagItems$ | async) || []"
                placeholder="Add tags..."
                formControlName="tag_ids">
            </app-multi-select>
          </div>
        </div>

        <!-- Materials (Phase 2 Requirement: Hybrid Management) -->
        <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
          <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Materials & Media</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-500 mb-1">Video Material ID / URL</label>
              <input type="text" formControlName="video_material_id" placeholder="Google Drive ID or URL"
                     class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-500 mb-1">Presentation Material ID / URL</label>
              <input type="text" formControlName="presentation_material_id" placeholder="Google Drive ID or URL"
                     class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
             <input type="checkbox" formControlName="is_hidden" id="is_hidden"
                    class="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500">
             <label for="is_hidden" class="text-sm text-slate-700 font-medium">Hide from public feed (Draft/Moderation)</label>
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
      video_material_id: [''],
      presentation_material_id: [''],
      is_hidden: [false],
      thumbnail_url: ['']
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

  private formatDate(date: Date): string {
    // Format for datetime-local: yyyy-MM-ddThh:mm
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  }

  onSubmit() {
    if (this.seminarForm.valid) {
      const val = this.seminarForm.value;
      this.onSave.emit({
        ...val,
        date_time: new Date(val.date_time)
      });
    }
  }
}
