import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ICommentService, COMMENT_SERVICE } from '../../../core/contracts/comment.interface';
import { ISeminarService, SEMINAR_SERVICE } from '../../../core/contracts/seminar.interface';
import { Comment } from '../../../core/models/comment.model';
import { Observable, combineLatest, map } from 'rxjs';
import { PaginatedTableComponent } from '../../../shared/components/paginated-table/paginated-table.component';

@Component({
  selector: 'app-comment-moderation',
  standalone: true,
  imports: [CommonModule, RouterModule, PaginatedTableComponent],
  template: `
    <div class="max-w-4xl">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Comment Moderation</h1>
        <p class="text-slate-500 mt-1">Review and manage community discussions across all seminars.</p>
      </div>

      <app-paginated-table
        [data]="(enrichedComments$ | async) ?? []"
        [loading]="loading"
        [columnCount]="4"
        [headerTemplate]="header"
        [rowTemplate]="row"
        [skeletonTemplate]="skeleton"
        [showPagination]="false"
        emptyMessage="No comments found for moderation."
      >
        <ng-template #header>
          <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Author</th>
          <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Comment Info</th>
          <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
          <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
        </ng-template>

        <ng-template #row let-item>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <img class="w-10 h-10 rounded-full" [src]="item.comment.author_photoURL || 'https://ui-avatars.com/api/?name=' + item.comment.author_name" alt="{{item.comment.author_name}} image">
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
        </ng-template>

        <ng-template #skeleton>
          <tr *ngFor="let i of [1,2,3,4,5]" class="animate-pulse">
            <td class="px-6 py-4"><div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div></td>
            <td class="px-6 py-4"><div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div></td>
            <td class="px-6 py-4"><div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div></td>
            <td class="px-6 py-4 text-right"><div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-auto"></div></td>
          </tr>
        </ng-template>
      </app-paginated-table>
    </div>
  `
})
export class CommentModerationComponent implements OnInit {
  private commentService = inject(COMMENT_SERVICE);
  private seminarService = inject(SEMINAR_SERVICE);

  enrichedComments$!: Observable<{ comment: Comment, seminarName: string }[]>;
  loading = true;

  ngOnInit() {
    this.loadComments();
  }

  private loadComments() {
    this.loading = true;
    this.enrichedComments$ = combineLatest([
      this.commentService.getAllComments(),
      this.seminarService.getSeminars()
    ]).pipe(
      map(([comments, seminars]) => {
        this.loading = false;
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