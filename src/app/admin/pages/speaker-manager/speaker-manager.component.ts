import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SPEAKER_SERVICE } from '../../../core/contracts/speaker.interface';
import { Speaker } from '../../../core/models/seminar.model';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-speaker-manager',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
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
        <h3 class="text-lg font-bold mb-4">Add New Speaker</h3>
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
            <button type="button" (click)="showForm = false" class="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
            <button type="submit" [disabled]="speakerForm.invalid" 
                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">Save Speaker</button>
          </div>
        </form>
      </div>

      <!-- List -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden text-sm">
        <div class="p-4 border-b border-slate-100 bg-slate-50 font-bold grid grid-cols-3 gap-4">
          <span>Name</span>
          <span>Affiliation</span>
          <span>Actions</span>
        </div>
        <div *ngFor="let speaker of speakers$ | async" class="p-4 border-b border-slate-100 grid grid-cols-3 gap-4 hover:bg-slate-50 items-center">
          <div class="font-medium text-slate-900">{{ speaker.name }}</div>
          <div class="text-slate-600">{{ speaker.affiliation }}</div>
          <div>
            <button (click)="deleteSpeaker(speaker.id)" class="text-red-600 hover:text-red-800 font-medium">Delete</button>
          </div>
        </div>
        <div *ngIf="!(speakers$ | async)?.length" class="p-12 text-center text-slate-400">
          No speakers found. Create your first speaker to get started.
        </div>
      </div>
    </div>
  `
})
export class SpeakerManagerComponent implements OnInit {
    private speakerService = inject(SPEAKER_SERVICE);
    private fb = inject(FormBuilder);

    speakers$ = this.speakerService.getSpeakers();
    showForm = false;
    speakerForm: FormGroup = this.fb.group({
        name: ['', Validators.required],
        affiliation: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        bio: ['', Validators.required],
        avatar_url: ['']
    });

    ngOnInit() { }

    saveSpeaker() {
        if (this.speakerForm.valid) {
            this.speakerService.createSpeaker(this.speakerForm.value).subscribe(() => {
                this.showForm = false;
                this.speakerForm.reset();
                this.speakers$ = this.speakerService.getSpeakers();
            });
        }
    }

    deleteSpeaker(id: string) {
        if (confirm('Are you sure?')) {
            this.speakerService.deleteSpeaker(id).subscribe(() => {
                this.speakers$ = this.speakerService.getSpeakers();
            });
        }
    }
}
