import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { book } from '../data-type';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private firestore: any;

  constructor() {
    // Initialize Firebase
    const firebaseConfig = {
      apiKey: 'AIzaSyBZrsFPgwuDXZX9Goazd-BOY147CkbJIGA',
      authDomain: 'medical-ad035.firebaseapp.com',
      projectId: 'medical-ad035',
      storageBucket: 'medical-ad035.firebasestorage.app',
      messagingSenderId: '405108743884',
      appId: '1:405108743884:web:51b9f70c80d4768a15ec69',
      measurementId: 'G-JRP3PJJ3FP',
    };

    const app = initializeApp(firebaseConfig);
    this.firestore = getFirestore(app);
  }

  // Add a new booking to Firestore
  async addBooking(bookingData: book): Promise<any> {
    try {
      const bookingCollection = collection(this.firestore, 'bookings');
      const bookingWithTimestamp = {
        ...bookingData,
        createdAt: Timestamp.now(),
        status: 'pending',
      };

      const docRef = await addDoc(bookingCollection, bookingWithTimestamp);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error adding booking: ', error);
      return { success: false, error: error };
    }
  }

  // Get all bookings
  getBookings(): Observable<any[]> {
    const bookingCollection = collection(this.firestore, 'bookings');
    return from(
      getDocs(bookingCollection).then((snapshot) => {
        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      })
    );
  }

  // Get bookings by email
  getBookingsByEmail(email: string): Observable<any[]> {
    const bookingCollection = collection(this.firestore, 'bookings');
    const q = query(
      bookingCollection,
      where('email', '==', email),
      orderBy('createdAt', 'desc')
    );
    return from(
      getDocs(q).then((snapshot) => {
        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      })
    );
  }
}
