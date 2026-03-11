export interface Speaker {
    id: string;
    name: string;
    bio: string;
    profile_image_url?: string;
    affiliation?: string;
}

export interface Tag {
    id: string;
    name: string;
    color_code: string;
}

export interface Seminar {
    id: string;
    title: string;
    date_time: Date;
    location: string;
    abstract: string; // Markdown / Rich Text
    thumbnail_url?: string;
    speaker_ids: string[];
    tag_ids: string[];
    video_material_id?: string;
    presentation_material_id?: string;
}

export type SeminarStatus = 'upcoming' | 'past';

// Derived utility helper since status is not strictly stored
export const getSeminarStatus = (seminar: Seminar): SeminarStatus => {
    return seminar.date_time.getTime() < Date.now() ? 'past' : 'upcoming';
};
