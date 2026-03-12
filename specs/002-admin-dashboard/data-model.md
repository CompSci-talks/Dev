# Data Model: Phase 2 — Admin Dashboard

This document defines the entities and relationships required for the Admin management features.

## Entities

### `Semester`
Represents an academic term used to group and filter seminars.

| Field | Type | Validation / Constraints | Description |
|-------|------|--------------------------|-------------|
| `id` | `uuid` | Primary Key, Auto-gen | Unique identifier |
| `name` | `string` | Required, Not Empty | Name (e.g., "Spring 2026") |
| `start_date` | `Date` | Required | Start of the term |
| `end_date` | `Date` | Required, > `start_date` | End of the term |
| `is_active` | `boolean` | Exactly one `true` | Determines visibility in "Upcoming Schedule" |

### `Seminar` (Updated)
Existing entity extended with moderation capabilities.

| Field | Type | Changes | Description |
|-------|------|---------|-------------|
| `is_hidden` | `boolean` | **NEW** (internal) | Allow manual hiding from portal without deletion |

## Relationships

- **Semester ↔ Seminar**: Implicit (Non-Relational).
  - Seminars are filtered into Semesters by comparing `seminar.date` with `semester.start_date` and `semester.end_date`.
- **User → RSVP**: One-to-Many (Existing).
- **Seminar → Comment**: One-to-Many (Existing).

## State Transitions

### Semester Activation
1. Admin creates Semester `S2` with date range `[D1, D2]`.
2. Admin sets `S2.is_active = true`.
3. System triggers `S1.is_active = false`.
4. Portal now fetches seminars where `date` is between `D1` and `D2` for the "Upcoming Schedule".

### Material Attachment
1. Seminar record exists with no material.
2. Admin specifies material via one of three methods:
   - **Upload**: ADAPTER streams to Drive → returns `FileID`.
   - **Manual ID**: Admin pastes a known Google Drive `FileID`.
   - **Manual URL**: Admin pastes a direct link.
3. Seminar record updated with `video_url` or `ppt_url` containing the ID or URL.

