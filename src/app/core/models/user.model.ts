export type UserRole = 'authenticated' | 'moderator' | 'admin';

export interface User {
    id: string; // UUID from Auth Provider
    email: string;
    display_name: string;
    role: UserRole;
    created_at: Date;
}
