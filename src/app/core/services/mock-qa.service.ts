import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, of, map, delay, switchMap } from 'rxjs';
import { IQaService } from '../contracts/qa.interface';
import { Question } from '../models/question.model';
import { MockAuthService } from './mock-auth.service';

@Injectable({ providedIn: 'root' })
export class MockQaService implements IQaService {
    private auth = inject(MockAuthService);

    // mock in-memory DB: { seminarId: Question[] }
    private store$ = new BehaviorSubject<Record<string, Question[]>>({
        'sem-1': [
            { id: 'q1', seminar_id: 'sem-1', author_id: 'mock-user-123', content: 'Will the slides be shared after the talk?', created_at: new Date(Date.now() - 1000 * 60 * 5), is_hidden: false }
        ]
    });

    getQuestionsForSeminar$(seminarId: string): Observable<Question[]> {
        return this.store$.pipe(
            map(store => store[seminarId] || []),
            map(questions => [...questions].sort((a, b) => b.created_at.getTime() - a.created_at.getTime()))
        );
    }

    submitQuestion(seminarId: string, content: string): Observable<Question> {
        return this.auth.currentUser$.pipe(
            switchMap(user => {
                if (!user) throw new Error("Must be logged in to ask a question.");

                const newQ: Question = {
                    id: 'q-' + Math.floor(Math.random() * 10000),
                    seminar_id: seminarId,
                    author_id: user.id,
                    content,
                    created_at: new Date(),
                    is_hidden: false
                };

                const currentStore = this.store$.value;
                const currentQs = currentStore[seminarId] || [];
                this.store$.next({
                    ...currentStore,
                    [seminarId]: [...currentQs, newQ]
                });

                return of(newQ).pipe(delay(300));
            })
        );
    }
}
