import { Injectable, inject, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, from, map, switchMap, timeout } from 'rxjs';
import { IQaService } from '../core/contracts/qa.interface';
import { Question } from '../core/models/question.model';
import { SupabaseService } from '../core/supabase.service';
import { SupabaseAuthService } from './supabase-auth.service';

@Injectable({ providedIn: 'root' })
export class SupabaseQaService implements IQaService, OnDestroy {
    private supabase = inject(SupabaseService);
    private auth = inject(SupabaseAuthService);

    // We manage local subject state to merge realtime updates into
    private questionsSubject = new BehaviorSubject<Question[]>([]);
    private currentSeminarId?: string;
    private channel?: any;

    // Cleanup subscription
    ngOnDestroy() {
        this.unsubscribeFromRealtime();
    }

    getQuestionsForSeminar$(seminarId: string): Observable<Question[]> {
        this.currentSeminarId = seminarId;
        this.questionsSubject.next([]); // reset
        this.fetchInitialQuestions(seminarId);
        this.subscribeToRealtime(seminarId);

        return this.questionsSubject.asObservable();
    }

    submitQuestion(seminarId: string, content: string): Observable<Question> {
        return this.auth.currentUser$.pipe(
            switchMap(user => {
                if (!user) throw new Error('Unauthenticated user cannot ask questions');

                const query = this.supabase.client.from('questions').insert({
                    seminar_id: seminarId,
                    author_id: user.id,
                    content: content
                }).select().single();

                return from(query).pipe(
                    map(response => {
                        if (response.error) throw response.error;
                        const q = {
                            ...response.data,
                            created_at: new Date(response.data.created_at)
                        } as Question;

                        // Note: Postgres Realtime should also pick this up, but optionally we can insert it instantly here
                        return q;
                    })
                );
            })
        );
    }

    private fetchInitialQuestions(seminarId: string) {
        this.supabase.client
            .from('questions')
            .select('*')
            .eq('seminar_id', seminarId)
            .eq('is_hidden', false)
            .order('created_at', { ascending: false })
            .then(response => {
                if (!response.error && response.data) {
                    const qs = response.data.map((d: any) => ({
                        ...d, created_at: new Date(d.created_at)
                    })) as Question[];
                    this.questionsSubject.next(qs);
                }
            });
    }

    private subscribeToRealtime(seminarId: string) {
        this.unsubscribeFromRealtime();

        this.channel = this.supabase.client.channel('public:questions')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'questions',
                filter: `seminar_id=eq.${seminarId}`
            }, payload => {
                if (payload.new && !payload.new['is_hidden']) {
                    const newQ = { ...payload.new, created_at: new Date(payload.new['created_at']) } as Question;
                    this.questionsSubject.next([newQ, ...this.questionsSubject.value]);
                }
            })
            .subscribe();
    }

    private unsubscribeFromRealtime() {
        if (this.channel) {
            this.supabase.client.removeChannel(this.channel);
            this.channel = undefined;
        }
    }
}
