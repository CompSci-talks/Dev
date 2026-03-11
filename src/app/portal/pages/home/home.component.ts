import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Seminar } from '../../../core/models/seminar.model';
import { MockSeminarService } from '../../../core/services/mock-seminar.service';
import { SeminarCardComponent } from '../../components/seminar-card/seminar-card.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, SeminarCardComponent],
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
    private seminarService = inject(MockSeminarService);
    upcomingSeminars$!: Observable<Seminar[]>;

    ngOnInit() {
        this.upcomingSeminars$ = this.seminarService.getSeminars();
    }
}
