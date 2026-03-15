import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Seminar } from '../../../core/models/seminar.model';
import { ISeminarService, SEMINAR_SERVICE } from '../../../core/contracts/seminar.interface';
import { SeminarCardComponent } from '../../components/seminar-card/seminar-card.component';
import { SkeletonCardComponent } from '../../components/skeleton-card/skeleton-card.component';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-schedule',
    standalone: true,
    imports: [CommonModule, SeminarCardComponent, SkeletonCardComponent, RouterModule],
    templateUrl: './schedule.component.html'
})
export class ScheduleComponent implements OnInit {
    private seminarService = inject(SEMINAR_SERVICE);
    upcomingSeminars$!: Observable<Seminar[]>;

    ngOnInit() {
        const now = new Date();
        this.upcomingSeminars$ = this.seminarService.getSeminars().pipe(
            map(seminars => seminars.filter(s => new Date(s.date_time) > now))
        );
    }
}
