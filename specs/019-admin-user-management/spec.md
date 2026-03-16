# Feature Specification: Admin User Management

**Feature Branch**: `019-admin-user-management`  
**Created**: 2026-03-16  
**Status**: Draft  
**Input**: User description: "there must be a user management section as well in the admin dashboard, it should have list of all user paginated that shows those fields for the user( display name, email, role, number or seminar attendance, and maybe any other relevant fiels that maybe useful in the system (pagination list should be extracted into component in the core, and should be used in any view list in the system) have a filter with text ( this also should go for all the view list in system). and user management should have actions like change the role of user ( to admin or user), select multiple one of them and go to email composer so send them email this should be similar to the attendee page for the seminar make sure that the system is consistent. and wen openening one user, you should to to user detail page, which have all the user activity ( atteneded seminars, comments and so on)"

## Clarifications

### Session 2026-03-16

- Q: What is the permission hierarchy for role management? → A: Flattened Hierarchy: All users with 'admin' role can promote others to 'admin' or demote them. No 'super-admin' role is required.
- Q: How is the initial admin bootstrapped? → A: CLI/Script: A separate utility script is used to promote the first user UID to 'admin' in Firestore.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View All User Profiles (Priority: P1)

As an administrator, I want to see a paginated list of all registered user profiles so that I can oversee the platform's user base without being overwhelmed by data.

**Why this priority**: Essential for administrative oversight and the foundation for all other user profile management actions.

**Independent Test**: Can be tested by navigating to the "User Management" section and verifying that user profiles are displayed in paginated chunks.

**Acceptance Scenarios**:

1. **Given** I am logged in as an admin, **When** I navigate to the User Management dashboard, **Then** I see the first page of user profiles with fields: Display Name, Email, Role, and Seminar Attendance.
2. **Given** there are more than one page of users, **When** I click the "Next" pagination button, **Then** the list updates with the next set of users.

---

### User Story 2 - Filter User List (Priority: P2)

As an administrator, I want to filter the user list by name or email so that I can quickly find a specific user.

**Why this priority**: High value for large user bases; improves efficiency.

**Independent Test**: Can be tested by typing into the filter input and verifying the list updates in real-time.

**Acceptance Scenarios**:

1. **Given** the user list is loaded, **When** I type "John" into the search filter, **Then** only users with "John" in their display name or email are shown.

---

### User Story 3 - Manage User Roles (Priority: P2)

As an administrator, I want to change a user's role between 'User' and 'Admin' so that I can delegate administrative tasks or revoke privileges.

**Why this priority**: Critical for platform security and permissions management.

**Independent Test**: Can be tested by clicking a "Change Role" action on a user row and verifying the role update in the database/UI.

**Acceptance Scenarios**:

1. **Given** a user with role 'User', **When** I change their role to 'Admin', **Then** their role is updated and they receive admin permissions.
2. **Given** a user with role 'Admin', **When** I change their role to 'User', **Then** they lose admin privileges.

---

### User Story 4 - Multi-Select and Email (Priority: P3)

As an administrator, I want to select multiple users and send them an email collectively so that I can communicate important updates.

**Why this priority**: Facilitates communication; builds on existing email composer functionality.

**Independent Test**: Can be tested by checking boxes for multiple users, clicking "Send Email", and verifying the email composer opens with all selected emails.

**Acceptance Scenarios**:

1. **Given** multiple users in the list, **When** I select three users and click "Email Selected", **Then** I am redirected to the email composer with those three users as recipients.

---

### User Story 5 - User Profile Activity Detail (Priority: P2)

As an administrator, I want to click on a user profile to view their detailed activity history (seminar attendance history, comments posted) so that I can understand their engagement.

**Why this priority**: Provides deeper insights into user behavior and engagement.

**Independent Test**: Can be tested by clicking a user's name and verifying the detail page shows their specific seminar attendance and comments history.

**Acceptance Scenarios**:

1. **Given** I am in the user list, **When** I click on a user profile, **Then** I am taken to a detail page showing their full profile, a list of seminar attendance records they have, and a list of comments they've made.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a "User Management" route within the Admin Dashboard.
- **FR-002**: System MUST display user profiles in a paginated list (default 10-20 per page).
- **FR-003**: System MUST extract the pagination logic into a reusable `core/shared` component.
- **FR-004**: System MUST provide a text-based filter (search) for Name and Email.
- **FR-005**: System MUST extract the filter logic into a reusable `core/shared` component.
- **FR-006**: System MUST allow admins to toggle roles (Admin/User).
- **FR-007**: System MUST support multi-selection of user profiles via checkboxes.
- **FR-008**: System MUST integrate with the existing `Email Service` to pass multiple recipient addresses to the email composer.
- **FR-009**: System MUST provide a `User Profile Detail` view reachable from the user list.
- **FR-010**: The User Profile Detail view MUST show seminar attendance and comment history for the selected user profile.
- **FR-011**: User Detail view MUST include: Enrollment Date, Last Active Timestamp, and Preferred Topic Areas. [NEW]
- **FR-012**: System MUST display a "No Users Found" message when search or filter returns zero results. [NEW]
- **FR-013**: Role toggle functionality MUST be accessible to all users with the 'Admin' role. Initial admin bootstrapping MUST be handled via CLI/Script. [CLARIFIED: 2026-03-16]
- **FR-014**: Email "Email Selected" action MUST validate that at least one user is selected and enforce a maximum of 50 recipients per batch. [NEW]
- **FR-015**: System MUST prevent an Admin from changing their own role (self-demotion). [NEW]
- **FR-016**: The User Detail view MUST use skeleton screens during initial data fetch. [NEW]
- **FR-017**: All interactive elements MUST be keyboard-accessible and include ARIA labels. [NEW]
- **FR-018**: System MUST display specific error messages if only a part of the user activity fails to load. [NEW]

### Key Entities

- **User Profile**: Identity and profile data (UID, Display Name, Email, Role, Created At, Last Active, Preferred Topics).
- **Seminar Attendance**: Record of participation in a seminar (User Profile UID, Seminar UID, Date, Role during seminar).
- **User Activity**: Aggregated view of Seminar Attendances and Comments for a specific User Profile.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admin can filter through 1,000 user profiles and see results in under 500ms.
- **SC-002**: Role changes are persisted and reflected in the UI successfully in 100% of valid attempts.
- **SC-003**: The reusable pagination and filter components are successfully implemented in at least two different views (User Management and Attendees Page).
- **SC-004**: System successfully handles multi-selection of up to 50 user profiles for emailing with <100ms UI response time.
