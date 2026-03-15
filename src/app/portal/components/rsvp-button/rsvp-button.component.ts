import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Seminar } from '../../../core/models/seminar.model';
import { IRsvpService, RSVP_SERVICE } from '../../../core/contracts/rsvp.interface';
import { AUTH_SERVICE } from '../../../core/contracts/auth.interface';
import { Observable, combineLatest, map, switchMap, of } from 'rxjs';

@Component({
    selector: 'app-rsvp-button',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './rsvp-button.component.html'
})
export class RsvpButtonComponent implements OnInit {
    @Input({ required: true }) seminar!: Seminar;

    private rsvpService = inject(RSVP_SERVICE);
    private authService = inject(AUTH_SERVICE);

    isAttending$!: Observable<boolean>;
    isAuthenticated$!: Observable<boolean>;
    isLoading = false;

    ngOnInit() {
        this.isAuthenticated$ = this.authService.currentUser$.pipe(map(u => !!u));
        this.isAttending$ = this.isAuthenticated$.pipe(
            switchMap(auth => auth ? this.rsvpService.isAttending$(this.seminar.id) : of(false))
        );
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
