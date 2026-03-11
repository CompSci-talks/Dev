import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
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
        this.pastSeminars$ = this.seminarService.getSeminars();
    }
}
