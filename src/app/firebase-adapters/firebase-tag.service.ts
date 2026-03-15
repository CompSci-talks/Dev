import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData, docData } from '@angular/fire/firestore';
import { collection, doc, addDoc, updateDoc, deleteDoc, query, orderBy, getDocs, where, writeBatch } from 'firebase/firestore';
import { Observable, from, map, switchMap, take } from 'rxjs';
import { ITagService } from '../core/contracts/tag.interface';
import { Tag } from '../core/models/seminar.model';

@Injectable({
    providedIn: 'root'
})
export class FirebaseTagService implements ITagService {
    private firestore = inject(Firestore);
    private tagsCollection = collection(this.firestore, 'tags');

    getTags(): Observable<Tag[]> {
        const q = query(this.tagsCollection, orderBy('name'));
        return collectionData(q, { idField: 'id' }) as Observable<Tag[]>;
    }

    getTagById(id: string): Observable<Tag | null> {
        const tagDoc = doc(this.firestore, `tags/${id}`);
        return docData(tagDoc, { idField: 'id' }) as Observable<Tag | null>;
    }

    createTag(tag: Omit<Tag, 'id'>): Observable<Tag> {
        return from(addDoc(this.tagsCollection, tag)).pipe(
            map(docRef => ({ ...tag, id: docRef.id } as Tag))
        );
    }

    updateTag(id: string, updates: Partial<Tag>): Observable<Tag> {
        const tagDoc = doc(this.firestore, `tags/${id}`);
        return from(updateDoc(tagDoc, updates)).pipe(
            switchMap(() => {
                if (updates.name || updates.color_code) {
                    this.cascadeTagUpdate(id, updates);
                }
                return this.getTagById(id).pipe(map(t => t!));
            })
        );
    }

    deleteTag(id: string): Observable<void> {
        const tagDoc = doc(this.firestore, `tags/${id}`);
        return from(deleteDoc(tagDoc));
    }

    private async cascadeTagUpdate(tagId: string, updates: Partial<Tag>) {
        const seminarsQuery = query(collection(this.firestore, 'seminars'), where('tag_ids', 'array-contains', tagId));
        const snapshot = await getDocs(seminarsQuery);

        const batch = writeBatch(this.firestore);
        snapshot.forEach(seminarDoc => {
            const data = seminarDoc.data();
            const tags = (data['tags'] || []).map((t: any) =>
                t.id === tagId ? { ...t, ...updates } : t
            );
            batch.update(seminarDoc.ref, { tags });
        });

        await batch.commit();
    }
}
