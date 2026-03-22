import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AUTH_SERVICE } from '../../core/contracts/auth.interface';
import { USER_SERVICE, IUserService } from '../../core/contracts/user.service.interface';
import { COMMENT_SERVICE } from '../../core/contracts/comment.interface';
import { SEMINAR_SERVICE } from '../../core/contracts/seminar.interface';
import { UserDetailComponent } from '../../admin/components/user-detail/user-detail.component';
import { UserProfile } from '../../core/models/user-profile.model';
import { Comment } from '../../core/models/comment.model';
import { Seminar } from '../../core/models/seminar.model';
import { of, catchError, finalize, take, combineLatest } from 'rxjs';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, RouterModule, UserDetailComponent],
  template: `
    <div class="p-6 max-w-5xl mx-auto">
      <div class="mb-6">
        <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">My Profile</h1>
        <p class="text-text-muted mt-1">Your account information and activity.</p>
      </div>

      <!-- Loading -->
      @if (loading) {
        <div class="space-y-6 animate-pulse">
          <div class="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          <div class="h-96 bg-gray-100 dark:bg-gray-900/50 rounded-xl border border-gray-200"></div>
        </div>
      }

      @if (!loading && user) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <!-- Left column -->
          <div class="lg:col-span-1 space-y-6">
            <app-user-detail
              [user]="user"
              [allowEdit]="true"
              (onEditPhoto)="openModal()">
            </app-user-detail>

            <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-gray-500 dark:text-gray-400 text-sm">Seminars Attended</span>
                  <span class="text-blue-600 dark:text-blue-400 font-bold">{{ attendedSeminars.length }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-500 dark:text-gray-400 text-sm">Comments Posted</span>
                  <span class="text-blue-600 dark:text-blue-400 font-bold">{{ comments.length }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-500 dark:text-gray-400 text-sm">Member Since</span>
                  <span class="text-gray-900 dark:text-white text-sm">{{ user.createdAt | date:'mediumDate' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right column -->
          <div class="lg:col-span-2">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">

              <!-- Tabs -->
              <div class="flex border-b border-gray-100 dark:border-gray-700">
                <button (click)="activeTab.set('comments')"
                        class="flex-1 px-6 py-4 text-sm font-semibold transition-colors"
                        [class.text-primary]="activeTab() === 'comments'"
                        [class.border-b-2]="activeTab() === 'comments'"
                        [class.border-primary]="activeTab() === 'comments'"
                        [class.text-gray-400]="activeTab() !== 'comments'">
                  My Comments
                  <span class="ml-2 text-xs px-2 py-0.5 rounded-full"
                        [class.bg-primary-light]="activeTab() === 'comments'"
                        [class.text-primary]="activeTab() === 'comments'"
                        [class.bg-gray-100]="activeTab() !== 'comments'"
                        [class.text-gray-400]="activeTab() !== 'comments'">
                    {{ comments.length }}
                  </span>
                </button>
                <button (click)="activeTab.set('seminars')"
                        class="flex-1 px-6 py-4 text-sm font-semibold transition-colors"
                        [class.text-primary]="activeTab() === 'seminars'"
                        [class.border-b-2]="activeTab() === 'seminars'"
                        [class.border-primary]="activeTab() === 'seminars'"
                        [class.text-gray-400]="activeTab() !== 'seminars'">
                  Attended Seminars
                  <span class="ml-2 text-xs px-2 py-0.5 rounded-full"
                        [class.bg-primary-light]="activeTab() === 'seminars'"
                        [class.text-primary]="activeTab() === 'seminars'"
                        [class.bg-gray-100]="activeTab() !== 'seminars'"
                        [class.text-gray-400]="activeTab() !== 'seminars'">
                    {{ attendedSeminars.length }}
                  </span>
                </button>
              </div>

              <div class="p-6">
                <!-- Loading -->
                @if (loadingActivity) {
                  <div class="space-y-4">
                    @for (i of [1,2,3]; track i) {
                      <div class="flex space-x-3 animate-pulse">
                        <div class="rounded-full bg-gray-200 dark:bg-gray-700 h-8 w-8"></div>
                        <div class="flex-1 space-y-2 py-1">
                          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                          <div class="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2"></div>
                        </div>
                      </div>
                    }
                  </div>
                }

                <!-- Comments tab -->
                @if (!loadingActivity && activeTab() === 'comments') {
                  @if (comments.length === 0) {
                    <div class="text-center py-8 text-gray-400 italic">
                      You haven't posted any comments yet.
                    </div>
                  }
                  @for (comment of comments; track comment.id) {
                    <div class="flex gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          <span class="font-medium text-gray-700 dark:text-gray-300">
                            {{ comment.parent_id ? 'Replied in' : 'Commented on' }}
                          </span>
                          <a [routerLink]="['/seminar', comment.seminar_id]"
                             class="text-blue-600 hover:underline ml-1">
                            {{ comment.seminar_title || comment.seminar_id }}
                          </a>
                        </p>
                        <p class="text-sm text-gray-800 dark:text-gray-200 italic truncate">"{{ comment.text }}"</p>
                        <p class="text-xs text-gray-400 mt-1">{{ comment.created_at | date:'medium' }}</p>
                      </div>
                    </div>
                  }
                }

                <!-- Attended seminars tab -->
                @if (!loadingActivity && activeTab() === 'seminars') {
                  @if (attendedSeminars.length === 0) {
                    <div class="text-center py-8 text-gray-400 italic">
                      You haven't attended any seminars yet.
                    </div>
                  }
                  @for (seminar of attendedSeminars; track seminar.id) {
                    <a [routerLink]="['/seminar', seminar.id]"
                       class="flex gap-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-slate-50 rounded-lg px-2 transition-colors group">
                      <div class="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200">
                        @if (seminar.thumbnail_url) {
                          <img [src]="seminar.thumbnail_url" [alt]="seminar.title" class="w-full h-full object-cover">
                        } @else {
                          <div class="w-full h-full flex items-center justify-center text-slate-300">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                          </div>
                        }
                      </div>
                      <div class="flex-1 min-w-0">
                        <h4 class="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate">
                          {{ seminar.title }}
                        </h4>
                        <p class="text-xs text-gray-500 mt-0.5">
                          {{ seminar.date_time | date:'mediumDate' }} · {{ seminar.location }}
                        </p>
                        @if (seminar.speakers?.length) {
                          <p class="text-xs text-gray-400 mt-0.5">{{ getSpeakerNames(seminar.speakers) }}</p>
                        }
                      </div>
                    </a>
                  }
                }
              </div>
            </div>
          </div>
        </div>
      }

      @if (!loading && !user) {
        <div class="text-center py-16 text-gray-400 italic">
          Could not load your profile. Please try again.
        </div>
      }
    </div>

    <!-- Photo URL Modal -->
    @if (modalOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
           (click)="closeModal()">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6"
             (click)="$event.stopPropagation()">

          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Update Profile Picture</h3>
            <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Preview -->
          <div class="flex justify-center mb-4">
            @if (previewUrl()) {
              <img [src]="previewUrl()!"
                   class="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                   (error)="onPreviewError()">
            } @else if (user?.photoURL) {
              <img [src]="user?.photoURL" class="w-24 h-24 rounded-full object-cover border-4 border-gray-100">
            } @else {
              <div class="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold border-4 border-gray-100">
                {{ user?.displayName?.charAt(0)?.toUpperCase() }}
              </div>
            }
          </div>

          <!-- URL input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Image URL
            </label>
            <input type="url"
                   [value]="photoUrlInput()"
                   (input)="onUrlInput($event)"
                   placeholder="https://example.com/avatar.jpg"
                   class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all">
            <p class="text-xs text-slate-400 mt-1">Paste a direct link to an image (jpg, png, webp)</p>
          </div>

          <!-- Error -->
          @if (uploadError()) {
            <p class="text-xs text-red-500 mt-2 text-center">{{ uploadError() }}</p>
          }

          <!-- Actions -->
          <div class="flex gap-3 mt-4">
            <button (click)="closeModal()"
                    class="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button (click)="savePhotoUrl()"
                    [disabled]="!photoUrlInput() || uploading()"
                    class="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
              @if (uploading()) {
                <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Saving...
              } @else {
                Save
              }
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class ProfilePageComponent implements OnInit {
  private authService = inject(AUTH_SERVICE);
  private userService = inject<IUserService>(USER_SERVICE);
  private commentService = inject(COMMENT_SERVICE);
  private seminarService = inject(SEMINAR_SERVICE);

  user: UserProfile | null = null;
  comments: Comment[] = [];
  attendedSeminars: Seminar[] = [];
  loading = true;
  loadingActivity = false;
  activeTab = signal<'comments' | 'seminars'>('comments');

  // Modal state
  modalOpen = signal(false);
  previewUrl = signal<string | null>(null);
  photoUrlInput = signal<string>('');
  uploading = signal(false);
  uploadError = signal<string | null>(null);

  ngOnInit() {
    this.authService.currentUser$.pipe(take(1)).subscribe(authUser => {
      if (!authUser) {
        this.loading = false;
        return;
      }

      const uid = (authUser as any).id || (authUser as any).uid;

      this.userService.getUserById(uid).pipe(take(1)).subscribe(profile => {
        this.user = profile;
        this.loading = false;
        if (profile) this.loadActivity(uid, profile.attendedSeminarIds || []);
      });
    });
  }

  private loadActivity(userId: string, attendedIds: string[]): void {
    this.loadingActivity = true;

    combineLatest([
      this.commentService.getAllComments(),
      this.seminarService.getSeminars()
    ]).pipe(
      take(1),
      catchError(() => of([[], []] as any)),
      finalize(() => this.loadingActivity = false)
    ).subscribe(([comments, seminars]) => {
      this.comments = comments
        .filter((c: Comment) => c.author_id === userId)
        .sort((a: Comment, b: Comment) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .map((c: Comment) => ({
          ...c,
          seminarTitle: seminars.find((s: any) => s.id === c.seminar_id)?.title || c.seminar_id
        }));

      this.attendedSeminars = seminars.filter((s: Seminar) =>
        attendedIds.includes(s.id)
      );
    });
  }

  openModal() {
    this.photoUrlInput.set(this.user?.photoURL || '');
    this.previewUrl.set(this.user?.photoURL || null);
    this.uploadError.set(null);
    this.modalOpen.set(true);
  }

  closeModal() {
    if (this.uploading()) return;
    this.modalOpen.set(false);
  }

  onUrlInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.photoUrlInput.set(value);
    this.previewUrl.set(value || null);
  }

  onPreviewError() {
    this.uploadError.set('Could not load image from this URL. Please check the link.');
    this.previewUrl.set(null);
  }

  savePhotoUrl() {
    const url = this.photoUrlInput().trim();
    if (!url || !this.user) return;

    this.uploading.set(true);
    this.uploadError.set(null);

    this.userService.updatePhotoURL(this.user.uid, url).subscribe({
      next: () => {
        this.user!.photoURL = url;
        this.uploading.set(false);
        this.modalOpen.set(false);
      },
      error: (err) => {
        console.error('Failed to save photo URL:', err);
        this.uploadError.set('Failed to save. Please try again.');
        this.uploading.set(false);
      }
    });
  }

  getSpeakerNames(speakers: any[] | undefined): string {
    if (!speakers || !Array.isArray(speakers)) return '';
    return speakers.map(s => s?.name || '').filter(Boolean).join(', ');
  }
}