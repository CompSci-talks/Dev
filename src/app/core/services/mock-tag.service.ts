import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ITagService } from '../contracts/tag.interface';
import { Tag } from '../models/seminar.model';

@Injectable({
    providedIn: 'root'
})
export class MockTagService implements ITagService {
    private tags: Tag[] = [
        { id: 't1', name: 'AI', color_code: '#3b82f6' },
        { id: 't2', name: 'Angular', color_code: '#ef4444' },
        { id: 't3', name: 'Open Source', color_code: '#10b981' }
    ];

    getTags(): Observable<Tag[]> {
        return of(this.tags);
    }

    getTagById(id: string): Observable<Tag | null> {
        return of(this.tags.find(t => t.id === id) || null);
    }

    createTag(tag: Omit<Tag, 'id'>): Observable<Tag> {
        const newTag = { ...tag, id: `t${this.tags.length + 1}` };
        this.tags.push(newTag);
        return of(newTag);
    }
}
