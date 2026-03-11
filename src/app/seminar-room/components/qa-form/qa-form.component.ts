import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-qa-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './qa-form.component.html'
})
export class QaFormComponent {
    @Input() isSubmitting = false;
    @Output() submitQuestion = new EventEmitter<string>();

    newQuestionText = '';

    onSubmit() {
        if (!this.newQuestionText.trim() || this.isSubmitting) return;
        this.submitQuestion.emit(this.newQuestionText.trim());
        this.newQuestionText = '';
    }
}
