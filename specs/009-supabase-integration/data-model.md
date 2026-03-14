# Data Model: Supabase Schema

## Tables

### `semesters`
| Column | Type | Default | Constraints |
|--------|------|---------|-------------|
| id | uuid | gen_random_uuid()| PRIMARY KEY |
| name | text | | NOT NULL |
| start_date | timestamp | | NOT NULL |
| end_date | timestamp | | NOT NULL |
| is_active | boolean | false | |

### `seminars`
| Column | Type | Default | Constraints |
|--------|------|---------|-------------|
| id | uuid | gen_random_uuid()| PRIMARY KEY |
| title | text | | NOT NULL |
| date_time | timestamp | | NOT NULL |
| location | text | | NOT NULL |
| abstract | text | | |
| thumbnail_url | text | | |
| speaker_ids | uuid[] | '{}' | |
| tag_ids | uuid[] | '{}' | |
| video_material_id | text | | |
| presentation_material_id | text | | |
| is_hidden | boolean | false | |

### `speakers`
| Column | Type | Default | Constraints |
|--------|------|---------|-------------|
| id | uuid | gen_random_uuid()| PRIMARY KEY |
| name | text | | NOT NULL |
| bio | text | | |
| profile_image_url | text | | |
| affiliation | text | | |

### `tags`
| Column | Type | Default | Constraints |
|--------|------|---------|-------------|
| id | uuid | gen_random_uuid()| PRIMARY KEY |
| name | text | | NOT NULL UNIQUE |
| color_code | text | '#6366f1' | |

### `comments`
| Column | Type | Default | Constraints |
|--------|------|---------|-------------|
| id | uuid | gen_random_uuid()| PRIMARY KEY |
| seminar_id | uuid | | REFERENCES seminars(id) |
| author_id | uuid | | REFERENCES auth.users(id) |
| text | text | | NOT NULL |
| parent_id | uuid | | REFERENCES comments(id) |
| is_hidden | boolean | false | |
| created_at | timestamp | now() | |

### `rsvps`
| Column | Type | Default | Constraints |
|--------|------|---------|-------------|
| user_id | uuid | | PRIMARY KEY, REFERENCES auth.users(id) |
| seminar_id | uuid | | PRIMARY KEY, REFERENCES seminars(id) |
| status | text | 'confirmed'| |
| created_at | timestamp | now() | |

### `users` (Public Profile Mirror)
| Column | Type | Default | Constraints |
|--------|------|---------|-------------|
| id | uuid | | PRIMARY KEY, REFERENCES auth.users(id) |
| email | text | | NOT NULL |
| display_name | text | | |
| role | text | 'authenticated'| |
| created_at | timestamp | now() | |
