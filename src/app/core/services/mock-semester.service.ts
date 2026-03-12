import { Injectable } from '@angular/core';
import { Observable, of, delay, BehaviorSubject } from 'rxjs';
import { ISemesterService } from '../contracts/semester.interface';
import { Semester } from '../models/semester.model';

const MOCK_SEMESTERS: Semester[] = [
    {
        id: 'sem-1',
        name: 'Spring 2026',
        start_date: new Date('2026-01-01'),
        end_date: new Date('2026-05-30'),
        is_active: true
    },
    {
        id: 'sem-2',
        name: 'Fall 2025',
        start_date: new Date('2025-09-01'),
        end_date: new Date('2025-12-25'),
        is_active: false
    }
];

@Injectable({
    providedIn: 'root'
})
export class MockSemesterService implements ISemesterService {
    private semesters$ = new BehaviorSubject<Semester[]>(MOCK_SEMESTERS);

    getSemesters(): Observable<Semester[]> {
        return this.semesters$.asObservable().pipe(delay(500));
    }

    getActiveSemester(): Observable<Semester | null> {
        const active = this.semesters$.value.find(s => s.is_active) || null;
        return of(active).pipe(delay(500));
    }

    createSemester(semester: Omit<Semester, 'id'>): Observable<Semester> {
        const newSemester: Semester = {
            ...semester,
            id: `sem-${Math.floor(Math.random() * 1000)}`
        };
        const current = this.semesters$.value;
        this.semesters$.next([...current, newSemester]);
        return of(newSemester).pipe(delay(500));
    }

    updateSemester(id: string, updates: Partial<Semester>): Observable<Semester> {
        const current = this.semesters$.value;
        const index = current.findIndex(s => s.id === id);
        if (index === -1) throw new Error('Semester not found');

        const updated = { ...current[index], ...updates };
        const next = [...current];
        next[index] = updated;
        this.semesters$.next(next);
        return of(updated).pipe(delay(500));
    }

    setActiveSemester(id: string): Observable<void> {
        const current = this.semesters$.value;
        const next = current.map(s => ({
            ...s,
            is_active: s.id === id
        }));
        this.semesters$.next(next);
        return of(undefined).pipe(delay(300));
    }
}
