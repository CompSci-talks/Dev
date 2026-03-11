import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QaListComponent } from '../qa-list/qa-list.component';
import { QaFormComponent } from '../qa-form/qa-form.component';
import { MockQaService } from '../../../core/services/mock-qa.service';
import { MockAuthService } from '../../../core/services/mock-auth.service';
import { Observable, map } from 'rxjs';
import { Question } from '../../../core/models/question.model';

@Component({
    selector: 'app-qa-container',
    standalone: true,
    imports: [CommonModule, QaListComponent, QaFormComponent],
    templateUrl: './qa-container.component.html'
})
export class QaContainerComponent implements OnInit {
    @Input({ required: true }) seminarId!: string;

    private qaService = inject(MockQaService);
    private authService = inject(MockAuthService);

    questions$!: Observable<Question[]>;
    isAuthenticated$!: Observable<boolean>;

    isLoadingQuestions = true;
    isSubmitting = false;

    ngOnInit() {
        this.isAuthenticated$ = this.authService.currentUser$.pipe(map(u => !!u));

        // We mock loading state briefly
        this.questions$ = this.qaService.getQuestionsForSeminar$(this.seminarId);
        setTimeout(() => this.isLoadingQuestions = false, 500);
    }

    onQuestionSubmitted(content: string) {
        this.isSubmitting = true;
        this.qaService.submitQuestion(this.seminarId, content).subscribe({
            next: () => {
                this.isSubmitting = false;
            },
            error: (err) => {
                console.error('Failed to submit question:', err);
                this.isSubmitting = false;
            }
        });
    }
}
