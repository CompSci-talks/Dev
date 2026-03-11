import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment } from '../../../core/models/comment.model';

@Component({
    selector: 'app-comment-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './comment-list.component.html'
})
export class CommentListComponent {
    @Input({ required: true }) comments: Comment[] = [];
    @Input() isLoading = false;
}
