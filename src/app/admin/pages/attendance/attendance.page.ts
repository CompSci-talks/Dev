import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ATTENDANCE_SERVICE, IAttendanceService } from '../../services/attendance.service';
import { SEMINAR_SERVICE, ISeminarService } from '../../../core/contracts/seminar.interface';
import { ToastService } from '../../../core/services/toast.service';
import { Attendee, AttendanceFilter } from '../../../core/models/attendance.model';
import { Seminar } from '../../../core/models/seminar.model';
import { Observable, forkJoin } from 'rxjs';
import { EmailComposerComponent } from '../../components/email-composer/email-composer.component';

@Component({
    selector: 'app-attendance-page',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, EmailComposerComponent],
    templateUrl: './attendance.page.html',
    styleUrl: './attendance.page.css'
})
export class AttendancePageComponent implements OnInit {
    seminarId: string | null = null;
    seminar: Seminar | null = null;
    attendees: Attendee[] = [];
    filteredAttendees: Attendee[] = [];
    selectedAttendeeIds = new Set<string>();
    selectedRecipients: Attendee[] = [];
    isLoading = true;
    showComposer = false;

    filters: AttendanceFilter = {
        searchQuery: '',
        status: undefined
    };

    constructor(
        private route: ActivatedRoute,
        @Inject(ATTENDANCE_SERVICE) private attendanceService: IAttendanceService,
        @Inject(SEMINAR_SERVICE) private seminarService: ISeminarService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        this.seminarId = this.route.snapshot.paramMap.get('id');
        if (this.seminarId) {
            this.loadData(this.seminarId);
        }
    }

    loadData(id: string): void {
        this.isLoading = true;

        // Safety timeout for Firestore index issues
        const timeoutId = setTimeout(() => {
            if (this.isLoading) {
                this.isLoading = false;
                this.toastService.error('Loading timed out. This may be due to missing database indexes.');
            }
        }, 10000);

        forkJoin({
            seminar: this.seminarService.getSeminarById(id),
            attendees: this.attendanceService.getAttendees(id)
        }).subscribe({
            next: (data) => {
                clearTimeout(timeoutId);
                this.seminar = data.seminar;
                this.attendees = data.attendees;
                this.applyFilters();
                this.isLoading = false;
            },
            error: (err) => {
                clearTimeout(timeoutId);
                console.error('Error loading attendance data', err);
                this.isLoading = false;
                this.toastService.error('Failed to load attendance data.');
            }
        });
    }

    applyFilters(): void {
        this.filteredAttendees = this.attendanceService.filterAttendees(this.attendees, this.filters);
        // Clean up selection if filtered out (optional but good practice)
        const visibleIds = new Set(this.filteredAttendees.map(a => a.id));
        this.selectedAttendeeIds.forEach(id => {
            if (!visibleIds.has(id)) this.selectedAttendeeIds.delete(id);
        });
    }

    toggleAttendee(id: string): void {
        if (this.selectedAttendeeIds.has(id)) {
            this.selectedAttendeeIds.delete(id);
        } else {
            this.selectedAttendeeIds.add(id);
        }
    }

    toggleAll(checked: boolean): void {
        if (checked) {
            this.filteredAttendees.forEach(a => this.selectedAttendeeIds.add(a.id));
        } else {
            this.selectedAttendeeIds.clear();
        }
    }

    isAllSelected(): boolean {
        return this.filteredAttendees.length > 0 &&
            this.filteredAttendees.every(a => this.selectedAttendeeIds.has(a.id));
    }

    isSelected(id: string): boolean {
        return this.selectedAttendeeIds.has(id);
    }

    getEmailCount(): number {
        return this.selectedAttendeeIds.size;
    }

    openComposer(): void {
        this.selectedRecipients = this.attendees.filter(a => this.selectedAttendeeIds.has(a.id));
        if (this.selectedRecipients.length > 0) {
            this.showComposer = true;
        }
    }

    closeComposer(): void {
        this.showComposer = false;
    }

    onEmailSent(): void {
        this.showComposer = false;
        this.selectedAttendeeIds.clear();
        this.toastService.success(`Emails sent successfully to ${this.selectedRecipients.length} recipients.`);
    }
}
