import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData, docData } from '@angular/fire/firestore';
import { collection, doc, addDoc, updateDoc, deleteDoc, query, where, orderBy, getDoc, getDocs, writeBatch, limit, serverTimestamp } from 'firebase/firestore';
import { Observable, from, map, switchMap, combineLatest, of, firstValueFrom } from 'rxjs';
import { ISeminarService } from '../core/contracts/seminar.interface';
import { Seminar } from '../core/models/seminar.model';
import { Attendee } from '../core/models/attendance.model';

@Injectable({
    providedIn: 'root'
})
export class FirebaseSeminarService implements ISeminarService {
    private firestore = inject(Firestore);
    private seminarsCollection = collection(this.firestore, 'seminars');

    getSeminars(tagId?: string, speakerId?: string, startDate?: Date, endDate?: Date): Observable<Seminar[]> {
        let q = query(this.seminarsCollection, orderBy('date_time', 'desc'));

        if (tagId) {
            q = query(q, where('tag_ids', 'array-contains', tagId));
        }

        if (speakerId) {
            q = query(q, where('speaker_ids', 'array-contains', speakerId));
        }

        if (startDate) {
            q = query(q, where('date_time', '>=', startDate));
        }

        if (endDate) {
            q = query(q, where('date_time', '<=', endDate));
        }

        return collectionData(q, { idField: 'id' }).pipe(
            map(seminars => seminars.map(s => this.mapTimestamps(s)))
        ) as Observable<Seminar[]>;
    }

    getSeminarById(id: string): Observable<Seminar | null> {
        const seminarDoc = doc(this.firestore, `seminars/${id}`);
        return docData(seminarDoc, { idField: 'id' }).pipe(
            map(s => s ? this.mapTimestamps(s) : null)
        ) as Observable<Seminar | null>;
    }

    createSeminar(seminar: Omit<Seminar, 'id'>): Observable<Seminar> {
        return from(this.enrichWithMetadata(seminar)).pipe(
            switchMap(enriched => from(addDoc(this.seminarsCollection, enriched))),
            map(docRef => ({ ...seminar, id: docRef.id } as Seminar))
        );
    }

    updateSeminar(id: string, updates: Partial<Seminar>): Observable<Seminar> {
        const seminarDoc = doc(this.firestore, `seminars/${id}`);

        // If IDs changed, we might need to re-enrich
        const enrichPromise = (updates.speaker_ids || updates.tag_ids)
            ? this.enrichWithMetadata(updates as any)
            : Promise.resolve(updates);

        return from(enrichPromise).pipe(
            switchMap(enriched => from(updateDoc(seminarDoc, enriched))),
            switchMap(() => this.getSeminarById(id).pipe(map(s => s!)))
        );
    }

    deleteSeminar(id: string): Observable<void> {
        return from(this.orchestrateDelete(id));
    }

    private async orchestrateDelete(id: string): Promise<void> {
        const seminarDoc = doc(this.firestore, `seminars/${id}`);

        // Cascading deletion of comments and RSVPs
        const commentsQuery = query(collection(this.firestore, 'comments'), where('seminar_id', '==', id));
        const rsvpsQuery = query(collection(this.firestore, 'rsvps'), where('seminar_id', '==', id));

        const [commentsSnap, rsvpsSnap] = await Promise.all([
            getDocs(commentsQuery),
            getDocs(rsvpsQuery)
        ]);

        const batch = writeBatch(this.firestore);
        batch.delete(seminarDoc);
        commentsSnap.forEach(d => batch.delete(d.ref));
        rsvpsSnap.forEach(d => batch.delete(d.ref));

        await batch.commit();
    }

    getAttendees(seminarId: string): Observable<Attendee[]> {
        const rsvpsQuery = query(collection(this.firestore, 'rsvps'), where('seminar_id', '==', seminarId));

        return collectionData(rsvpsQuery).pipe(
            switchMap(rsvps => {
                if (rsvps.length === 0) return of([]);

                const userQueries = rsvps.map(r => docData(doc(this.firestore, `users/${r['user_id']}`), { idField: 'id' }));
                return combineLatest(userQueries).pipe(
                    map(users => users.map((u: any, index) => ({
                        id: u?.id || '',
                        email: u?.email || '',
                        display_name: u?.display_name || 'User',
                        marked_at: rsvps[index]?.['created_at']?.toDate() || new Date(),
                        status: (rsvps[index]?.['status'] as any) || 'confirmed'
                    } as Attendee)))
                );
            })
        );
    }

    /** Attendee emailing function stub (mailto logic) - T024 */
    sendAttendeeEmail(seminarId: string, subject: string, body: string): Observable<void> {
        return this.getAttendees(seminarId).pipe(
            map(attendees => {
                const emails = attendees.map(a => a.email).join(',');
                if (emails) {
                    const mailto = `mailto:${emails}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    window.location.href = mailto;
                }
            })
        );
    }

    private async enrichWithMetadata(seminar: any): Promise<any> {
        const enriched = { ...seminar };

        if (seminar.speaker_ids && seminar.speaker_ids.length > 0) {
            const speakers = await Promise.all(
                seminar.speaker_ids.map(async (id: string) => {
                    const sDoc = await getDoc(doc(this.firestore, `speakers/${id}`));
                    return { id, name: sDoc.data()?.['name'] };
                })
            );
            enriched.speakers = speakers;
        }

        if (seminar.tag_ids && seminar.tag_ids.length > 0) {
            const tags = await Promise.all(
                seminar.tag_ids.map(async (id: string) => {
                    const tDoc = await getDoc(doc(this.firestore, `tags/${id}`));
                    return { id, name: tDoc.data()?.['name'], color_code: tDoc.data()?.['color_code'] };
                })
            );
            enriched.tags = tags;
        }

        return enriched;
    }

    private mapTimestamps(data: any): Seminar {
        return {
            ...data,
            date_time: data.date_time?.toDate ? data.date_time.toDate() : data.date_time
        };
    }
}
