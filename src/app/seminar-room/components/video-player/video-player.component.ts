import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../../../core/pipes/safe-url.pipe';

@Component({
    selector: 'app-video-player',
    standalone: true,
    imports: [CommonModule, SafeUrlPipe],
    templateUrl: './video-player.component.html'
})
export class VideoPlayerComponent {
    @Input({ required: true }) videoId!: string;

    // Example Assuming YouTube ID for MVP. 
    // In production, this would build the correct embed URL based on provider.
    get embedUrl(): string {
        // adding modestbranding and rel=0 to limit external jumping
        return `https://www.youtube.com/embed/${this.videoId}?modestbranding=1&rel=0`;
    }
}
