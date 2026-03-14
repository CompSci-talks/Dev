# Research: Admin Attendance Emailing

## Decision: Rich-Text Editor - ngx-quill
- **Rationale**: industry standard for Angular, lightweight, and supports the "Zero-Cost" constitutional principle by being open-source.
- **Alternatives considered**: 
    - **Draft.js**: React-focused, harder to integrate with Angular.
    - **TinyMCE**: Heavy, requires API keys/account for some features (Principle VI risk).

## Decision: Adapter Pattern for EmailService
- **Rationale**: CompSci Talks Constitution (Principle I) mandates that external services use interfaces.
- **Implementation**: 
    - Port: `EmailService` interface in `admin/services`.
    - Adapters: `MockEmailAdapter` for development and real provider adapters (e.g., SMTP) for production.

## Decision: Attendance Fetching logic
- **Rationale**: Horizontal expansion of existing `MockSeminarService`.
- **Strategy**: Add `getAttendees(seminarId: string)` to the interface.
