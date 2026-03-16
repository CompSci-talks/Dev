import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, query, orderBy, getDocs, where, writeBatch } from '@angular/fire/firestore';
import { Observable, from, map, switchMap, catchError, of } from 'rxjs';
import { ITagService } from '../core/contracts/tag.interface';
import { Tag } from '../core/models/seminar.model';
import { isNameUnique, sanitizeForFirestore } from '../core/utils/firestore-utils';

@Injectable({
    providedIn: 'root'
})
export class FirebaseTagService implements ITagService {
    private firestore = inject(Firestore);
    // Inject the Angular Injector to capture the context
    private injector = inject(Injector);
    private tagsCollection = collection(this.firestore, 'tags');

    getTags(): Observable<Tag[]> {
        // Restore the context before calling collectionData
        return runInInjectionContext(this.injector, () => {
            const q = query(this.tagsCollection, orderBy('name'));
            return collectionData(q, { idField: 'id' }) as Observable<Tag[]>;
        });
    }

    getTagById(id: string): Observable<Tag | null> {
        // Restore the context before calling docData
        return runInInjectionContext(this.injector, () => {
            const tagDoc = doc(this.firestore, `tags/${id}`);
            return docData(tagDoc, { idField: 'id' }) as Observable<Tag | null>;
        });
    }

    createTag(tag: Omit<Tag, 'id'>): Observable<Tag> {
        return from(isNameUnique(this.firestore, 'tags', 'name', tag.name)).pipe(
            switchMap(isUnique => {
                if (!isUnique) throw new Error('A tag with this name already exists.');
                return from(addDoc(this.tagsCollection, tag));
            }),
            map(docRef => ({ ...tag, id: docRef.id } as Tag))
        );
    }

    updateTag(id: string, updates: Partial<Tag>): Observable<Tag> {
        const cleanUpdates = sanitizeForFirestore(updates);
        return from(
            cleanUpdates.name
                ? isNameUnique(this.firestore, 'tags', 'name', cleanUpdates.name, id)
                : Promise.resolve(true)
        ).pipe(
            switchMap(isUnique => {
                if (!isUnique) throw new Error('A tag with this name already exists.');
                const tagDoc = doc(this.firestore, `tags/${id}`);
                return from(updateDoc(tagDoc, cleanUpdates));
            }),
            switchMap(async () => {
                if (cleanUpdates.name || cleanUpdates.color_code) {
                    await this.cascadeTagUpdate(id, cleanUpdates);
                }
                return id;
            }),
            switchMap(tagId => this.getTagById(tagId).pipe(map(t => t!))),
            catchError(err => {
                console.error(`Error updating tag ${id}:`, err);
                throw err;
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