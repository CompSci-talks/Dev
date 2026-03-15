import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideFirebaseApp } from '@angular/fire/app';
import { initializeApp } from 'firebase/app';
import { provideAuth } from '@angular/fire/auth';
import { getAuth } from 'firebase/auth';
import { provideFirestore } from '@angular/fire/firestore';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../environments/environment';
import { FirebaseSemesterService } from './firebase-adapters/firebase-semester.service';
import { FirebaseSeminarService } from './firebase-adapters/firebase-seminar.service';
import { FirebaseAuthService } from './firebase-adapters/firebase-auth.service';
import { FirebaseCommentService } from './firebase-adapters/firebase-comment.service';
import { FirebaseRsvpService } from './firebase-adapters/firebase-rsvp.service';
import { FirebaseSpeakerService } from './firebase-adapters/firebase-speaker.service';
import { FirebaseTagService } from './firebase-adapters/firebase-tag.service';
import { AUTH_SERVICE } from './core/contracts/auth.interface';
import { RSVP_SERVICE } from './core/contracts/rsvp.interface';
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
    // Firebase Setup
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    // Core Firebase Service Injection
    { provide: SEMESTER_SERVICE, useClass: FirebaseSemesterService },
    { provide: SEMINAR_SERVICE, useClass: FirebaseSeminarService },
    { provide: AUTH_SERVICE, useClass: FirebaseAuthService },
    { provide: SPEAKER_SERVICE, useClass: FirebaseSpeakerService },
    { provide: TAG_SERVICE, useClass: FirebaseTagService },
    { provide: COMMENT_SERVICE, useClass: FirebaseCommentService },
    { provide: RSVP_SERVICE, useClass: FirebaseRsvpService },
    { provide: EMAIL_SERVICE, useClass: MockEmailAdapter },
    { provide: ATTENDANCE_SERVICE, useClass: AttendanceService },
  ]
};
