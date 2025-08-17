# Firebase Authentication & Admin Panel Setup Guide

## 🎯 Overview

This guide will help you set up Firebase Authentication and create an admin panel to manage services, hospitals, and doctors in your Medical App.

## 📋 Prerequisites

1. **Firebase Project**: Your existing project (medical-ad035)
2. **Angular App**: Your current medical app
3. **Firebase CLI**: Installed and configured

## 🚀 Step-by-Step Setup

### Step 1: Install Firebase Dependencies

```bash
# Install Firebase and Angular Fire
npm install firebase @angular/fire

# Install additional dependencies
npm install @angular/fire/compat
```

### Step 2: Configure Firebase Authentication

1. **Go to Firebase Console**:
   - Visit: https://console.firebase.google.com/project/medical-ad035/
   - Navigate to **Authentication** → **Sign-in method**

2. **Enable Email/Password Authentication**:
   - Click on "Email/Password"
   - Enable "Email/Password" provider
   - Click "Save"

3. **Set up Firestore Security Rules**:
   - Go to **Firestore Database** → **Rules**
   - Update rules to allow authenticated access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all users
    match /{document=**} {
      allow read: if true;
    }
    
    // Allow write access to authenticated users
    match /bookings/{document} {
      allow write: if request.auth != null;
    }
    
    // Allow admin access to services, hospitals, doctors
    match /services/{document} {
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /hospitals/{document} {
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /doctors/{document} {
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Allow users to read their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Step 3: Update App Module

Add Firebase modules to your `app.module.ts`:

```typescript
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';

@NgModule({
  // ... other configurations
  imports: [
    // ... existing imports
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
  ],
  // ... rest of the module
})
```

### Step 4: Create Admin User

1. **Create the first admin user**:
   - Use the AuthService to create an admin user
   - Or manually create in Firebase Console

2. **Set up admin user in Firestore**:
   - Go to **Firestore Database**
   - Create a collection called `users`
   - Add a document with your user ID
   - Set the role field to "admin"

### Step 5: Add Routes

Add admin routes to your `app-routing.module.ts`:

```typescript
const routes: Routes = [
  // ... existing routes
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'admin/services', component: AdminServicesComponent },
  { path: 'admin/hospitals', component: AdminHospitalsComponent },
  { path: 'admin/doctors', component: AdminDoctorsComponent },
  { path: 'admin/bookings', component: AdminBookingsComponent },
];
```

## 🔧 Features Implemented

### 1. **Firebase Authentication**
- ✅ User registration and login
- ✅ Role-based access control (admin/user)
- ✅ Secure authentication flow
- ✅ User session management

### 2. **Admin Dashboard**
- ✅ Statistics overview
- ✅ Navigation to management sections
- ✅ User authentication status
- ✅ Responsive design

### 3. **Services Management**
- ✅ Add new medical services
- ✅ Edit existing services
- ✅ Delete services
- ✅ Toggle service status
- ✅ Category management
- ✅ Price and duration settings

### 4. **Admin Services**
- ✅ AuthService: User authentication
- ✅ AdminService: CRUD operations for services, hospitals, doctors
- ✅ Role-based access control
- ✅ Firestore integration

## 📱 Admin Panel Features

### Dashboard Statistics:
- Total Services
- Total Hospitals
- Total Doctors
- Total Bookings

### Management Sections:
1. **Services Management**:
   - Add/Edit/Delete services
   - Set prices and durations
   - Manage categories
   - Toggle active status

2. **Hospitals Management** (to be implemented):
   - Add/Edit/Delete hospitals
   - Manage hospital details
   - Set specialties

3. **Doctors Management** (to be implemented):
   - Add/Edit/Delete doctors
   - Assign to hospitals
   - Manage specializations

4. **Bookings Management** (to be implemented):
   - View all bookings
   - Update booking status
   - Filter and search

## 🔐 Security Features

1. **Authentication Required**: All admin functions require login
2. **Role-Based Access**: Only admin users can access management features
3. **Firestore Security Rules**: Server-side validation
4. **Session Management**: Automatic logout on session expiry

## 🧪 Testing

### Test Authentication:
1. **Register a new user**:
   - Go to `/register`
   - Create account with email/password
   - Verify user role is "user" by default

2. **Create admin user**:
   - Use AuthService.createAdminUser()
   - Or manually update user role in Firestore

3. **Test admin access**:
   - Login with admin credentials
   - Navigate to `/admin`
   - Verify dashboard loads

### Test Services Management:
1. **Add a service**:
   - Go to `/admin/services`
   - Click "Add Service"
   - Fill form and submit
   - Verify service appears in list

2. **Edit a service**:
   - Click edit button on any service
   - Modify details
   - Save changes
   - Verify updates

3. **Delete a service**:
   - Click delete button
   - Confirm deletion
   - Verify service removed

## 🚀 Production Deployment

### Environment Variables:
```typescript
// environment.prod.ts
export const environment = {
  production: true,
  firebase: {
    // Your production Firebase config
  }
};
```

### Security Checklist:
- [ ] Enable Firebase Authentication
- [ ] Set up Firestore security rules
- [ ] Configure admin users
- [ ] Test all CRUD operations
- [ ] Verify role-based access
- [ ] Set up proper error handling

## 📞 Support

If you encounter issues:
1. Check Firebase Console for authentication status
2. Verify Firestore security rules
3. Check browser console for errors
4. Ensure admin user role is set correctly
5. Verify Firebase configuration

## 🔄 Next Steps

1. **Complete Hospital Management**:
   - Create AdminHospitalsComponent
   - Add hospital CRUD operations
   - Implement hospital listing

2. **Complete Doctor Management**:
   - Create AdminDoctorsComponent
   - Add doctor CRUD operations
   - Link doctors to hospitals

3. **Complete Booking Management**:
   - Create AdminBookingsComponent
   - Add booking status management
   - Implement booking filters

4. **Enhanced Features**:
   - Image upload for services/hospitals/doctors
   - Advanced search and filtering
   - Export functionality
   - Analytics dashboard

---

**Happy Admin Panel Development! 🎉**
