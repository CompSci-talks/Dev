# External Material ID Mapping (Principle VI Compliance)

To satisfy **Principle VI (Zero-Cost & Serverless-First)**, all heavy assets like videos and presentations are stored externally (e.g., Google Drive, YouTube, or a CDN) and referenced by ID in the Supabase `seminars` table.

## Supported Formats

### 1. YouTube Videos
- **Handle**: `youtube:[VIDEO_ID]`
- **Example**: `youtube:dQw4w9WgXcQ`
- **Frontend Resolution**: The portal UI will prepend `https://www.youtube.com/embed/` for the iframe.

### 2. Google Drive Presentations (Slides)
- **Handle**: `gdrive:[FILE_ID]`
- **Example**: `gdrive:1z2x3c4v5b6n7m8l9k0j`
- **Frontend Resolution**: The portal UI will use the Google Drive viewer link: `https://docs.google.com/viewer?srcid=[FILE_ID]&pid=explorer&efh=false&a=v&chrome=false&embedded=true`

### 3. Direct PDF/Asset Links (CDN)
- **Handle**: `url:[FULL_URL]`
- **Example**: `url:https://example.com/slides.pdf`
- **Frontend Resolution**: Opened directly in a new tab or via a generic iframe.

## Implementation Details
The `Seminar` interface's `video_material_id` and `presentation_material_id` fields should store these handles. The `MaterialService` (to be implemented) will handle the prefix parsing and URL generation.
