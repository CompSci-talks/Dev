import { Injectable } from '@angular/core';
import { Observable, of, delay, BehaviorSubject } from 'rxjs';
import { ISeminarService } from '../contracts/seminar.interface';
import { Seminar } from '../models/seminar.model';

const MOCK_SEMINARS: Seminar[] = [
    {
        id: '1',
        title: 'The Future of AI and Machine Learning',
        date_time: new Date(Date.now() + 86400000), // Tomorrow
        location: 'Auditorium A',
        abstract: 'A deep dive into the **future** of artificial intelligence, covering LLMs and beyond. *Highly recommended for CS students.*',
        thumbnail_url: 'https://picsum.photos/seed/ai/800/400',
        speaker_ids: ['s1'],
        tag_ids: ['t1'],
        is_hidden: false,
    },
    {
        id: '2',
        title: 'Clean Code in Angular 19',
        date_time: new Date(Date.now() - 86400000), // Yesterday
        location: 'Virtual',
        abstract: 'Best practices for writing clean code using Angular 19 and modern RxJS paradigms.',
        speaker_ids: ['s2'],
        tag_ids: ['t2'],
        video_material_id: 'sample_video_id',
        presentation_material_id: 'sample_ppt_id',
        is_hidden: false,
    },
    {
        id: '3',
        title: 'No Thumbnail Demo',
        date_time: new Date(Date.now() + (10 * 60000)), // In 10 minutes (to test Live Now badge)
        location: 'Room 304',
        abstract: 'This seminar tests the fallback thumbnail behavior and the Live Now/Starting Soon badge.',
        speaker_ids: ['s1'],
        tag_ids: ['t3'],
        is_hidden: false,
    }
];

@Injectable({
    providedIn: 'root'
})
export class MockSeminarService implements ISeminarService {
    private seminars$ = new BehaviorSubject<Seminar[]>(MOCK_SEMINARS.map(s => ({ ...s, is_hidden: false })));

    getSeminars(tagId?: string, speakerId?: string, startDate?: Date, endDate?: Date): Observable<Seminar[]> {
        let filtered = [...this.seminars$.value];

        // Public view logic: only show hidden seminars if specifically filtering (which implies admin intent in this mock)
        // or just always hide hidden ones for this simple demo unless we are in the admin dashboard.
        // For the demo, let's just use the presence of date range as an "admin/semester" fetch intent.
        if (!startDate && !endDate) {
            filtered = filtered.filter(s => !s.is_hidden);
        }

        if (tagId) {
            filtered = filtered.filter(s => s.tag_ids.includes(tagId));
        }
        if (speakerId) {
            filtered = filtered.filter(s => s.speaker_ids.includes(speakerId));
        }
        if (startDate && endDate) {
            filtered = filtered.filter(s => s.date_time >= startDate && s.date_time <= endDate);
        }
        return of(filtered).pipe(delay(500));
    }

    getSeminarById(id: string): Observable<Seminar | null> {
        const seminar = this.seminars$.value.find(s => s.id === id) || null;
        return of(seminar).pipe(delay(500));
    }

    createSeminar(seminar: Omit<Seminar, 'id'>): Observable<Seminar> {
        const newSeminar: Seminar = {
            ...seminar,
            id: `sem-${Math.floor(Math.random() * 1000)}`
        };
        this.seminars$.next([...this.seminars$.value, newSeminar]);
        return of(newSeminar).pipe(delay(500));
    }

    updateSeminar(id: string, updates: Partial<Seminar>): Observable<Seminar> {
        const current = this.seminars$.value;
        const index = current.findIndex(s => s.id === id);
        if (index === -1) throw new Error('Seminar not found');

        const updated = { ...current[index], ...updates };
        const next = [...current];
        next[index] = updated;
        this.seminars$.next(next);
        return of(updated).pipe(delay(500));
    }

    deleteSeminar(id: string): Observable<void> {
        const current = this.seminars$.value;
        this.seminars$.next(current.filter(s => s.id !== id));
        return of(undefined).pipe(delay(300));
    }
}
