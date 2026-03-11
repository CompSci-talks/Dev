import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question } from '../../../core/models/question.model';

@Component({
    selector: 'app-qa-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './qa-list.component.html'
})
export class QaListComponent {
    @Input({ required: true }) questions: Question[] = [];
    @Input() isLoading = false;
}
