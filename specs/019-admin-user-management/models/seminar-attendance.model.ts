export interface SeminarAttendance {
    uid: string;
    userUid: string;
    seminarUid: string;
    seminarTitle: string;
    date: Date;
    role: 'attendee' | 'speaker' | 'moderator';
}
