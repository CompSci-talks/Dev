# Quickstart: Phase 1 — Attendees Portal

## 1. Local Development Setup

### Prerequisites
- Node.js (v18+)
- Angular CLI (`npm i -g @angular/cli`)
- Git

### Installation
1. Clone the repository and checkout the Phase 1 branch:
   ```bash
   git checkout 001-attendees-portal
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally (Mock Mode)
To develop UI components without relying on the real Supabase backend, run the app with the mock environment configuration. This injects the mock services (as per Constitution Principle III):
```bash
ng serve --configuration=mock
```

## 2. Directory Structure Guide
Following Constitution Principle II (Vertical Slicing), navigate the `src/app/` directory by feature:
- `core/`: Interface definitions (`ISeminarService`), generic guards, error handlers.
- `portal/`: Components for the public schedule and searchable archive pages.
- `auth/`: Login and registration flows.
- `seminar-room/`: Components for viewing a specific seminar (video/slides) and its Q&A.
- `dashboard/`: The authenticated user's RSVP list.
- `supabase-adapters/`: The concrete implementations of `core` interfaces that actually talk to Supabase.

## 3. Creating a New Feature Component
1. **Define the Interface**: If your component needs data, ensure an interface exists in `core/contracts/`.
2. **Create the Mock**: Ensure a mock implementation exists and provides observable streams of dummy data.
3. **Build the Smart Component**: Use `ng generate component` in your feature slice. Inject the interface (via Dependency Injection tokens).
4. **Build Dumb Components**: Create presentation components that use `@Input()` for data and `@Output()` for actions.
5. **Test**: Run `ng test` to ensure your smart component behaves correctly with the mock data stream.
