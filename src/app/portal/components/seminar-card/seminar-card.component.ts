import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Seminar } from '../../../core/models/seminar.model';
import { SeminarStatusPipe } from '../../../core/pipes/seminar-status.pipe';

@Component({
    selector: 'app-seminar-card',
    standalone: true,
    imports: [CommonModule, RouterModule, SeminarStatusPipe],
    templateUrl: './seminar-card.component.html',
    host: {
        'class': 'block h-full w-full'
    }
})
export class SeminarCardComponent {
    @Input({ required: true }) seminar!: Seminar;

    imageLoaded = false;
    hasImageError = false;

    getSpeakerNames(speakers: any[] | undefined): string {
        if (!speakers) return '';
        return speakers.map(s => s.name).join(', ');
    }
}
