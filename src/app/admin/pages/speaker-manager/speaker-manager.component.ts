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
          <h1 class="text-2xl font-bold text-text-main font-display">Speaker Manager</h1>
          <p class="text-text-muted">Manage seminar speakers and their profiles.</p>
        </div>
        <button *ngIf="!showForm" (click)="showForm = true" 
                class="btn btn-primary">
          + New Speaker
        </button>
      </div>

      <!-- Quick Form -->
      <div *ngIf="showForm" class="bg-surface-card p-6 rounded-xl border border-border shadow-premium mb-8 animate-fade-in">
        <h3 class="text-lg font-bold text-text-main mb-4 font-display">{{ editingSpeaker ? 'Edit Speaker' : 'Add New Speaker' }}</h3>
        <form [formGroup]="speakerForm" (ngSubmit)="saveSpeaker()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-text-main mb-1">Full Name</label>
            <input type="text" formControlName="name" 
                   class="input-field w-full" placeholder="e.g. Dr. John Doe">
          </div>
          <div>
            <label class="block text-sm font-medium text-text-main mb-1">Affiliation</label>
            <input type="text" formControlName="affiliation" 
                   class="input-field w-full" placeholder="e.g. Ain Shams University">
          </div>
          <div>
            <label class="block text-sm font-medium text-text-main mb-1">Email</label>
            <input type="email" formControlName="email" 
                   class="input-field w-full" placeholder="e.g. john.doe@example.com">
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-text-main mb-1">Bio</label>
            <textarea formControlName="bio" rows="3"
                      class="input-field w-full resize-none" placeholder="Brief biography..."></textarea>
          </div>
          <div class="md:col-span-2 flex justify-end space-x-3 mt-2">
            <button type="button" (click)="cancelEdit()" class="btn btn-ghost">Cancel</button>
            <button type="submit" [disabled]="speakerForm.invalid" 
                    class="btn btn-primary min-w-[120px]">
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
