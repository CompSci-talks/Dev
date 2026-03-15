import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, query, orderBy, getDocs, where, writeBatch } from '@angular/fire/firestore';
import { Observable, from, map, switchMap, take } from 'rxjs';
import { ISpeakerService } from '../core/contracts/speaker.interface';
import { Speaker } from '../core/models/seminar.model';

@Injectable({
    providedIn: 'root'
})
export class FirebaseSpeakerService implements ISpeakerService {
    private firestore = inject(Firestore);
    private speakersCollection = collection(this.firestore, 'speakers');

    getSpeakers(): Observable<Speaker[]> {
        const q = query(this.speakersCollection, orderBy('name'));
        return collectionData(q, { idField: 'id' }) as Observable<Speaker[]>;
    }

    getSpeakerById(id: string): Observable<Speaker | null> {
        const speakerDoc = doc(this.firestore, `speakers/${id}`);
        return docData(speakerDoc, { idField: 'id' }) as Observable<Speaker | null>;
    }

    createSpeaker(speaker: Omit<Speaker, 'id'>): Observable<Speaker> {
        return from(addDoc(this.speakersCollection, speaker)).pipe(
            map(docRef => ({ ...speaker, id: docRef.id } as Speaker))
        );
    }

    updateSpeaker(id: string, updates: Partial<Speaker>): Observable<Speaker> {
        const speakerDoc = doc(this.firestore, `speakers/${id}`);
        return from(updateDoc(speakerDoc, updates)).pipe(
            switchMap(() => {
                if (updates.name) {
                    this.cascadeSpeakerUpdate(id, updates.name);
                }
                return this.getSpeakerById(id).pipe(map(s => s!));
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
