import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Seminar } from '../../../core/models/seminar.model';
import { MockSeminarService } from '../../../core/services/mock-seminar.service';
import { SeminarCardComponent } from '../../components/seminar-card/seminar-card.component';

@Component({
    selector: 'app-archive',
    standalone: true,
    imports: [CommonModule, SeminarCardComponent],
    templateUrl: './archive.component.html'
})
export class ArchiveComponent implements OnInit {
    private seminarService = inject(MockSeminarService);
    pastSeminars$!: Observable<Seminar[]>;

    ngOnInit() {
        const now = new Date();
        this.pastSeminars$ = this.seminarService.getSeminars().pipe(
            map(seminars => seminars.filter(s => new Date(s.date_time) <= now))
        );
    }
}
