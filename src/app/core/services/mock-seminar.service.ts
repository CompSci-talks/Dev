import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
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
        presentation_material_id: 'sample_ppt_id'
    },
    {
        id: '3',
        title: 'No Thumbnail Demo',
        date_time: new Date(Date.now() + (10 * 60000)), // In 10 minutes (to test Live Now badge)
        location: 'Room 304',
        abstract: 'This seminar tests the fallback thumbnail behavior and the Live Now/Starting Soon badge.',
        speaker_ids: ['s1'],
        tag_ids: ['t3']
    }
];

@Injectable({
    providedIn: 'root'
})
export class MockSeminarService implements ISeminarService {
    getSeminars(tagId?: string, speakerId?: string): Observable<Seminar[]> {
        let filtered = [...MOCK_SEMINARS];
        if (tagId) {
            filtered = filtered.filter(s => s.tag_ids.includes(tagId));
        }
        if (speakerId) {
            filtered = filtered.filter(s => s.speaker_ids.includes(speakerId));
        }
        return of(filtered).pipe(delay(500)); // Simulate network latency
    }

    getSeminarById(id: string): Observable<Seminar | null> {
        const seminar = MOCK_SEMINARS.find(s => s.id === id) || null;
        return of(seminar).pipe(delay(500));
    }
}
