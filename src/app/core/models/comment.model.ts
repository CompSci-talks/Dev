export interface Comment {
  id: string;
  seminar_id: string;
  author_id: string;
  text: string;
  created_at: Date;
  is_hidden: boolean;
  parent_id?: string;
}
