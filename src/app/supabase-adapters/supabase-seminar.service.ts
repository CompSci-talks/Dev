import { Injectable } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { ISeminarService } from '../core/contracts/seminar.interface';
import { Seminar } from '../core/models/seminar.model';
import { SupabaseService } from '../core/supabase.service';

@Injectable({
    providedIn: 'root'
})
export class SupabaseSeminarService implements ISeminarService {

    constructor(private supabase: SupabaseService) { }

    getSeminars(tagId?: string, speakerId?: string): Observable<Seminar[]> {
        let query = this.supabase.client.from('seminars').select('*').order('date_time', { ascending: false });

        // In Phase 1 we mock the M2M relation filtering using JSONB contains if the backend uses generic arrays
        if (tagId) {
            query = query.contains('tag_ids', [tagId]);
        }
        if (speakerId) {
            query = query.contains('speaker_ids', [speakerId]);
        }

        return from(query).pipe(
            map(response => {
                if (response.error) throw response.error;
                return response.data.map((item: any) => ({
                    ...item,
                    date_time: new Date(item.date_time)
                })) as Seminar[];
            })
        );
    }

    getSeminarById(id: string): Observable<Seminar | null> {
        const query = this.supabase.client.from('seminars').select('*').eq('id', id).single();
        return from(query).pipe(
            map(response => {
                if (response.error && response.error.code !== 'PGRST116') throw response.error; // PGRST116: Returns 0 rows
                if (!response.data) return null;
                return {
                    ...response.data,
                    date_time: new Date(response.data.date_time)
                } as Seminar;
            })
        );
    }
}
