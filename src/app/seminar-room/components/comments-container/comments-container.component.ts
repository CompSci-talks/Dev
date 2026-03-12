import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentListComponent } from '../comment-list/comment-list.component';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { MockCommentService } from '../../../core/services/mock-comment.service';
import { MockAuthService } from '../../../core/services/mock-auth.service';
import { Observable, map } from 'rxjs';
import { Comment } from '../../../core/models/comment.model';

@Component({
    selector: 'app-comments-container',
    standalone: true,
    imports: [CommonModule, CommentListComponent, CommentFormComponent],
    templateUrl: './comments-container.component.html'
})
export class CommentsContainerComponent implements OnInit {
    @Input({ required: true }) seminarId!: string;

    private commentService = inject(MockCommentService);
    private authService = inject(MockAuthService);

    comments$!: Observable<Comment[]>;
    isAuthenticated$!: Observable<boolean>;

    isLoadingComments = true;
    isSubmitting = false;
    activeReplyId: string | null = null;

    ngOnInit() {
        this.isAuthenticated$ = this.authService.currentUser$.pipe(map(u => !!u));

        // We mock loading state briefly
        this.comments$ = this.commentService.getCommentsForSeminar$(this.seminarId);
        setTimeout(() => this.isLoadingComments = false, 500);
    }

    onReplyInitiated(commentId: string | null) {
        this.activeReplyId = commentId;
    }

    onCommentSubmitted(event: { text: string; parentId?: string }) {
        this.isSubmitting = true;
        this.commentService.submitComment(this.seminarId, event.text, event.parentId).subscribe({
            next: () => {
                this.isSubmitting = false;
                if (event.parentId) {
                    this.activeReplyId = null; // Close reply UI
                }
            },
            error: (err) => {
                console.error('Failed to submit comment:', err);
                this.isSubmitting = false;
            }
        });
    }
}
