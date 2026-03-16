export interface UserProfile {
    uid: string;
    displayName: string;
    email: string;
    role: 'admin' | 'moderator' | 'authenticated';
    photoURL: string;
    createdAt: Date;
    lastActiveTimestamp: Date;
    preferredTopicIds: string[];
    attendanceCount: number;
}
