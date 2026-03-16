# Quickstart: Admin User Management

## Prerequisites
- Working Firebase configuration with Firestore enabled.
- Admin user account for testing the dashboard.
- Initial admin bootstrapping via CLI/Script (promotes UID to 'admin' in Firestore).

## Setup
1. **Models**: Shared user models are located in `src/app/core/models/user.model.ts` and `src/app/core/models/user-profile.model.ts`.
2. **Services**: 
   - Ports/Interfaces: `src/app/core/contracts/`
   - Firebase Implementations: `src/app/firebase-adapters/`
3. **Components**:
   - Reusable `Pagination` and `Filter` components are in `src/app/shared/components/`.

## Running the Dashboard
1. Log in with an admin account.
2. Navigate to `/admin`. The system is built with reactive role synchronization; if you promote a user in the console, the "Admin" link will appear instantly.
3. Use the filter input to search for users by name or email.
4. Click on any user to view their detailed activity page at `/admin/users/detail/:uid`.

## Testing
- **Unit Tests**: `npm test -- --include src/app/features/admin/components/user-list`
- **E2E Tests**: `npx cucumber-js tests/e2e/features/admin-user-management.feature`
