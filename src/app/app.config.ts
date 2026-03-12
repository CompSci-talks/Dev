import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Core Mock Service Injection (To be updated as mock instances are created)
    // { provide: 'IAuthService', useClass: MockAuthService },
    // { provide: 'ISeminarService', useClass: MockSeminarService },
    // { provide: 'IRsvpService', useClass: MockRsvpService },
    // { provide: 'IQaService', useClass: MockQaService },
  ]
};
