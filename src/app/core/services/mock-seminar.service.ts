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
    },
    {
        id: 'video-demo',
        title: 'Modern Web Performance: Deep Dive',
        date_time: new Date(Date.now() - 172800000), // 2 days ago (Archive)
        location: 'Main Hall',
        abstract: 'Learn how to optimize your web applications for the modern era. This session includes recorded demonstrations of profiling tools.',
        thumbnail_url: 'https://picsum.photos/seed/perf/800/400',
        speaker_ids: ['s2'],
        tag_ids: ['t1', 't2'],
        video_material_id: '1GABSDBDy1y05Ml2zNgblZuVDN2Tr05_X', // Real Video ID
        presentation_material_id: '1VIyW3OP2jqJrLXi6qVNT_FGKqpLlvxiL', // Real Slide ID
        is_hidden: false,
    }
];

@Injectable({
    providedIn: 'root'
})
export class MockSeminarService implements ISeminarService {
    private readonly STORAGE_KEY = 'mock_seminars';
    private seminars$ = new BehaviorSubject<Seminar[]>(this.loadSeminars());

    private loadSeminars(): Seminar[] {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                return parsed.map((s: any) => ({
                    ...s,
                    date_time: new Date(s.date_time)
                }));
            } catch (e) {
                console.error('Error loading seminars from localStorage', e);
            }
        }
        return MOCK_SEMINARS.map(s => ({ ...s, is_hidden: false }));
    }

    private saveSeminars(seminars: Seminar[]) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(seminars));
        this.seminars$.next(seminars);
    }

    getSeminars(tagId?: string, speakerId?: string, startDate?: Date, endDate?: Date): Observable<Seminar[]> {
        let filtered = [...this.seminars$.value];

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
        const next = [...this.seminars$.value, newSeminar];
        this.saveSeminars(next);
        return of(newSeminar).pipe(delay(500));
    }

    updateSeminar(id: string, updates: Partial<Seminar>): Observable<Seminar> {
        const current = this.seminars$.value;
        const index = current.findIndex(s => s.id === id);
        if (index === -1) throw new Error('Seminar not found');

        const updated = { ...current[index], ...updates };
        const next = [...current];
        next[index] = updated;
        this.saveSeminars(next);
        return of(updated).pipe(delay(500));
    }

    deleteSeminar(id: string): Observable<void> {
        const current = this.seminars$.value;
        const next = current.filter(s => s.id !== id);
        this.saveSeminars(next);
        return of(undefined).pipe(delay(300));
    }
}
