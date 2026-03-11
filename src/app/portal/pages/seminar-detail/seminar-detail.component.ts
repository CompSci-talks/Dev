import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, switchMap, of, map } from 'rxjs';
import { Seminar } from '../../../core/models/seminar.model';
import { MockSeminarService } from '../../../core/services/mock-seminar.service';
import { MockAuthService } from '../../../core/services/mock-auth.service';
import { SeminarStatusPipe } from '../../../core/pipes/seminar-status.pipe';
import { VideoPlayerComponent } from '../../../seminar-room/components/video-player/video-player.component';
import { SlideViewerComponent } from '../../../seminar-room/components/slide-viewer/slide-viewer.component';
import { RsvpButtonComponent } from '../../components/rsvp-button/rsvp-button.component';
import { QaContainerComponent } from '../../../seminar-room/components/qa-container/qa-container.component';

@Component({
    selector: 'app-seminar-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, SeminarStatusPipe, VideoPlayerComponent, SlideViewerComponent, RsvpButtonComponent, QaContainerComponent],
    templateUrl: './seminar-detail.component.html'
})
export class SeminarDetailComponent implements OnInit {
    private seminarService = inject(MockSeminarService);
    private authService = inject(MockAuthService);
    private route = inject(ActivatedRoute);

    seminar$!: Observable<Seminar | null>;
    isAuthenticated$!: Observable<boolean>;

    ngOnInit() {
        this.isAuthenticated$ = this.authService.currentUser$.pipe(map(user => !!user));

        this.seminar$ = this.route.paramMap.pipe(
            switchMap(params => {
                const id = params.get('id');
                if (!id) return of(null);
                return this.seminarService.getSeminarById(id);
            })
        );
    }
}
