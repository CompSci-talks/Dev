# Data Model: Firebase Migration (Firestore NoSQL)

This document defines the denormalized data model for the CompSci Talks platform on Firebase Firestore.

## Collections

### 1. `users`
- **Path**: `/users/{uid}`
- **Metadata**:
  - `email`: string
  - `display_name`: string
  - `role`: 'admin' | 'authenticated'
  - `created_at`: timestamp

### 2. `semesters`
- **Path**: `/semesters/{id}`
- **Fields**:
  - `name`: string
  - `is_active`: boolean (current active semester)
  - `start_date`: timestamp
  - `end_date`: timestamp

### 3. `speakers`
- **Path**: `/speakers/{id}`
- **Fields**:
  - `name`: string
  - `bio`: string
  - `profile_image_url`: string
  - `seminar_history`: array (denormalized subset for profile view)
    - `{ id, title, date_time }`

### 4. `tags`
- **Path**: `/tags/{id}`
- **Fields**:
  - `name`: string
  - `color_hex`: string

### 5. `seminars` (Heavily Denormalized)
- **Path**: `/seminars/{id}`
- **Fields**:
  - `title`: string
  - `date_time`: timestamp
  - `location`: string
  - `abstract`: string
  - `thumbnail_url`: string
  - `is_hidden`: boolean
  - `video_material_id`: string?
  - `presentation_material_id`: string?
  - `semester`: object (denormalized)
    - `{ id, name }`
  - `speakers`: array (denormalized)
    - `{ id, name, profile_image_url }`
  - `tags`: array (denormalized)
    - `{ id, name, color_hex }`
  - `stats`: object (counters)
    - `comment_count`: number
    - `rsvp_count`: number

### 6. `rsvps`
- **Path**: `/rsvps/{userId_seminarId}`
- **Fields**:
  - `user_id`: string
  - `seminar_id`: string
  - `status`: 'confirmed' | 'attended'
  - `user_display_name`: string (denormalized)
  - `seminar_title`: string (denormalized)

### 7. `comments`
- **Path**: `/comments/{id}` (or subcollection)
- **Fields**:
  - `seminar_id`: string
  - `user_id`: string
  - `user_display_name`: string (denormalized)
  - `content`: string
  - `created_at`: timestamp

## Denormalization Maintenance

| Event | Action |
|-------|--------|
| Speaker Name Update | Update all `seminars` where `speaker.id` matches. |
| Tag Color Update | Update all `seminars` where `tag.id` matches. |
| RSVP Added | Increment `rsvp_count` on parent `seminars/{id}` document. |
| Comment Added | Increment `comment_count` on parent `seminars/{id}` document. |
