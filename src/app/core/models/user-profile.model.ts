export interface UserProfile {
    uid: string;
    displayName: string;
    email: string;
    role: 'admin' | 'moderator' | 'authenticated';
    photoURL?: string;
    createdAt: Date;
    lastLogin: Date;
    enrollmentDate?: Date;
    lastActiveTimestamp?: Date;
    preferredTopicAreas?: string[];
    attendanceCount?: number;
    attendedSeminarIds?: string[];
}
