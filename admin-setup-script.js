// Admin Setup Script - Run this in browser console
// Make sure you're logged into Firebase Console

// Replace these values with your desired admin credentials
const adminEmail = "admin@yourdomain.com";
const adminPassword = "your-secure-password";
const adminName = "Admin User";

// Firebase configuration (replace with your config)
const firebaseConfig = {
  apiKey: "AIzaSyBZrsFPgwuDXZX9Goazd-BOY147CkbJIGA",
  authDomain: "medical-ad035.firebaseapp.com",
  projectId: "medical-ad035",
  storageBucket: "medical-ad035.firebasestorage.app",
  messagingSenderId: "405108743884",
  appId: "1:405108743884:web:51b9f70c80d4768a15ec69",
  measurementId: "G-JRP3PJJ3FP",
};

// Initialize Firebase (if not already initialized)
if (!window.firebase) {
  console.log("Firebase not found. Please make sure Firebase is loaded.");
} else {
  // Create admin user
  firebase
    .auth()
    .createUserWithEmailAndPassword(adminEmail, adminPassword)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User created successfully:", user.uid);

      // Create user document in Firestore
      return firebase.firestore().collection("users").doc(user.uid).set({
        uid: user.uid,
        email: adminEmail,
        displayName: adminName,
        role: "admin",
        createdAt: new Date(),
      });
    })
    .then(() => {
      console.log("Admin user setup complete!");
      console.log("Email:", adminEmail);
      console.log("Password:", adminPassword);
      console.log("Role: admin");
    })
    .catch((error) => {
      console.error("Error creating admin user:", error);
    });
}
