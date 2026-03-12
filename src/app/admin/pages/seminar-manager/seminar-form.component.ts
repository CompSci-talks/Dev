import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Seminar, Speaker, Tag } from '../../../core/models/seminar.model';
import { SPEAKER_SERVICE, ISpeakerService } from '../../../core/contracts/speaker.interface';
import { TAG_SERVICE, ITagService } from '../../../core/contracts/tag.interface';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-seminar-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
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
            <select multiple formControlName="speaker_ids" 
                    class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all min-h-[120px]">
              <option *ngFor="let speaker of speakers$ | async" [value]="speaker.id">
                {{ speaker.name }} ({{ speaker.affiliation }})
              </option>
            </select>
            <p class="text-[10px] text-slate-400 mt-1">Hold Ctrl/Cmd to select multiple</p>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Tags</label>
            <div class="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl min-h-[120px]">
              <button type="button" *ngFor="let tag of tags$ | async" 
                      (click)="toggleTag(tag.id)"
                      [class.bg-blue-600]="isTagSelected(tag.id)"
                      [class.text-white]="isTagSelected(tag.id)"
                      [class.bg-white]="!isTagSelected(tag.id)"
                      class="px-3 py-1 rounded-full text-xs font-medium border border-slate-200 hover:border-blue-400 transition-all">
                {{ tag.name }}
              </button>
            </div>
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

        <div class="flex justify-end space-x-4 pt-4">
          <button type="button" (click)="onCancel.emit()"
                  class="px-6 py-3 text-slate-600 hover:text-slate-800 font-medium transition-colors">
            Discard
          </button>
          <button type="submit" [disabled]="seminarForm.invalid"
                  class="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-100 transition-all">
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
    speakers$: Observable<Speaker[]>;
    tags$: Observable<Tag[]>;

    constructor(
        private fb: FormBuilder,
        @Inject(SPEAKER_SERVICE) private speakerService: ISpeakerService,
        @Inject(TAG_SERVICE) private tagService: ITagService
    ) {
        this.speakers$ = this.speakerService.getSpeakers();
        this.tags$ = this.tagService.getTags();

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

    toggleTag(tagId: string) {
        const currentTags = this.seminarForm.value.tag_ids as string[];
        if (currentTags.includes(tagId)) {
            this.seminarForm.patchValue({ tag_ids: currentTags.filter(id => id !== tagId) });
        } else {
            this.seminarForm.patchValue({ tag_ids: [...currentTags, tagId] });
        }
    }

    isTagSelected(tagId: string): boolean {
        return (this.seminarForm.value.tag_ids as string[]).includes(tagId);
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
