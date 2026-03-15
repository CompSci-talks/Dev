import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, ParamMap } from '@angular/router';
import { Observable, switchMap, of, map, tap } from 'rxjs';
import { Seminar } from '../../../core/models/seminar.model';
import { AUTH_SERVICE } from '../../../core/contracts/auth.interface';
import { SEMINAR_SERVICE } from '../../../core/contracts/seminar.interface';
import { SeminarStatusPipe } from '../../../core/pipes/seminar-status.pipe';
import { VideoPlayerComponent } from '../../../seminar-room/components/video-player/video-player.component';
import { SlideViewerComponent } from '../../../seminar-room/components/slide-viewer/slide-viewer.component';
import { RsvpButtonComponent } from '../../components/rsvp-button/rsvp-button.component';
import { CommentsContainerComponent } from '../../../seminar-room/components/comments-container/comments-container.component';

@Component({
    selector: 'app-seminar-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, SeminarStatusPipe, VideoPlayerComponent, SlideViewerComponent, RsvpButtonComponent, CommentsContainerComponent],
    templateUrl: './seminar-detail.component.html'
})
export class SeminarDetailComponent implements OnInit {
    private seminarService = inject(SEMINAR_SERVICE);
    private authService = inject(AUTH_SERVICE);
    private route = inject(ActivatedRoute);

    seminar$!: Observable<Seminar | null>;
    isAuthenticated$!: Observable<boolean>;

    isLoading = true;
    imageLoaded = false;

    ngOnInit() {
        this.isAuthenticated$ = this.authService.currentUser$.pipe(map(user => !!user));

        this.seminar$ = this.route.paramMap.pipe(
            tap(() => this.isLoading = true),
            switchMap((params: ParamMap) => {
                const id = params.get('id');
                if (!id) return of(null);
                return this.seminarService.getSeminarById(id);
            }),
            tap(() => this.isLoading = false)
        );
    }

    getSpeakerNames(speakers: any[] | undefined): string {
        if (!speakers) return '';
        return speakers.map(s => s.name).join(', ');
    }
}
