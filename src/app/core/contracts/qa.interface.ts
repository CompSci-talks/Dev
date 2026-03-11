// contracts/qa.interface.ts
import { Observable } from 'rxjs';
import { Question } from '../models/question.model';

export interface IQaService {
    /** Stream of questions for a specific seminar, ordered by newest first */
    getQuestionsForSeminar$(seminarId: string): Observable<Question[]>;

    /** Submit a new question to a seminar */
    submitQuestion(seminarId: string, content: string): Observable<Question>;
}
