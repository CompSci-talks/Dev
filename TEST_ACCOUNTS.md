# Test Accounts for Manual Testing

The following credentials can be used for manual testing with the mock authentication system.

> [!TIP]
> All mock accounts use the same password: **`password`**

## 1. Admin Account
- **Email**: `admin@example.com`
- **Role**: `admin`
- **Access**: Full access to the `/admin` dashboard (Semester Manager, Seminar Scheduling, Comment Moderation).

## 2. Regular User Account
- **Email**: `user@example.com`
- **Role**: `authenticated`
- **Access**: Access to personal dashboard and ability to leave comments.

---

## Technical Details

### Mock Logic
The `MockAuthService` assigns roles based on the email address:
- If the email contains the text **"admin"**, the user is granted the `admin` role.
- All other emails are assigned the `authenticated` role.
- New accounts can be created via the **Registration** page; they will be assigned the `authenticated` role by default.

### Session Persistence
The mock session is persisted in the browser's `localStorage` under the key `mock_user`. This ensures that your login session survives page reloads. To clear the session, you can use the **Logout** button or clear your application data in the browser developer tools.
