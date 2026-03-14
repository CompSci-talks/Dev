import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { MockSemesterService } from './core/services/mock-semester.service';
import { MockSeminarService } from './core/services/mock-seminar.service';
import { MockAuthService } from './core/services/mock-auth.service';
import { AUTH_SERVICE } from './core/contracts/auth.interface';
import { SEMESTER_SERVICE } from './core/contracts/semester.interface';
import { SPEAKER_SERVICE } from './core/contracts/speaker.interface';
import { TAG_SERVICE } from './core/contracts/tag.interface';
import { SEMINAR_SERVICE } from './core/contracts/seminar.interface';
import { MockSpeakerService } from './core/services/mock-speaker.service';
import { MockTagService } from './core/services/mock-tag.service';
import { MockCommentService } from './core/services/mock-comment.service';
import { COMMENT_SERVICE } from './core/contracts/comment.interface';
import { EMAIL_SERVICE } from './admin/services/email.service';
import { ATTENDANCE_SERVICE } from './admin/services/attendance.service';
import { MockEmailAdapter } from './core/adapters/email/mock-email.adapter';
import { AttendanceService } from './admin/services/attendance.implementation.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Core Mock Service Injection
    { provide: SEMESTER_SERVICE, useClass: MockSemesterService },
    { provide: SEMINAR_SERVICE, useClass: MockSeminarService },
    { provide: AUTH_SERVICE, useClass: MockAuthService },
    { provide: SPEAKER_SERVICE, useClass: MockSpeakerService },
    { provide: TAG_SERVICE, useClass: MockTagService },
    { provide: COMMENT_SERVICE, useClass: MockCommentService },
    { provide: EMAIL_SERVICE, useClass: MockEmailAdapter },
    { provide: ATTENDANCE_SERVICE, useClass: AttendanceService },
  ]
};
