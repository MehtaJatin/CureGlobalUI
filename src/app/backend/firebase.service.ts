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
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  limit,
} from 'firebase/firestore';
import { book } from '../data-type';
import { Observable, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

// Hospital interface moved from admin.service.ts
export interface Hospital {
  id?: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  image?: string;
  images?: string[]; // Additional images for detailed view
  specialities: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  emergencyService? : Boolean;
  // Extended fields for detailed hospital view
  doctors?: {
    id: string;
    name: string;
    specialty: string;
    image: string;
    experience: string;
    qualification: string;
  }[];
  amenities?: {
    comfort_during_stay?: string[];
    food?: string[];
    language?: string[];
    money_matters?: string[];
    transportation?: string[];
    treatment_related?: string[];
  };
  centers_of_excellence?: any[];
  establishedYear?: number;
  totalBeds?: number;
  statistics?: {
    established: string;
    beds: string;
    doctors: string;
    departments: string;
  };
  accreditations?: string[];
}

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

  getServices(): Observable<any[]> {
    const serviceCollection = collection(this.firestore, 'services');
    return from(
      getDocs(serviceCollection).then((snapshot) => {
        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      })
    );
  }

  // ==================== HOSPITALS MANAGEMENT ====================

  // Get all hospitals
  getHospitals(): Observable<Hospital[]> {
    const hospitalCollection = collection(this.firestore, 'hospitals');

    return from(
      getDocs(hospitalCollection).then((snapshot) => {
        console.log('Firebase getHospitals - Raw snapshot size:', snapshot.size);
        const hospitals = snapshot.docs.map((doc) => {
          const data = doc.data();
          console.log('Hospital document data:', { id: doc.id, ...data });
          return {
            id: doc.id,
            ...data,
          } as Hospital;
        });
        console.log('Firebase getHospitals - Returning hospitals:', hospitals);
        return hospitals;
      })
      .catch((error) => {
        console.error('Firebase getHospitals - Error fetching hospitals:', error);
        // Try without orderBy in case that's the issue
        return getDocs(hospitalCollection).then((snapshot) => {
          console.log('Firebase getHospitals - Fallback fetch, snapshot size:', snapshot.size);
          return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Hospital[];
        });
      })
    );
  }

  // Get hospitals by specialty
  getHospitalsBySpecialty(specialty: string): Observable<Hospital[]> {
    const hospitalCollection = collection(this.firestore, 'hospitals');
    const q = query(
      hospitalCollection,
      where('specialties', 'array-contains', specialty),
      where('isActive', '==', true),
      orderBy('name')
    );
    return from(
      getDocs(q).then((snapshot) => {
        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Hospital[];
      })
    );
  }

  // Get hospital by document ID
  getHospitalByDocId(docId: string): Observable<Hospital | undefined> {
    const hospitalDoc = doc(this.firestore, 'hospitals', docId);
    return from(
      getDoc(hospitalDoc).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          return {
            id: docSnapshot.id,
            ...docSnapshot.data(),
          } as Hospital;
        } else {
          return undefined;
        }
      })
    );
  }

  // Get hospital by ID field (searches through all hospitals, with fallback to document ID)
  getHospitalById(hospitalId: string): Observable<Hospital | undefined> {
    // First, try to find by 'id' field
    const hospitalCollection = collection(this.firestore, 'hospitals');
    const q = query(
      hospitalCollection,
      where('id', '==', hospitalId),
      limit(1)
    );

    return from(
      getDocs(q).then((snapshot) => {
        if (snapshot.docs.length > 0) {
          const doc = snapshot.docs[0];
          return {
            id: doc.id,
            ...doc.data(),
          } as Hospital;
        } else {
          console.log(`Hospital not found by id field '${hospitalId}', trying document ID`);
          return null;
        }
      })
    ).pipe(
      switchMap(hospital => {
        if (hospital) {
          return of(hospital);
        }
        // Fallback: try to get by document ID
        console.log(`Attempting fallback search by document ID: ${hospitalId}`);
        return this.getHospitalByDocId(hospitalId);
      })
    );
  }

  getDoctors(): Observable<any[]> {
    const doctorsCollection = collection(this.firestore, 'doctors');
    return from(
      getDocs(doctorsCollection).then((snapshot) => {
        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      })
    );
  }

  // Get doctors by hospital ID
  getDoctorsByHospitalId(hospitalId: string): Observable<any[]> {
    const doctorsCollection = collection(this.firestore, 'doctors');
    const q = query(
      doctorsCollection,
      where('hospitals', 'array-contains', hospitalId),
      where('isActive', '==', true)
    );

    return from(
      getDocs(q).then((snapshot) =>
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      )
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

  // Get testimonials from Firebase
  getTestimonials(): Observable<any[]> {
    const testimonialsRef = collection(this.firestore, 'testimonials');

    return from(
      getDocs(testimonialsRef).then((snapshot) => {
        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      })
    );
  }

  // Add a new testimonial to Firebase
  addTestimonial(testimonial: any): Observable<{ success: boolean; id?: string; error?: any }> {
    const testimonialsRef = collection(this.firestore, 'testimonials');
    const testimonialData = {
      ...testimonial,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return from(
      addDoc(testimonialsRef, testimonialData)
        .then((docRef) => {
          console.log('Testimonial added with ID:', docRef.id);
          return { success: true, id: docRef.id };
        })
        .catch((error) => {
          console.error('Error adding testimonial:', error);
          return { success: false, error };
        })
    );
  }
}
