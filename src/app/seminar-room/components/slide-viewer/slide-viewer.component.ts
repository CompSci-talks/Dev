import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../../../core/pipes/safe-url.pipe';

@Component({
    selector: 'app-slide-viewer',
    standalone: true,
    imports: [CommonModule, SafeUrlPipe],
    templateUrl: './slide-viewer.component.html'
})
export class SlideViewerComponent {
    @Input({ required: true }) presentationId!: string;

    // Assuming Google Drive ID for MVP as per requirements
    get embedUrl(): string {
        // rm=minimal hides some of the google drive UI
        return `https://docs.google.com/presentation/d/${this.presentationId}/embed?start=false&loop=false&delayms=3000&rm=minimal`;
    }
}
