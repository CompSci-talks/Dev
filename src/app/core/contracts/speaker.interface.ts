import { Observable } from 'rxjs';
import { Speaker } from '../models/seminar.model';
import { InjectionToken } from '@angular/core';

export interface ISpeakerService {
    getSpeakers(): Observable<Speaker[]>;
    getSpeakerById(id: string): Observable<Speaker | null>;
    createSpeaker(speaker: Omit<Speaker, 'id'>): Observable<Speaker>;
}

export const SPEAKER_SERVICE = new InjectionToken<ISpeakerService>('SPEAKER_SERVICE');
