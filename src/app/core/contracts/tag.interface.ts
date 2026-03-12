import { Observable } from 'rxjs';
import { Tag } from '../models/seminar.model';
import { InjectionToken } from '@angular/core';

export interface ITagService {
    getTags(): Observable<Tag[]>;
    getTagById(id: string): Observable<Tag | null>;
    createTag(tag: Omit<Tag, 'id'>): Observable<Tag>;
}

export const TAG_SERVICE = new InjectionToken<ITagService>('TAG_SERVICE');
