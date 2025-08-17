// Create Admin User Script
// Run this script to create an admin user

const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");
const { getFirestore, doc, setDoc } = require("firebase/firestore");

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZrsFPgwuDXZX9Goazd-BOY147CkbJIGA",
  authDomain: "medical-ad035.firebaseapp.com",
  projectId: "medical-ad035",
  storageBucket: "medical-ad035.firebasestorage.app",
  messagingSenderId: "405108743884",
  appId: "1:405108743884:web:51b9f70c80d4768a15ec69",
  measurementId: "G-JRP3PJJ3FP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdminUser(email, password, displayName) {
  try {
    console.log("Creating admin user...");

    // Create user in Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    console.log("User created in Authentication:", user.uid);

    // Create user document in Firestore
    const userData = {
      uid: user.uid,
      email: email,
      displayName: displayName,
      role: "admin",
      createdAt: new Date(),
    };

    await setDoc(doc(db, "users", user.uid), userData);

    console.log("✅ Admin user created successfully!");
    console.log("User UID:", user.uid);
    console.log("Email:", email);
    console.log("Role: admin");

    return user.uid;
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
    throw error;
  }
}

// Usage example
// Replace with your desired admin credentials
const adminEmail = "admin@medical.com";
const adminPassword = "admin123456";
const adminDisplayName = "Medical Admin";

createAdminUser(adminEmail, adminPassword, adminDisplayName)
  .then(() => {
    console.log("🎉 Admin user setup complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to create admin user:", error);
    process.exit(1);
  });
