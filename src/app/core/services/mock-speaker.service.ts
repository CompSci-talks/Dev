import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ISpeakerService } from '../contracts/speaker.interface';
import { Speaker } from '../models/seminar.model';

@Injectable({
    providedIn: 'root'
})
export class MockSpeakerService implements ISpeakerService {
    private speakers: Speaker[] = [
        { id: 's1', name: 'Dr. Alan Turing', bio: 'Father of theoretical computer science and artificial intelligence.', affiliation: 'Cambridge University' },
        { id: 's2', name: 'Dr. Grace Hopper', bio: 'Pioneer of computer programming and creator of COBOL.', affiliation: 'US Navy' }
    ];

    getSpeakers(): Observable<Speaker[]> {
        return of(this.speakers);
    }

    getSpeakerById(id: string): Observable<Speaker | null> {
        return of(this.speakers.find(s => s.id === id) || null);
    }

    createSpeaker(speaker: Omit<Speaker, 'id'>): Observable<Speaker> {
        const newSpeaker = { ...speaker, id: `s${this.speakers.length + 1}` };
        this.speakers.push(newSpeaker);
        return of(newSpeaker);
    }
}
