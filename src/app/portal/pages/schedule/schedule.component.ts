import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Seminar } from '../../../core/models/seminar.model';
import { MockSeminarService } from '../../../core/services/mock-seminar.service';
import { SeminarCardComponent } from '../../components/seminar-card/seminar-card.component';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-schedule',
    standalone: true,
    imports: [CommonModule, SeminarCardComponent, RouterModule],
    templateUrl: './schedule.component.html'
})
export class ScheduleComponent implements OnInit {
    private seminarService = inject(MockSeminarService);
    upcomingSeminars$!: Observable<Seminar[]>;

    ngOnInit() {
        const now = new Date();
        this.upcomingSeminars$ = this.seminarService.getSeminars().pipe(
            map(seminars => seminars.filter(s => new Date(s.date_time) > now))
        );
    }
}
