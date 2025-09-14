import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

export interface Service {
  id?: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Hospital {
  id?: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  image?: string;
  specialties: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Doctor {
  id?: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  hospitalId: string;
  hospitalName: string;
  experience: number; // in years
  education: string;
  description: string;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private firestore: AngularFirestore) { }

  // ==================== SERVICES MANAGEMENT ====================

  // Get all services
  getServices(): Observable<Service[]> {
    return this.firestore.collection<Service>('services', ref =>
      ref.orderBy('createdAt', 'desc')
    ).valueChanges({ idField: 'id' });
  }

  // Get active services
  getActiveServices(): Observable<Service[]> {
    return this.firestore.collection<Service>('services', ref =>
      ref.where('isActive', '==', true).orderBy('name')
    ).valueChanges({ idField: 'id' });
  }

  // Add new service
  async addService(service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const serviceData: Service = {
      ...service,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await this.firestore.collection('services').add(serviceData);
    return docRef.id;
  }

  // Update service
  async updateService(id: string, service: Partial<Service>): Promise<void> {
    const updateData = {
      ...service,
      updatedAt: new Date()
    };

    await this.firestore.doc(`services/${id}`).update(updateData);
  }

  // Delete service
  async deleteService(id: string): Promise<void> {
    await this.firestore.doc(`services/${id}`).delete();
  }

  // Toggle service status
  async toggleServiceStatus(id: string, isActive: boolean): Promise<void> {
    await this.firestore.doc(`services/${id}`).update({
      isActive,
      updatedAt: new Date()
    });
  }

  // ==================== HOSPITALS MANAGEMENT ====================

  // Get all hospitals
  getHospitals(): Observable<Hospital[]> {
    return this.firestore.collection<Hospital>('hospitals', ref =>
      ref.orderBy('createdAt', 'desc')
    ).valueChanges({ idField: 'id' });
  }

  // Get active hospitals
  getActiveHospitals(): Observable<Hospital[]> {
    return this.firestore.collection<Hospital>('hospitals', ref =>
      ref.where('isActive', '==', true).orderBy('name')
    ).valueChanges({ idField: 'id' });
  }

  // Add new hospital
  async addHospital(hospital: Omit<Hospital, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const hospitalData: Hospital = {
      ...hospital,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await this.firestore.collection('hospitals').add(hospitalData);
    return docRef.id;
  }

  // Update hospital
  async updateHospital(id: string, hospital: Partial<Hospital>): Promise<void> {
    const updateData = {
      ...hospital,
      updatedAt: new Date()
    };

    await this.firestore.doc(`hospitals/${id}`).update(updateData);
  }

  // Delete hospital
  async deleteAdminHospital(id: string): Promise<void> {
    await this.firestore.doc(`hospitals/${id}`).delete();
  }

  // Toggle hospital status
  async toggleAdminHospitalStatus(id: string, isActive: boolean): Promise<void> {
    await this.firestore.doc(`hospitals/${id}`).update({
      isActive,
      updatedAt: new Date()
    });
  }

  // ==================== DOCTORS MANAGEMENT ====================

  // Get all doctors
  getDoctors(): Observable<Doctor[]> {
    return this.firestore.collection<Doctor>('doctors', ref =>
      ref.orderBy('createdAt', 'desc')
    ).valueChanges({ idField: 'id' });
  }

  // Get active doctors
  getActiveDoctors(): Observable<Doctor[]> {
    return this.firestore.collection<Doctor>('doctors', ref =>
      ref.where('isActive', '==', true).orderBy('name')
    ).valueChanges({ idField: 'id' });
  }

  // Get doctors by hospital
  getDoctorsByAdminHospital(hospitalId: string): Observable<Doctor[]> {
    return this.firestore.collection<Doctor>('doctors', ref =>
      ref.where('hospitalId', '==', hospitalId).where('isActive', '==', true)
    ).valueChanges({ idField: 'id' });
  }

  // Add new doctor
  async addDoctor(doctor: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const doctorData: Doctor = {
      ...doctor,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await this.firestore.collection('doctors').add(doctorData);
    return docRef.id;
  }

  // Update doctor
  async updateDoctor(id: string, doctor: Partial<Doctor>): Promise<void> {
    const updateData = {
      ...doctor,
      updatedAt: new Date()
    };

    await this.firestore.doc(`doctors/${id}`).update(updateData);
  }

  // Delete doctor
  async deleteDoctor(id: string): Promise<void> {
    await this.firestore.doc(`doctors/${id}`).delete();
  }

  // Toggle doctor status
  async toggleDoctorStatus(id: string, isActive: boolean): Promise<void> {
    await this.firestore.doc(`doctors/${id}`).update({
      isActive,
      updatedAt: new Date()
    });
  }

  // ==================== STATISTICS ====================

  // Get dashboard statistics
  async getDashboardStats(): Promise<any> {
    const servicesCount = await this.firestore.collection('services').get().toPromise();
    const hospitalsCount = await this.firestore.collection('hospitals').get().toPromise();
    const doctorsCount = await this.firestore.collection('doctors').get().toPromise();
    const bookingsCount = await this.firestore.collection('bookings').get().toPromise();

    return {
      totalServices: servicesCount?.size || 0,
      totalAdminHospitals: hospitalsCount?.size || 0,
      totalDoctors: doctorsCount?.size || 0,
      totalBookings: bookingsCount?.size || 0
    };
  }
}
