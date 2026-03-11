import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';

export interface ICommentService {
    /** Stream of comments for a specific seminar, ordered by newest first */
    getCommentsForSeminar$(seminarId: string): Observable<Comment[]>;

    /** Submit a new comment to a seminar */
    submitComment(seminarId: string, text: string): Observable<Comment>;
}
