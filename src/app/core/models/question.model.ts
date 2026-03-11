export interface Question {
  id: string;
  seminar_id: string;
  author_id: string;
  content: string;
  created_at: Date;
  is_hidden: boolean; // default false, used for Phase 2 moderation
}
