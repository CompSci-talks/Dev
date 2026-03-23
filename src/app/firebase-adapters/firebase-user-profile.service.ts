import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData, docData } from '@angular/fire/firestore';
import { collection, doc, query, where, getDoc, getDocs, updateDoc, setDoc, limit, startAfter, orderBy, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import { Observable, from, map, of, catchError } from 'rxjs';
import { IUserService } from '../core/contracts/user.service.interface';
import { User } from '../core/models/user.model';
import { sanitizeForFirestore } from '../core/utils/firestore-utils';

@Injectable({
    providedIn: 'root'
})
export class FirebaseUserProfileService implements IUserService {
    private firestore = inject(Firestore);
    private usersCollection = collection(this.firestore, 'users');

    getUsers(pageSize: number, lastUser?: User, filter?: string): Observable<User[]> {
        let q = query(this.usersCollection, orderBy('display_name'), limit(pageSize));

        if (filter) {
            q = query(this.usersCollection,
                where('display_name', '>=', filter),
                where('display_name', '<=', filter + '\uf8ff'),
                orderBy('display_name'),
                limit(pageSize)
            );
        }

        // Handle cursor pagination
        // Note: For real cursor pagination, we need the DocumentSnapshot of the lastUser.
        // For simplicity in this implementation, we might need to fetch the doc first or 
        // rely on the caller passing the snapshot. But IUserService uses UserProfile.
        // We can fetch the last user's document to get the snapshot.

        return from(this.fetchWithCursor(q, lastUser)).pipe(
            map(snapshot => snapshot.docs.map(d => this.mapToProfile({ ...(d.data() as any), uid: d.id }))),
            catchError(error => {
                console.error('Error fetching users:', error);
                return of([]);
            })
        );
    }
    private async fetchWithCursor(q: any, lastUser?: User) {
        if (lastUser) {
            const lastDoc = await getDoc(doc(this.firestore, `users/${lastUser.id}`));
            if (lastDoc.exists()) {
                q = query(q, startAfter(lastDoc));
            }
        }
        return getDocs(q);
    }

    getUserById(uid: string): Observable<User | null> {
        const userDoc = doc(this.firestore, `users/${uid}`);
        return from(getDoc(userDoc)).pipe(
            map(snapshot => snapshot.exists() ? this.mapToProfile({ ...snapshot.data(), uid: snapshot.id }) : null),
            catchError(() => of(null))
        );
    }

    getUserById$(uid: string): Observable<User | null> {
        const userDoc = doc(this.firestore, `users/${uid}`);
        return (docData(userDoc, { idField: 'uid' }) as Observable<any>).pipe(
            map(data => data ? this.mapToProfile(data) : null),
            catchError(err => {
                console.error('[FirebaseUserProfileService] Error listening to user:', err);
                return of(null);
            })
        );
    }

    updateUserRole(uid: string, role: 'admin' | 'moderator' | 'authenticated'): Observable<void> {
        const userDoc = doc(this.firestore, `users/${uid}`);
        const cleanUpdates = sanitizeForFirestore({ role });
        return from(updateDoc(userDoc, cleanUpdates));
    }

    createUser(profile: User): Observable<void> {
        const userDoc = doc(this.firestore, `users/${profile.id}`);
        // Convert to plain object and sanitize
        const data = sanitizeForFirestore(profile);
        return from(setDoc(userDoc, data));
    }
    updateAttendanceCount(uid: string, delta: number): Observable<void> {
        const userDoc = doc(this.firestore, `users/${uid}`);
        return from(updateDoc(userDoc, {
            attendanceCount: increment(delta)
        }));
    }

    updateAttendedSeminars(uid: string, seminarId: string, action: 'add' | 'remove'): Observable<void> {
        const userDoc = doc(this.firestore, `users/${uid}`);
        return from(updateDoc(userDoc, {
            attendedSeminarIds: action === 'add' ? arrayUnion(seminarId) : arrayRemove(seminarId)
        }));
    }
    sendBulkEmail(uids: string[], subject: string, body: string): Observable<void> {
        // Implementation for FR-014: Mapping UIDs to emails for mailto
        // In a real app, this might call a backend service, but for now we follow the mailto pattern.
        return from(this.getEmails(uids)).pipe(
            map(emails => {
                if (emails.length > 0) {
                    const mailto = `mailto:${emails.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    window.location.href = mailto;
                }
            })
        );
    }

    private async getEmails(uids: string[]): Promise<string[]> {
        const emails: string[] = [];
        for (const uid of uids) {
            const user = await getDoc(doc(this.firestore, `users/${uid}`));
            if (user.exists() && user.data()?.['email']) {
                emails.push(user.data()?.['email']);
            }
        }
        return emails;
    }

    private mapToProfile(data: any): User {
        return {
            id: data.uid || data.id,
            display_name: data.displayName || data.display_name || 'User',
            email: data.email || '',
            role: data.role || 'authenticated',
            photo_url: data.photoURL || data.photo_url,
            created_at: this.toDate(data.createdAt || data.created_at),
            last_active_at: this.toDate(data.lastLogin || data.last_login),
            enrollment_date: this.toDate(data.enrollmentDate),
            preferred_topic_areas: data.preferredTopicAreas || [],
            attendance_count: data.attendanceCount || data.attendance_count || 0,
            attended_seminar_ids: data.attendedSeminarIds || []

        };
    }

    private toDate(field: any): Date {
        if (!field) return new Date();
        if (field.toDate) return field.toDate();
        if (field instanceof Date) return field;
        return new Date(field);
    }
    updatePhotoURL(uid: string, photoURL: string): Observable<void> {
        const userDoc = doc(this.firestore, `users/${uid}`);
        return from(updateDoc(userDoc, { photoURL }));
    }
}
