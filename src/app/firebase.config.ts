import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBZrsFPgwuDXZX9Goazd-BOY147CkbJIGA',
  authDomain: 'medical-ad035.firebaseapp.com',
  projectId: 'medical-ad035',
  storageBucket: 'medical-ad035.firebasestorage.app',
  messagingSenderId: '405108743884',
  appId: '1:405108743884:web:51b9f70c80d4768a15ec69',
  measurementId: 'G-JRP3PJJ3FP',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
