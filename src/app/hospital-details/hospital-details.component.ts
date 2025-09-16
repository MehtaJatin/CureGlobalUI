import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService, Hospital as FirebaseHospital } from '../backend/firebase.service';
import { WhatsAppService } from '../backend/whatsapp.service';
import { Hospital } from '../models/hospital-specialty.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-hospital-details',
  templateUrl: './hospital-details.component.html',
  styleUrls: ['./hospital-details.component.scss']
})
export class HospitalDetailsComponent implements OnInit {
  hospital: Hospital | null = null;
  loading = true;
  selectedTab = 'comfort';
  notFound = false;
  Math = Math; // Make Math available in template

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebaseService: FirebaseService,
    private whatsAppService: WhatsAppService
  ) {
    console.log('HospitalDetailsComponent constructor called');
  }

  ngOnInit(): void {
    console.log('HospitalDetailsComponent ngOnInit called');
    this.route.params.subscribe(params => {
      console.log('Route params:', params);
      const hospitalId = params['id'];
      console.log('Hospital ID from route:', hospitalId);
      if (hospitalId) {
        this.loadHospitalDetails(hospitalId);
      } else {
        console.log('No hospital ID found in route params');
      }
    });
  }

  private loadHospitalDetails(hospitalId: string): void {
    this.loading = true;
    this.notFound = false;

    console.log('Loading hospital with ID:', hospitalId);

    // Fetch hospital data and doctors data concurrently
    forkJoin({
      hospital: this.firebaseService.getHospitalById(hospitalId),
      doctors: this.firebaseService.getDoctorsByHospitalId(hospitalId)
    }).subscribe({
      next: (result) => {
        console.log('Hospital data received from FirebaseService:', result.hospital);
        console.log('Doctors data received from FirebaseService:', result.doctors);

        if (result.hospital) {
          // Map FirebaseService Hospital to template Hospital interface
          this.hospital = this.mapFirebaseHospitalToTemplate(result.hospital, result.doctors);
          this.loading = false;
        } else {
          // Hospital not found - show not found message instead of redirecting
          console.log('Hospital not found with ID:', hospitalId);
          this.loading = false;
          this.notFound = true;
        }
      },
      error: (error) => {
        console.error('Error loading hospital details:', error);
        this.loading = false;
        this.notFound = true;
      }
    });
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  private mapFirebaseHospitalToTemplate(firebaseHospital: FirebaseHospital, doctorsData: any[]): Hospital {
    // Map FirebaseService Hospital interface to template Hospital interface
    // Convert doctors data from Firestore format to template format
    const mappedDoctors = doctorsData.map(doctor => {
      // Use image directly from Firestore as it's already in the correct data URI format
      const imageUrl = doctor.imageBase64 || 'assets/images/service/service1.jpg';

      return {
        id: doctor.id,
        name: doctor.name,
        specialty: doctor.specialization || doctor.specialty || 'General Medicine',
        image: imageUrl,
        experience: doctor.experience ? `${doctor.experience} years` : 'N/A',
        qualification: doctor.education || doctor.qualification || 'MD'
      };
    });

    return {
      id: firebaseHospital.id,
      name: firebaseHospital.name,
      address: firebaseHospital.address,
      phone: firebaseHospital.phone,
      email: firebaseHospital.email,
      description: firebaseHospital.description,
      specialties: firebaseHospital.specialities,
      // Add mock/default data for fields that don't exist in FirebaseService but are needed by template
      images: firebaseHospital.images || [firebaseHospital.image || 'assets/images/blog/blog1.jpg'],
      doctors: mappedDoctors,
      amenities: firebaseHospital.amenities || {
        comfort_during_stay: ['Private Rooms', 'Wi-Fi', 'TV', 'AC'],
        food: ['Restaurant', 'Room Service'],
        language: ['English', 'Hindi'],
        money_matters: ['Insurance Accepted', 'EMI Options'],
        transportation: ['Parking', 'Ambulance'],
        treatment_related: ['24/7 Emergency', 'ICU', 'Lab']
      },
      centers_of_excellence: firebaseHospital.centers_of_excellence || ['Cardiac Care', 'Neurosciences'],
      establishedYear: firebaseHospital.establishedYear || new Date(firebaseHospital.createdAt).getFullYear(),
      totalBeds: firebaseHospital.totalBeds || 200,
      statistics: firebaseHospital.statistics || {
        established: firebaseHospital.establishedYear?.toString() || new Date(firebaseHospital.createdAt).getFullYear().toString(),
        beds: firebaseHospital.totalBeds?.toString() || '200+',
        doctors: '100+',
        departments: '25+'
      },
      accreditations: firebaseHospital.accreditations || ['NABH', 'JCI']
    } as Hospital;
  }

  onSubmitContactForm(formData: any): void {
    // Handle contact form submission
    console.log('Contact form submitted:', formData);
  }

  onImageError(event: any): void {
    // Handle image loading errors by setting a fallback image
    console.log('Image loading error, setting fallback image');
    event.target.src = 'assets/images/service/service1.jpg';
  }

  get whatsappLink(): string {
    return this.whatsAppService.getWhatsAppLink();
  }
}
