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

    ngOnInit() {
        this.isAuthenticated$ = this.authService.currentUser$.pipe(map(u => !!u));

        // We mock loading state briefly
        this.comments$ = this.commentService.getCommentsForSeminar$(this.seminarId);
        setTimeout(() => this.isLoadingComments = false, 500);
    }

    onCommentSubmitted(text: string) {
        this.isSubmitting = true;
        this.commentService.submitComment(this.seminarId, text).subscribe({
            next: () => {
                this.isSubmitting = false;
            },
            error: (err) => {
                console.error('Failed to submit comment:', err);
                this.isSubmitting = false;
            }
        });
    }
}
