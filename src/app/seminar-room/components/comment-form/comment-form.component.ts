import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-comment-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './comment-form.component.html'
})
export class CommentFormComponent {
    @Input() isSubmitting = false;
    @Output() submitComment = new EventEmitter<string>();

    newCommentText = '';

    onSubmit() {
        if (!this.newCommentText.trim() || this.isSubmitting) return;
        this.submitComment.emit(this.newCommentText.trim());
        this.newCommentText = '';
    }
}
