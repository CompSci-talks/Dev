import { Injectable, inject, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, from, map, switchMap, timeout } from 'rxjs';
import { ICommentService } from '../core/contracts/comment.interface';
import { Comment } from '../core/models/comment.model';
import { SupabaseService } from '../core/supabase.service';
import { SupabaseAuthService } from './supabase-auth.service';

@Injectable({ providedIn: 'root' })
export class SupabaseCommentService implements ICommentService, OnDestroy {
    private supabase = inject(SupabaseService);
    private auth = inject(SupabaseAuthService);

    // We manage local subject state to merge realtime updates into
    private commentsSubject = new BehaviorSubject<Comment[]>([]);
    private currentSeminarId?: string;
    private channel?: any;

    // Cleanup subscription
    ngOnDestroy() {
        this.unsubscribeFromRealtime();
    }

    getCommentsForSeminar$(seminarId: string): Observable<Comment[]> {
        this.currentSeminarId = seminarId;
        this.commentsSubject.next([]); // reset
        this.fetchInitialComments(seminarId);
        this.subscribeToRealtime(seminarId);

        return this.commentsSubject.asObservable();
    }

    submitComment(seminarId: string, text: string): Observable<Comment> {
        return this.auth.currentUser$.pipe(
            switchMap(user => {
                if (!user) throw new Error('Unauthenticated user cannot leave comments');

                const query = this.supabase.client.from('comments').insert({
                    seminar_id: seminarId,
                    author_id: user.id,
                    text: text
                }).select().single();

                return from(query).pipe(
                    map(response => {
                        if (response.error) throw response.error;
                        const c = {
                            ...response.data,
                            created_at: new Date(response.data.created_at)
                        } as Comment;

                        // Note: Postgres Realtime should also pick this up, but optionally we can insert it instantly here
                        return c;
                    })
                );
            })
        );
    }

    private fetchInitialComments(seminarId: string) {
        this.supabase.client
            .from('comments')
            .select('*')
            .eq('seminar_id', seminarId)
            .eq('is_hidden', false)
            .order('created_at', { ascending: false })
            .then(response => {
                if (!response.error && response.data) {
                    const cs = response.data.map((d: any) => ({
                        ...d, created_at: new Date(d.created_at)
                    })) as Comment[];
                    this.commentsSubject.next(cs);
                }
            });
    }

    private subscribeToRealtime(seminarId: string) {
        this.unsubscribeFromRealtime();

        this.channel = this.supabase.client.channel('public:comments')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'comments',
                filter: `seminar_id=eq.${seminarId}`
            }, payload => {
                if (payload.new && !payload.new['is_hidden']) {
                    const newC = { ...payload.new, created_at: new Date(payload.new['created_at']) } as Comment;
                    this.commentsSubject.next([newC, ...this.commentsSubject.value]);
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
