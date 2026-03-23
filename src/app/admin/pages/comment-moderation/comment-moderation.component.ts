import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { COMMENT_SERVICE } from '../../../core/contracts/comment.interface';
import { SEMINAR_SERVICE } from '../../../core/contracts/seminar.interface';
import { Comment } from '../../../core/models/comment.model';
import { DocumentSnapshot } from '@angular/fire/firestore';
import { combineLatest, map } from 'rxjs';
import { PaginatedTableComponent } from '../../../shared/components/paginated-table/paginated-table.component';

@Component({
  selector: 'app-comment-moderation',
  standalone: true,
  imports: [CommonModule, RouterModule, PaginatedTableComponent],
  template: `
    <div class="w-full">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Comment Moderation</h1>
        <p class="text-slate-500 mt-1">Review and manage community discussions across all seminars.</p>
      </div>

      <app-paginated-table
        [data]="enrichedComments"
        [loading]="loading"
        [columnCount]="4"
        [currentPage]="currentPage"
        [hasMore]="hasMore"
        [headerTemplate]="header"
        [rowTemplate]="row"
        [skeletonTemplate]="skeleton"
        (pageChange)="onPageChange($event)"
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
              <img class="w-10 h-10 rounded-full mr-3"
                   [src]="item.comment.author_photoURL || 'https://ui-avatars.com/api/?name=' + item.comment.author_name"
                   alt="{{item.comment.author_name}} image">
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

  readonly pageSize = 5;

  enrichedComments: { comment: Comment, seminarName: string }[] = [];
  loading = true;
  currentPage = 1;
  hasMore = false;

  // cursor stack: index 0 = null (first page), index N = lastDoc of page N-1
  private cursorStack: (DocumentSnapshot | null)[] = [null];
  private seminars: any[] = [];

  ngOnInit() {
    // load seminars once, then fetch first page
    this.seminarService.getSeminars().subscribe(seminars => {
      this.seminars = seminars;
      this.fetchPage(null);
    });
  }

  private fetchPage(cursor: DocumentSnapshot | null) {
    this.loading = true;
    this.commentService.getAllCommentsPaginated(this.pageSize, cursor).subscribe(page => {
      this.enrichedComments = page.data.map(comment => ({
        comment,
        seminarName: this.seminars.find(s => s.id === comment.seminar_id)?.title || 'Unknown Seminar'
      }));
      this.hasMore = page.hasMore;
      this.cursorStack[this.currentPage] = page.lastDoc;
      this.loading = false;
    });
  }
  onPageChange(direction: 'prev' | 'next') {
    if (direction === 'next' && this.hasMore) {
      // push current page's lastDoc as next cursor
      const lastComment = this.enrichedComments[this.enrichedComments.length - 1];
      // we need the raw DocumentSnapshot — store it from the service response
      this.currentPage++;
      const cursor = this.cursorStack[this.currentPage - 1] ?? null;
      this.fetchPage(cursor);
    } else if (direction === 'prev' && this.currentPage > 1) {
      this.currentPage--;
      const cursor = this.cursorStack[this.currentPage - 1];
      this.fetchPage(cursor);
    }
  }

  deleteComment(id: string) {
    if (confirm('Are you sure you want to permanently delete this comment?')) {
      this.commentService.deleteComment(id).subscribe(() => {
        // reset to first page after deletion
        this.currentPage = 1;
        this.cursorStack = [null];
        this.fetchPage(null);
      });
    }
  }
}