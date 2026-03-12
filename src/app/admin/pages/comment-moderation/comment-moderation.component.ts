import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICommentService, COMMENT_SERVICE } from '../../../core/contracts/comment.interface';
import { Comment } from '../../../core/models/comment.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-comment-moderation',
  standalone: true,
  imports: [CommonModule],
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
                <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Comment</th>
                <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr *ngFor="let comment of comments$ | async" class="hover:bg-slate-50/50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs mr-3">
                      {{ comment.author_name.charAt(0) }}
                    </div>
                    <div>
                      <div class="text-sm font-medium text-slate-900">{{ comment.author_name }}</div>
                      <div class="text-[10px] text-slate-400">ID: {{ comment.author_id.substring(0, 8) }}...</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-slate-700 max-w-md line-clamp-2">{{ comment.text }}</div>
                  <div class="text-[10px] text-blue-500 font-medium mt-1">Seminar ID: {{ comment.seminar_id }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                  {{ comment.created_at | date:'short' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button (click)="deleteComment(comment.id)"
                          class="text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors">
                    Delete
                  </button>
                </td>
              </tr>
              <tr *ngIf="!(comments$ | async)?.length">
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
  comments$ = this.commentService.getAllComments();

  constructor() { }

  ngOnInit() { }

  deleteComment(id: string) {
    if (confirm('Are you sure you want to permanently delete this comment?')) {
      this.commentService.deleteComment(id).subscribe(() => {
        this.comments$ = this.commentService.getAllComments();
      });
    }
  }
}
