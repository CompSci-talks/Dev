import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IAttendanceService } from './attendance.service';
import { Attendee, AttendanceFilter } from '../../core/models/attendance.model';
import { ISeminarService, SEMINAR_SERVICE } from '../../core/contracts/seminar.interface';

@Injectable({
    providedIn: 'root'
})
export class AttendanceService implements IAttendanceService {
    constructor(
        @Inject(SEMINAR_SERVICE) private seminarService: ISeminarService
    ) { }

    getAttendees(seminarId: string): Observable<Attendee[]> {
        return this.seminarService.getAttendees(seminarId);
    }

    filterAttendees(attendees: Attendee[], filters: AttendanceFilter): Attendee[] {
        let filtered = [...attendees];

        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(a =>
                a.display_name.toLowerCase().includes(query) ||
                a.email.toLowerCase().includes(query)
            );
        }

        if (filters.status) {
            filtered = filtered.filter(a => a.status === filters.status);
        }

        return filtered;
    }
}
