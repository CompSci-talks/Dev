import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Seminar } from '../../../core/models/seminar.model';
import { MockRsvpService } from '../../../core/services/mock-rsvp.service';
import { MockAuthService } from '../../../core/services/mock-auth.service';
import { Observable, combineLatest, map } from 'rxjs';

@Component({
    selector: 'app-rsvp-button',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './rsvp-button.component.html'
})
export class RsvpButtonComponent implements OnInit {
    @Input({ required: true }) seminar!: Seminar;

    private rsvpService = inject(MockRsvpService);
    private authService = inject(MockAuthService);

    isAttending$!: Observable<boolean>;
    isAuthenticated$!: Observable<boolean>;
    isLoading = false;

    ngOnInit() {
        this.isAuthenticated$ = this.authService.currentUser$.pipe(map(u => !!u));
        this.isAttending$ = this.rsvpService.isAttending$(this.seminar.id);
    }

    toggleRsvp(currentlyAttending: boolean) {
        this.isLoading = true;
        if (currentlyAttending) {
            this.rsvpService.removeRsvp(this.seminar.id).subscribe(() => this.isLoading = false);
        } else {
            this.rsvpService.addRsvp(this.seminar.id).subscribe(() => this.isLoading = false);
        }
    }

    get calendarLink(): string {
        return this.rsvpService.getCalendarLink(this.seminar);
    }
}
