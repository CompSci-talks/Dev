import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ICommentService, COMMENT_SERVICE } from '../../../core/contracts/comment.interface';
import { ISeminarService, SEMINAR_SERVICE } from '../../../core/contracts/seminar.interface';
import { Comment } from '../../../core/models/comment.model';
import { Observable, combineLatest, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-comment-moderation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-4xl">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Comment Moderation</h1>
        <p class="text-slate-500 mt-1">Review and manage community discussions across all seminars.</p>
      </div>
      
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200">
                <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Author</th>
                <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Comment Info</th>
                <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr *ngFor="let item of enrichedComments$ | async" class="hover:bg-slate-50/50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs mr-3">
                      {{ item.comment.author_name.charAt(0) }}
                    </div>
                    <div>
                      <div class="text-sm font-medium text-slate-900">{{ item.comment.author_name }}</div>
                      <div class="text-[10px] text-slate-400">ID: {{ item.comment.author_id.substring(0, 8) }}...</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-slate-700 max-w-md italic mb-2">"{{ item.comment.text }}"</div>
                  <div class="flex items-center group">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">Seminar:</span>
                    <a [routerLink]="['/seminar', item.comment.seminar_id]" 
                       class="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                      {{ item.seminarName }}
                    </a>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                  {{ item.comment.created_at | date:'short' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button (click)="deleteComment(item.comment.id)"
                          class="text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors">
                    Delete
                  </button>
                </td>
              </tr>
              <tr *ngIf="!(enrichedComments$ | async)?.length">
                <td colspan="4" class="px-6 py-12 text-center text-slate-400 italic">
                  No comments found for moderation.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class CommentModerationComponent implements OnInit {
  private commentService = inject(COMMENT_SERVICE);
  private seminarService = inject(SEMINAR_SERVICE);

  enrichedComments$!: Observable<{ comment: Comment, seminarName: string }[]>;

  constructor() { }

  ngOnInit() {
    this.loadComments();
  }

  private loadComments() {
    this.enrichedComments$ = combineLatest([
      this.commentService.getAllComments(),
      this.seminarService.getSeminars()
    ]).pipe(
      map(([comments, seminars]) => {
        return comments.map(comment => ({
          comment,
          seminarName: seminars.find(s => s.id === comment.seminar_id)?.title || 'Unknown Seminar'
        }));
      })
    );
  }

  deleteComment(id: string) {
    if (confirm('Are you sure you want to permanently delete this comment?')) {
      this.commentService.deleteComment(id).subscribe(() => {
        this.loadComments();
      });
    }
  }
}
