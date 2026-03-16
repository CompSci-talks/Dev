export interface UserProfile {
    uid: string;
    displayName: string;
    email: string;
    role: 'admin' | 'user' | 'moderator';
    photoURL?: string;
    createdAt: Date;
    lastLogin: Date;
    enrollmentDate?: Date;
    lastActiveTimestamp?: Date;
    preferredTopicAreas?: string[];
}
