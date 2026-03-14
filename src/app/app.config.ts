import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { SupabaseSemesterService } from './supabase-adapters/supabase-semester.service';
import { SupabaseSeminarService } from './supabase-adapters/supabase-seminar.service';
import { SupabaseAuthService } from './supabase-adapters/supabase-auth.service';
import { SupabaseSpeakerService } from './supabase-adapters/supabase-speaker.service';
import { SupabaseTagService } from './supabase-adapters/supabase-tag.service';
import { SupabaseCommentService } from './supabase-adapters/supabase-comment.service';
import { AUTH_SERVICE } from './core/contracts/auth.interface';
import { SEMESTER_SERVICE } from './core/contracts/semester.interface';
import { SPEAKER_SERVICE } from './core/contracts/speaker.interface';
import { TAG_SERVICE } from './core/contracts/tag.interface';
import { SEMINAR_SERVICE } from './core/contracts/seminar.interface';
import { COMMENT_SERVICE } from './core/contracts/comment.interface';
import { EMAIL_SERVICE } from './admin/services/email.service';
import { ATTENDANCE_SERVICE } from './admin/services/attendance.service';
import { MockEmailAdapter } from './core/adapters/email/mock-email.adapter';
import { AttendanceService } from './admin/services/attendance.implementation.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Core Supabase Service Injection
    { provide: SEMESTER_SERVICE, useClass: SupabaseSemesterService },
    { provide: SEMINAR_SERVICE, useClass: SupabaseSeminarService },
    { provide: AUTH_SERVICE, useClass: SupabaseAuthService },
    { provide: SPEAKER_SERVICE, useClass: SupabaseSpeakerService },
    { provide: TAG_SERVICE, useClass: SupabaseTagService },
    { provide: COMMENT_SERVICE, useClass: SupabaseCommentService },
    { provide: EMAIL_SERVICE, useClass: MockEmailAdapter },
    { provide: ATTENDANCE_SERVICE, useClass: AttendanceService },
  ]
};
