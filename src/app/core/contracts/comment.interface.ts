import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';

export interface ICommentService {
    /** Stream of comments for a specific seminar, ordered by newest first */
    getCommentsForSeminar$(seminarId: string): Observable<Comment[]>;

    /** Submit a new comment to a seminar, optionally as a reply */
    submitComment(seminarId: string, seminar_title: string, text: string, parentId?: string): Observable<Comment>;

    /** Admin: Fetch all comments across all seminars */
    getAllComments(): Observable<Comment[]>;

    /** Admin: Delete a comment */
    deleteComment(commentId: string): Observable<void>;

    /** Admin: Toggle comment visibility */
    updateCommentStatus(commentId: string, isHidden: boolean): Observable<void>;
}

import { InjectionToken } from '@angular/core';
export const COMMENT_SERVICE = new InjectionToken<ICommentService>('COMMENT_SERVICE');
