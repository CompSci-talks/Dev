export interface Comment {
  id: string;
  seminar_id: string;
  seminar_title?: string;
  author_id: string;
  author_photoURL?: string | null;
  author_name: string;
  text: string;
  created_at: Date;
  is_hidden: boolean;
  parent_id?: string | null;
}
