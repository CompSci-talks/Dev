import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, query, orderBy, getDocs, where, writeBatch } from '@angular/fire/firestore';
import { Observable, from, map, switchMap, catchError, of } from 'rxjs';
import { ISpeakerService } from '../core/contracts/speaker.interface';
import { Speaker } from '../core/models/seminar.model';

@Injectable({
    providedIn: 'root'
})
export class FirebaseSpeakerService implements ISpeakerService {
    private firestore = inject(Firestore);
    // Inject the Angular Injector to capture the context
    private injector = inject(Injector);
    private speakersCollection = collection(this.firestore, 'speakers');

    getSpeakers(): Observable<Speaker[]> {
        // Restore the context before calling collectionData
        return runInInjectionContext(this.injector, () => {
            const q = query(this.speakersCollection, orderBy('name'));
            return collectionData(q, { idField: 'id' }) as Observable<Speaker[]>;
        });
    }

    getSpeakerById(id: string): Observable<Speaker | null> {
        // Restore the context before calling docData
        return runInInjectionContext(this.injector, () => {
            const speakerDoc = doc(this.firestore, `speakers/${id}`);
            return docData(speakerDoc, { idField: 'id' }) as Observable<Speaker | null>;
        });
    }

    createSpeaker(speaker: Omit<Speaker, 'id'>): Observable<Speaker> {
        return from(addDoc(this.speakersCollection, speaker)).pipe(
            map(docRef => ({ ...speaker, id: docRef.id } as Speaker))
        );
    }

    updateSpeaker(id: string, updates: Partial<Speaker>): Observable<Speaker> {
        const { id: _, ...cleanUpdates } = updates as any;
        const speakerDoc = doc(this.firestore, `speakers/${id}`);
        return from(updateDoc(speakerDoc, cleanUpdates)).pipe(
            switchMap(async () => {
                if (cleanUpdates.name) {
                    await this.cascadeSpeakerUpdate(id, cleanUpdates.name);
                }
                return id;
            }),
            switchMap(speakerId => this.getSpeakerById(speakerId).pipe(map(s => s!))),
            catchError(err => {
                console.error(`Error updating speaker ${id}:`, err);
                throw err;
            })
        );
    }

    deleteSpeaker(id: string): Observable<void> {
        const speakerDoc = doc(this.firestore, `speakers/${id}`);
        return from(deleteDoc(speakerDoc));
    }

    private async cascadeSpeakerUpdate(speakerId: string, newName: string) {
        const seminarsQuery = query(collection(this.firestore, 'seminars'), where('speaker_ids', 'array-contains', speakerId));
        const snapshot = await getDocs(seminarsQuery);

        const batch = writeBatch(this.firestore);
        snapshot.forEach(seminarDoc => {
            const data = seminarDoc.data();
            const speakers = (data['speakers'] || []).map((s: any) =>
                s.id === speakerId ? { ...s, name: newName } : s
            );
            batch.update(seminarDoc.ref, { speakers });
        });

        await batch.commit();
    }
}