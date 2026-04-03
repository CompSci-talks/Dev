# Quickstart: Testing Auth Flow Enhancements

## 1. Test Email Verification
1. Register a new user with a real (accessible) email.
2. Verify you are redirected to `/verify-email`.
3. Try to navigate to `/archive` or `/` — you should be redirected back to `/verify-email`.
4. Click "Resend Email". Verify it is sent and the button is disabled for 60 seconds (with countdown).
5. Open your email, click the link.
6. The app should automatically detect the verification (within 5s) and redirect you to Home.

## 2. Test Forgot Password
1. Navigate to `/login`.
2. Click "Forgot Password?".
3. Enter your email and submit. 
4. Verify notification shows "If an account exists, a link has been sent".
5. Open your email, click the link (it should lead to `compscitalks.com/auth/reset-password`).
6. Enter a new password and confirm it.
7. Click "Update Password".
8. Verify you are redirected to the Login page with a success message.
9. Log in with the **NEW** password.
