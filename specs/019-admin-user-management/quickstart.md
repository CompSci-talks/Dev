# Quickstart: Admin User Management

This guide helps you set up the development environment for the Admin User Management feature.

## 1. Initial Admin Bootstrap

To access any admin routes, your user account must have the `admin` role in Firestore.

```powershell
# In the project root
npm run script:promote-admin -- --uid YOUR_FIREBASE_UID
```

## 2. Running the Development Server

```powershell
npm start
```
Navigate to `http://localhost:4200/admin/user-management`.

## 3. Key Routes

- `/admin/user-management`: Main list view.
- `/admin/user-detail/:uid`: Activity and profile details.
- `/admin/email-composer`: Dedicated page for sending bulk emails.

## 4. Verification

Run the local BDD tests to ensure setup correctness:
```powershell
npx cucumber-js --tags "@admin-user-mgmt"
```
