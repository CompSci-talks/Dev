import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, of, map, delay, switchMap } from 'rxjs';
import { ICommentService } from '../contracts/comment.interface';
import { Comment } from '../models/comment.model';
import { MockAuthService } from './mock-auth.service';

@Injectable({ providedIn: 'root' })
export class MockCommentService implements ICommentService {
    private auth = inject(MockAuthService);

    // mock in-memory DB: { seminarId: Comment[] }
    private store$ = new BehaviorSubject<Record<string, Comment[]>>({
        'sem-1': [
            { id: 'c1', seminar_id: 'sem-1', author_id: 'mock-user-123', text: 'Will the slides be shared after the talk?', created_at: new Date(Date.now() - 1000 * 60 * 5), is_hidden: false }
        ]
    });

    getCommentsForSeminar$(seminarId: string): Observable<Comment[]> {
        return this.store$.pipe(
            map(store => store[seminarId] || []),
            map(comments => [...comments].sort((a, b) => b.created_at.getTime() - a.created_at.getTime()))
        );
    }

    submitComment(seminarId: string, text: string): Observable<Comment> {
        return this.auth.currentUser$.pipe(
            switchMap(user => {
                if (!user) throw new Error("Must be logged in to leave a comment.");

                const newC: Comment = {
                    id: 'c-' + Math.floor(Math.random() * 10000),
                    seminar_id: seminarId,
                    author_id: user.id,
                    text,
                    created_at: new Date(),
                    is_hidden: false
                };

                const currentStore = this.store$.value;
                const currentCs = currentStore[seminarId] || [];
                this.store$.next({
                    ...currentStore,
                    [seminarId]: [...currentCs, newC]
                });

                return of(newC).pipe(delay(300));
            })
        );
    }
}
