import { TestBed } from '@angular/core/testing';
import { FirebaseAuthService } from './firebase-auth.service';
import { Auth } from '@angular/fire/auth';
import { USER_SERVICE } from '../core/contracts/user.service.interface';
import { of, lastValueFrom } from 'rxjs';
import * as fireAuth from '@angular/fire/auth';
import { NgZone } from '@angular/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('FirebaseAuthService', () => {
    let service: FirebaseAuthService;
    let authMock: any;
    let userServiceMock: any;

    beforeEach(() => {
        authMock = {
            currentUser: {
                reload: () => Promise.resolve(),
                uid: '123'
            }
        };
        userServiceMock = {
            getCurrentUser: () => of({ uid: '123', email_verified: false }),
            syncUser: () => of(null)
        };

        TestBed.configureTestingModule({
            providers: [
                FirebaseAuthService,
                { provide: Auth, useValue: authMock },
                { provide: USER_SERVICE, useValue: userServiceMock },
                { provide: NgZone, useValue: { run: (cb: any) => cb() } }
            ]
        });
        service = TestBed.inject(FirebaseAuthService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call sendPasswordResetEmail', async () => {
        const spy = vi.spyOn(fireAuth, 'sendPasswordResetEmail').mockResolvedValue(undefined as any);
        await lastValueFrom(service.sendPasswordResetEmail('test@example.com'));
        expect(spy).toHaveBeenCalled();
    });

    it('should call verifyPasswordResetCode', async () => {
        const spy = vi.spyOn(fireAuth, 'verifyPasswordResetCode').mockResolvedValue('test@example.com');
        const email = await lastValueFrom(service.verifyPasswordResetCode('code123'));
        expect(spy).toHaveBeenCalled();
        expect(email).toBe('test@example.com');
    });

    it('should call confirmPasswordReset', async () => {
        const spy = vi.spyOn(fireAuth, 'confirmPasswordReset').mockResolvedValue(undefined);
        await lastValueFrom(service.confirmPasswordReset('code123', 'newPass123'));
        expect(spy).toHaveBeenCalled();
    });
});
