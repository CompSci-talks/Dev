# Data Model: Phase 1 — Attendees Portal

## 1. Entities

### User (Attendee)
- **id**: string (UUID from Auth Provider)
- **email**: string (unique)
- **display_name**: string
- **role**: enum ('guest', 'authenticated', 'admin') // Phase 1 uses guest/authenticated
- **created_at**: timestamp

### Seminar
- **id**: string (UUID)
- **title**: string
- **date_time**: timestamp
- **location**: string
- **abstract**: string (Rich Text / Markdown)
- **thumbnail_url**: string (optional, URL to image)
- **speaker_ids**: string[] (Foreign Keys to Speaker)
- **tag_ids**: string[] (Foreign Keys to Tag)
- **video_material_id**: string (optional, External Drive ID)
- **presentation_material_id**: string (optional, External Drive ID)
- *Derived Property*: `status` ('upcoming' | 'past') derived via `date_time < current_time`

### Speaker
- **id**: string (UUID)
- **name**: string
- **bio**: string
- **profile_image_url**: string (optional)
- **affiliation**: string (optional)

### Tag
- **id**: string (UUID)
- **name**: string (unique, e.g., "AI", "Career")
- **color_code**: string (Hex code for UI)

### RSVP
- **id**: string (UUID)
- **user_id**: string (Foreign Key to User)
- **seminar_id**: string (Foreign Key to Seminar)
- **created_at**: timestamp
- *Constraint*: Unique compound key `(user_id, seminar_id)` to prevent duplicate RSVPs.

### Question (Q&A)
- **id**: string (UUID)
- **seminar_id**: string (Foreign Key to Seminar)
- **author_id**: string (Foreign Key to User)
- **content**: string
- **created_at**: timestamp
- **is_hidden**: boolean (default: false) // Moderation flag for Phase 2

## 2. Validation Rules (Client-Side & Database Level)
- **RSVP**: Cannot RSVP if not authenticated.
- **RSVP**: Cannot RSVP if the seminar is in the past.
- **Question**: `content` cannot be empty or whitespace only.
- **Question**: Cannot submit if not authenticated.
- **Material Access**: Cannot load video or presentation ID unless authenticated.

## 3. Storage Definitions
- **Database**: Supabase PostgreSQL.
- **Table Relationships**:
  - `seminar_speakers` (Many-to-Many junction table for Seminar ↔ Speaker)
  - `seminar_tags` (Many-to-Many junction table for Seminar ↔ Tag)
- **Assets**: Google Drive handles raw files (Videos, PPTs, Images). The DB only stores the extracted file IDs or public URLs depending on asset type.
