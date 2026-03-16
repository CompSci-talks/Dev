import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, query, where, orderBy, deleteDoc, doc, getDocs, writeBatch, serverTimestamp, updateDoc, increment, getDoc } from '@angular/fire/firestore';
import { Observable, from, map, switchMap, take } from 'rxjs';
import { ICommentService } from '../core/contracts/comment.interface';
import { Comment } from '../core/models/comment.model';
import { AUTH_SERVICE } from '../core/contracts/auth.interface';

@Injectable({
    providedIn: 'root'
})
export class FirebaseCommentService implements ICommentService {
    private firestore = inject(Firestore);
    private injector = inject(Injector);
    private authService = inject(AUTH_SERVICE);
    private commentsCollection = collection(this.firestore, 'comments');

    getCommentsForSeminar$(seminarId: string): Observable<Comment[]> {
        return runInInjectionContext(this.injector, () => {
            const q = query(this.commentsCollection, where('seminar_id', '==', seminarId), orderBy('created_at', 'desc'));
            return collectionData(q, { idField: 'id' }).pipe(
                map(comments => comments.map(c => this.mapTimestamps(c)))
            ) as Observable<Comment[]>;
        });
    }

    submitComment(seminarId: string, text: string, parentId?: string): Observable<Comment> {
        return this.authService.currentUser$.pipe(
            take(1),
            switchMap(user => {
                if (!user) throw new Error('Must be authenticated to comment');

                const newComment: Omit<Comment, 'id'> = {
                    seminar_id: seminarId,
                    author_id: user.id,
                    author_name: user.display_name,
                    text,
                    parent_id: parentId || null,
                    created_at: new Date(),
                    is_hidden: false
                };

                const batch = writeBatch(this.firestore);
                const commentRef = doc(collection(this.firestore, 'comments'));
                batch.set(commentRef, newComment);

                // Atomic increment of comment count
                const seminarRef = doc(this.firestore, `seminars/${seminarId}`);
                batch.update(seminarRef, { 'stats.comment_count': increment(1) });

                return from(batch.commit()).pipe(
                    map(() => ({ ...newComment, id: commentRef.id } as Comment))
                );
            })
        );
    }

    getAllComments(): Observable<Comment[]> {
        return runInInjectionContext(this.injector, () => {
            const q = query(this.commentsCollection, orderBy('created_at', 'desc'));
            return collectionData(q, { idField: 'id' }).pipe(
                map(comments => comments.map(c => this.mapTimestamps(c)))
            ) as Observable<Comment[]>;
        });
    }

    deleteComment(commentId: string): Observable<void> {
        const commentDoc = doc(this.firestore, `comments/${commentId}`);
        return from(getDoc(commentDoc)).pipe(
            switchMap(snapshot => {
                // The instruction "if (!speakers || !Array.isArray(speakers)) return ''; return speakers.map(s => s?.name || '').filter(Boolean).join(', ');"
                // appears to be for a different component/context (SeminarCardComponent and speakers array)
                // and is not syntactically valid within this RxJS pipe's switchMap operator.
                // Applying only the relevant part of the original deleteComment logic.
                const data = snapshot.data();
                if (!data) return from(Promise.resolve());

                const batch = writeBatch(this.firestore);
                batch.delete(commentDoc);

                const seminarRef = doc(this.firestore, `seminars/${data['seminar_id']}`);
                batch.update(seminarRef, { 'stats.comment_count': increment(-1) });

                return from(batch.commit());
            })
        );
    }

    updateCommentStatus(commentId: string, isHidden: boolean): Observable<void> {
        const commentDoc = doc(this.firestore, `comments/${commentId}`);
        return from(updateDoc(commentDoc, { is_hidden: isHidden }));
    }

    private mapTimestamps(data: any): Comment {
        return {
            ...data,
            created_at: data.created_at?.toDate ? data.created_at.toDate() : data.created_at
        };
    }
}
