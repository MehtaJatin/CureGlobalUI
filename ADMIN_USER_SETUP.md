# Admin User Setup Guide

## 🎯 Overview

This guide explains how to create admin users in Firebase since the Firebase Console doesn't have a direct "admin role" option.

## 🔧 Method 1: Manual Setup (Recommended for First Admin)

### Step 1: Create User in Firebase Console

1. Go to **Firebase Console** → **Authentication** → **Users**
2. Click **"Add User"**
3. Enter:
   - **Email**: `admin@medical.com`
   - **Password**: `admin123456` (or your preferred password)
4. Click **"Add user"**

### Step 2: Get User UID

1. After creating the user, click on the user in the list
2. Copy the **User UID** (long string like `abc123def456...`)

### Step 3: Create User Document in Firestore

1. Go to **Firestore Database**
2. Click **"Start collection"** (if `users` collection doesn't exist)
3. **Collection ID**: `users`
4. **Document ID**: Paste the User UID you copied
5. Add these fields:

```json
{
  "uid": "YOUR_USER_UID_HERE",
  "email": "admin@medical.com",
  "displayName": "Medical Admin",
  "role": "admin",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

## 🔧 Method 2: Using the Angular App (Easiest)

### Step 1: Add Route

Add this route to your `app-routing.module.ts`:

```typescript
{ path: 'create-admin', component: CreateAdminComponent }
```

### Step 2: Access the Page

1. Start your Angular app: `ng serve`
2. Go to: `http://localhost:4200/create-admin`
3. Fill in the admin details:
   - **Display Name**: Medical Admin
   - **Email**: admin@medical.com
   - **Password**: admin123456
4. Click **"Create Admin User"**

### Step 3: Remove the Route (Security)

After creating the admin user, remove the route from `app-routing.module.ts` for security.

## 🔧 Method 3: Using Node.js Script

### Step 1: Install Dependencies

```bash
npm install firebase
```

### Step 2: Run the Script

```bash
node create-admin-user.js
```

### Step 3: Customize (Optional)

Edit `create-admin-user.js` to change the admin credentials:

```javascript
const adminEmail = "your-admin@email.com";
const adminPassword = "your-password";
const adminDisplayName = "Your Admin Name";
```

## 🔧 Method 4: Using Firebase CLI

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

### Step 3: Create User

```bash
firebase auth:create-user --email admin@medical.com --password admin123456
```

### Step 4: Get UID and Create Document

Follow Method 1 (Steps 2-3) to create the Firestore document.

## 🔍 Verify Admin User Creation

### Check Authentication

1. Go to **Firebase Console** → **Authentication** → **Users**
2. Verify your admin user is listed

### Check Firestore

1. Go to **Firestore Database** → **users** collection
2. Find your user document
3. Verify the `role` field is set to `"admin"`

### Test Login

1. Go to your app's login page
2. Login with admin credentials
3. Navigate to `/admin`
4. Verify you can access the admin dashboard

## 🔐 Security Best Practices

### 1. Strong Passwords

- Use at least 8 characters
- Include uppercase, lowercase, numbers, and symbols
- Example: `Admin@Medical2024!`

### 2. Remove Admin Creation Routes

- Remove `/create-admin` route after creating admin
- Remove the CreateAdminComponent from production

### 3. Limit Admin Access

- Only give admin role to trusted users
- Regularly review admin users
- Use different admin accounts for different purposes

### 4. Monitor Admin Actions

- Set up Firebase Analytics
- Monitor admin login patterns
- Log admin actions for audit trails

## 🚨 Troubleshooting

### "User not found" Error

- Check if user exists in Authentication
- Verify the UID is correct
- Ensure user document exists in Firestore

### "Permission denied" Error

- Check Firestore security rules
- Verify user has admin role
- Ensure user is authenticated

### "Role not admin" Error

- Check the `role` field in Firestore
- Verify it's exactly `"admin"` (lowercase)
- Check for typos in the role field

## 📋 Admin User Checklist

- [ ] User created in Firebase Authentication
- [ ] User document created in Firestore `users` collection
- [ ] `role` field set to `"admin"`
- [ ] Can login with admin credentials
- [ ] Can access `/admin` route
- [ ] Can view admin dashboard
- [ ] Can manage services
- [ ] Admin creation routes removed (for security)

## 🔄 Creating Additional Admin Users

### For Additional Admins:

1. Use Method 1 (Manual Setup) for each new admin
2. Or use Method 2 (Angular App) temporarily
3. Always verify the admin role is set correctly
4. Remove admin creation routes after setup

### For Regular Users:

- Regular users will get `"user"` role by default
- They can register normally through your app
- They won't have access to admin features

## 📞 Support

If you encounter issues:

1. Check Firebase Console for user status
2. Verify Firestore document structure
3. Check browser console for errors
4. Ensure Firebase configuration is correct
5. Verify security rules allow admin access

---

**Happy Admin Setup! 🎉**
