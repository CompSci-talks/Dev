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
        '1': [
            { id: 'c1', seminar_id: '1', author_id: 'mock-user-123', author_name: 'John Doe', text: 'Will the slides be shared after the talk?', created_at: new Date(Date.now() - 1000 * 60 * 5), is_hidden: false },
            { id: 'c2', seminar_id: '1', author_id: 'mock-speaker-1', author_name: 'Prof. Smith', text: 'Yes, they will be posted on the faculty portal tomorrow.', created_at: new Date(Date.now() - 1000 * 60 * 4), is_hidden: false, parent_id: 'c1' }
        ],
        '2': [
            { id: 'c3', seminar_id: '2', author_id: 'mock-user-2', author_name: 'Jane Wilson', text: 'Great explanation of the new Angular 19 signals API!', created_at: new Date(Date.now() - 1000 * 60 * 60), is_hidden: false },
            { id: 'c4', seminar_id: '2', author_id: 'mock-user-123', author_name: 'John Doe', text: 'Can we use this pattern in Angular 18 as well?', created_at: new Date(Date.now() - 1000 * 60 * 30), is_hidden: false },
            { id: 'c5', seminar_id: '2', author_id: 'mock-speaker-2', author_name: 'Sarah Drasner', text: 'Most of it yes, but the effect cleanup is much cleaner in 19.', created_at: new Date(Date.now() - 1000 * 60 * 10), is_hidden: false, parent_id: 'c4' }
        ],
        '3': [
            { id: 'c6', seminar_id: '3', author_id: 'mock-user-3', author_name: 'Alex Rivera', text: 'Excited for this demo!', created_at: new Date(Date.now() - 1000 * 60 * 2), is_hidden: false }
        ]
    });

    getCommentsForSeminar$(seminarId: string): Observable<Comment[]> {
        return this.store$.pipe(
            map(store => store[seminarId] || []),
            map(comments => {
                // Return all comments chronologically. Single-level nesting
                // means we just rely on parent_id in the view to indent them.
                return [...comments].sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
            })
        );
    }

    submitComment(seminarId: string, text: string, parentId?: string): Observable<Comment> {
        return this.auth.currentUser$.pipe(
            switchMap(user => {
                if (!user) throw new Error("Must be logged in to leave a comment.");

                const newC: Comment = {
                    id: 'c-' + Math.floor(Math.random() * 10000),
                    seminar_id: seminarId,
                    author_id: user.id,
                    author_name: user.display_name,
                    text,
                    created_at: new Date(),
                    is_hidden: false,
                    parent_id: parentId // Will naturally be undefined if not a reply
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

    getAllComments(): Observable<Comment[]> {
        return this.store$.pipe(
            map(store => Object.values(store).flat()),
            map(comments => [...comments].sort((a, b) => b.created_at.getTime() - a.created_at.getTime()))
        );
    }

    deleteComment(commentId: string): Observable<void> {
        const currentStore = this.store$.value;
        const newStore: Record<string, Comment[]> = {};

        Object.keys(currentStore).forEach(sId => {
            newStore[sId] = currentStore[sId].filter(c => c.id !== commentId);
        });

        this.store$.next(newStore);
        return of(undefined).pipe(delay(200));
    }
}
