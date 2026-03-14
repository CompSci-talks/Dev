import { TestBed } from '@angular/core/testing';
import { AttendanceService } from './attendance.implementation.service';
import { SEMINAR_SERVICE } from '../../core/contracts/seminar.interface';
import { of } from 'rxjs';
import { Attendee } from '../../core/models/attendance.model';

describe('AttendanceService', () => {
    let service: AttendanceService;
    let mockSeminarService: any;

    const mockAttendees: Attendee[] = [
        { id: '1', display_name: 'User A', email: 'a@test.com', marked_at: new Date(), status: 'attended' },
        { id: '2', display_name: 'User B', email: 'b@test.com', marked_at: new Date(), status: 'confirmed' },
    ];

    beforeEach(() => {
        mockSeminarService = {
            getAttendees: jasmine.createSpy('getAttendees').and.returnValue(of(mockAttendees))
        };

        TestBed.configureTestingModule({
            providers: [
                AttendanceService,
                { provide: SEMINAR_SERVICE, useValue: mockSeminarService }
            ]
        });
        service = TestBed.inject(AttendanceService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should filter by search query', () => {
        const filters = { searchQuery: 'User A' };
        const result = service.filterAttendees(mockAttendees, filters);
        expect(result.length).toBe(1);
        expect(result[0].display_name).toBe('User A');
    });

    it('should filter by status', () => {
        const filters = { status: 'confirmed' } as any;
        const result = service.filterAttendees(mockAttendees, filters);
        expect(result.length).toBe(1);
        expect(result[0].status).toBe('confirmed');
    });

    it('should return empty if search query does not match', () => {
        const filters = { searchQuery: 'Non-existent' };
        const result = service.filterAttendees(mockAttendees, filters);
        expect(result.length).toBe(0);
    });
});
