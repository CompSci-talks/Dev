import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserProfile } from '../../core/models/user-profile.model';

@Injectable({
    providedIn: 'root'
})
export class EmailSelectionService {
    private selectedUsersSubject = new BehaviorSubject<UserProfile[]>([]);

    /**
     * Observable stream of currently selected user profiles for emailing.
     */
    get selectedUsers$(): Observable<UserProfile[]> {
        return this.selectedUsersSubject.asObservable();
    }

    /**
     * Set the entire list of selected users.
     */
    setSelectedUsers(users: UserProfile[]): void {
        this.selectedUsersSubject.next(users);
    }

    /**
     * Get the current value of selected users synchronously.
     */
    getSelectedUsers(): UserProfile[] {
        return this.selectedUsersSubject.getValue();
    }

    /**
     * Add a single user to the selection if not already present.
     */
    addSelectedUser(user: UserProfile): void {
        const current = this.getSelectedUsers();
        if (!current.some(u => u.uid === user.uid)) {
            this.selectedUsersSubject.next([...current, user]);
        }
    }

    /**
     * Remove a single user from the selection.
     */
    removeSelectedUser(uid: string): void {
        const current = this.getSelectedUsers();
        this.selectedUsersSubject.next(current.filter(u => u.uid !== uid));
    }

    /**
     * Clear all selected users.
     */
    clearSelection(): void {
        this.selectedUsersSubject.next([]);
    }
}
