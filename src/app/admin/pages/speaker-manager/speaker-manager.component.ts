import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SPEAKER_SERVICE } from '../../../core/contracts/speaker.interface';
import { Speaker } from '../../../core/models/seminar.model';
import { SpeakerListComponent } from './speaker-list.component';
import { ToastService } from '../../../core/services/toast.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-speaker-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpeakerListComponent],
  template: `
    <div class="max-w-4xl">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Speaker Manager</h1>
          <p class="text-slate-600">Manage seminar speakers and their profiles.</p>
        </div>
        <button *ngIf="!showForm" (click)="showForm = true" 
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          + New Speaker
        </button>
      </div>

      <!-- Quick Form -->
      <div *ngIf="showForm" class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
        <h3 class="text-lg font-bold mb-4">{{ editingSpeaker ? 'Edit Speaker' : 'Add New Speaker' }}</h3>
        <form [formGroup]="speakerForm" (ngSubmit)="saveSpeaker()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium mb-1">Full Name</label>
            <input type="text" formControlName="name" 
                   class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Affiliation</label>
            <input type="text" formControlName="affiliation" 
                   class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input type="email" formControlName="email" 
                   class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium mb-1">Bio</label>
            <textarea formControlName="bio" rows="3"
                      class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
          </div>
          <div class="md:col-span-2 flex justify-end space-x-3">
            <button type="button" (click)="cancelEdit()" class="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
            <button type="submit" [disabled]="speakerForm.invalid" 
                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {{ editingSpeaker ? 'Update Speaker' : 'Save Speaker' }}
            </button>
          </div>
        </form>
      </div>

      <!-- List -->
      <app-speaker-list
        [speakers]="speakers"
        [loading]="loading"
        (edit)="editSpeaker($event)"
        (onDelete)="deleteSpeaker($event)"
      ></app-speaker-list>
    </div>
  `
})
export class SpeakerManagerComponent implements OnInit {
  private speakerService = inject(SPEAKER_SERVICE);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  speakers: Speaker[] = [];
  loading = false;
  showForm = false;
  editingSpeaker: Speaker | null = null;
  speakerForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    affiliation: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    bio: ['', Validators.required],
    avatar_url: ['']
  });

  ngOnInit() {
    this.loadSpeakers();
  }

  private loadSpeakers() {
    this.loading = true;
    this.speakerService.getSpeakers().pipe(take(1)).subscribe({
      next: (speakers) => {
        this.speakers = speakers;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.speakers = [];
      }
    });
  }

  editSpeaker(speaker: Speaker) {
    this.editingSpeaker = speaker;
    this.showForm = true;
    this.speakerForm.patchValue(speaker);
  }

  cancelEdit() {
    this.showForm = false;
    this.editingSpeaker = null;
    this.speakerForm.reset();
  }

  saveSpeaker() {
    if (this.speakerForm.valid) {
      const operation = this.editingSpeaker
        ? this.speakerService.updateSpeaker(this.editingSpeaker.id, this.speakerForm.value)
        : this.speakerService.createSpeaker(this.speakerForm.value);

      operation.subscribe({
        next: () => {
          this.toastService.success(this.editingSpeaker ? 'Speaker updated successfully' : 'Speaker created successfully');
          this.cancelEdit();
          this.loadSpeakers();
        },
        error: (err: any) => {
          this.toastService.error(err.message || 'Failed to save speaker');
        }
      });
    }
  }

  deleteSpeaker(id: string) {
    if (confirm('Are you sure?')) {
      this.speakerService.deleteSpeaker(id).subscribe({
        next: () => {
          this.toastService.success('Speaker deleted successfully');
          this.loadSpeakers();
        },
        error: (err: any) => this.toastService.error(err.message || 'Failed to delete speaker')
      });
    }
  }
}
