# Quickstart: Admin User Management

## Prerequisites
- Working Firebase configuration with Firestore enabled.
- Admin user account for testing the dashboard.

## Setup
1. **Models**: Shared user models are located in `src/app/core/shared/models/user.model.ts`.
2. **Services**: 
   - Ports/Interfaces: `src/app/core/services/ports/`
   - Firebase Implementations: `src/app/core/services/adapters/`
3. **Components**:
   - Reusable `Pagination` and `Filter` components are in `src/app/core/shared/components/`.

## Running the Dashboard
1. Log in with an admin account.
2. Navigate to `/admin/users`.
3. Use the filter input to search for users.
4. Click on any user to view their detailed activity page at `/admin/users/:uid`.

## Testing
- **Unit Tests**: `npm test -- --include src/app/features/admin/components/user-list`
- **E2E Tests**: `npx cucumber-js features/admin-user-management.feature`
