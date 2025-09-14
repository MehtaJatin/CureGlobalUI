import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Hospital } from '../models/hospital-specialty.model';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  private mockHospital: any = {
    id: '123',
    name: 'Apollo Hospitals',
    address: '21, Greams Lane, Off Greams Road, Chennai, Tamil Nadu 600006',
    images: [
      'assets/images/blog/blog1.jpg',
      'assets/images/blog/blog2.jpg',
      'assets/images/blog/blog3.jpg'
    ],
    description: 'Apollo Hospitals is one of India\'s leading healthcare providers, known for its world-class medical facilities, cutting-edge technology, and highly skilled medical professionals. We provide comprehensive healthcare services across various specialties.',
    phone: '+91-44-2829-3333',
    email: 'info@apollohospitals.com',
    website: 'https://www.apollohospitals.com',
    specialties: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Gastroenterology'],
    doctors: [
      {
        id: '1',
        name: 'Dr. Prathap C Reddy',
        specialty: 'Cardiology',
        image: 'assets/images/service/service1.jpg',
        experience: '25 years',
        qualification: 'MD, DM (Cardiology)'
      },
      {
        id: '2',
        name: 'Dr. Sita Reddy',
        specialty: 'Neurology',
        image: 'assets/images/service/service2.jpg',
        experience: '20 years',
        qualification: 'MD, DM (Neurology)'
      },
      {
        id: '3',
        name: 'Dr. Rajesh Kumar',
        specialty: 'Orthopedics',
        image: 'assets/images/service/service3.jpg',
        experience: '18 years',
        qualification: 'MS (Orthopedics)'
      },
      {
        id: '4',
        name: 'Dr. Anita Sharma',
        specialty: 'Oncology',
        image: 'assets/images/service/service4.jpg',
        experience: '22 years',
        qualification: 'MD, DM (Oncology)'
      },
      {
        id: '5',
        name: 'Dr. Vikram Singh',
        specialty: 'Gastroenterology',
        image: 'assets/images/service/service5.jpg',
        experience: '15 years',
        qualification: 'MD, DM (Gastroenterology)'
      },
      {
        id: '6',
        name: 'Dr. Meera Patel',
        specialty: 'Pediatrics',
        image: 'assets/images/service/service6.jpg',
        experience: '12 years',
        qualification: 'MD (Pediatrics)'
      }
    ],
    amenities: {
      comfort_during_stay: ['Private Rooms', 'Wi-Fi', 'TV', 'Air Conditioning'],
      food: ['Multi-cuisine Restaurant', 'Room Service', 'Special Diet Options'],
      language: ['English', 'Hindi', 'Tamil', 'Telugu'],
      money_matters: ['Insurance Accepted', 'EMI Options', 'Cashless Treatment'],
      transportation: ['Ambulance Service', 'Parking Facility', 'Airport Pickup'],
      treatment_related: ['24/7 Emergency', 'ICU', 'Operation Theatre', 'Lab Services']
    },
    statistics: {
      established: '1983',
      beds: '500+',
      doctors: '200+',
      departments: '40+'
    },
    accreditations: ['JCI', 'NABH', 'ISO 9001:2015']
  };

  constructor() {}

  /**
   * Get hospital by ID (mock data)
   * @param hospitalId The hospital document ID
   */
  getHospitalById(hospitalId: string): Observable<Hospital | null> {
    console.log('HospitalService: Getting hospital with ID:', hospitalId);
    // Return mock data for any ID
    return of(this.mockHospital);
  }

  /**
   * Get all hospitals (mock data)
   */
  getAllHospitals(): Observable<Hospital[]> {
    return of([this.mockHospital]);
  }

  /**
   * Get hospitals by specialty (mock data)
   * @param specialty The specialty to filter by
   */
  getHospitalsBySpecialty(specialty: string): Observable<Hospital[]> {
    return of([this.mockHospital]);
  }
}