import { Component, OnInit, HostListener } from '@angular/core';
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
  
  // Photo gallery properties
  lightboxOpen = false;
  currentImageIndex = 0;
  
  // Services mapping for specialties
  servicesMap: Map<string, string> = new Map();

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
    
    // Preload services for specialty mapping
    this.loadServices();
    
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
          // Set the first available amenity tab as selected
          const availableTabs = this.getAmenityTabs();
          if (availableTabs.length > 0 && !availableTabs.find(tab => tab.key === this.selectedTab)) {
            this.selectedTab = availableTabs[0].key;
          }
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
  private readonly doctorPlaceholder =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#e9f2f7"/>
          <stop offset="100%" stop-color="#d7e7f0"/>
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="60" fill="url(#g)"/>
      <g fill="#8aa3b5">
        <circle cx="60" cy="45" r="15"/>
        <path d="M30 90 Q60 70 90 90" fill="#cfe0ea"/>
      </g>
      <text x="50%" y="110" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#5a7487">Doctor</text>
    </svg>
  `);

  private mapFirebaseHospitalToTemplate(firebaseHospital: FirebaseHospital, doctorsData: any[]): Hospital {
    // Map FirebaseService Hospital interface to template Hospital interface
    // Convert doctors data from Firestore format to template format
    const mappedDoctors = doctorsData.map(doctor => {
      // Use image directly from Firestore as it's already in the correct data URI format
      const imageUrl = doctor.imageBase64 || this.doctorPlaceholder;

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
        comfort_during_stay: [],
        food: [],
        language: [],
        money_matters: [],
        transportation: [],
        treatment_related: []
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
    // Handle image loading errors by hiding the image and showing placeholder
    console.log('Image loading error, hiding image');
    event.target.style.display = 'none';
    // The placeholder will be shown via the *ngIf condition
  }

  hasValidImage(imageUrl: any): boolean {
    const isValid = imageUrl && 
           imageUrl !== '' && 
           imageUrl !== 'null' && 
           imageUrl !== null && 
           imageUrl !== undefined &&
           typeof imageUrl === 'string' &&
           imageUrl.trim() !== '';
    
    console.log('Image URL:', imageUrl, 'Is Valid:', isValid);
    return isValid;
  }

  get whatsappLink(): string {
    return this.whatsAppService.getWhatsAppLink();
  }

  get hasMultipleImages(): boolean {
    return !!(this.hospital?.images && this.hospital.images.length > 1);
  }

  get currentImageSrc(): string {
    return this.hospital?.images?.[this.currentImageIndex] || '';
  }

  get totalImages(): number {
    return this.hospital?.images?.length || 0;
  }

  // Photo gallery methods
  openLightbox(index: number): void {
    this.currentImageIndex = index;
    this.lightboxOpen = true;
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
    // Restore body scroll
    document.body.style.overflow = 'auto';
  }

  nextImage(): void {
    if (this.hospital?.images && this.hospital.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.hospital.images.length;
    }
  }

  previousImage(): void {
    if (this.hospital?.images && this.hospital.images.length > 0) {
      this.currentImageIndex = this.currentImageIndex === 0 
        ? this.hospital.images.length - 1 
        : this.currentImageIndex - 1;
    }
  }
  private loadServices(): void {
    this.firebaseService.getServices().subscribe({
      next: (services) => {
        // Create a map of service ID to service name
        services.forEach(service => {
          this.servicesMap.set(service.id, service.name);
        });
      },
      error: (error) => {
        console.error('Error loading services:', error);
      }
    });
  }

  getSpecialityNameById(speciality: any): string {
    if (!speciality) return 'Unknown Specialty';
    
    // Check if we have the service name in our map
    const serviceName = this.servicesMap.get(speciality);
    return serviceName || speciality; // Return service name if found, otherwise return the ID
  }

  getAmenityTabs(): { key: string; label: string }[] {
    if (!this.hospital?.amenities) return [];

    // Create tabs dynamically from the actual amenities object keys
    return Object.keys(this.hospital.amenities)
      .filter(key => {
        const amenities = this.hospital?.amenities?.[key as keyof typeof this.hospital.amenities];
        return amenities && Array.isArray(amenities) && amenities.length > 0;
      })
      .map(key => ({
        key: key,
        label: this.formatAmenityLabel(key)
      }));
  }

  private formatAmenityLabel(key: string): string {
    // Convert snake_case or camelCase to Title Case
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  getAmenitiesForTab(tabKey: string): string[] {
    if (!this.hospital?.amenities) return [];
    
    const amenities = this.hospital.amenities[tabKey as keyof typeof this.hospital.amenities];
    return Array.isArray(amenities) ? amenities : [];
  }

  // Handle keyboard navigation
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.lightboxOpen) return;
    
    switch (event.key) {
      case 'Escape':
        this.closeLightbox();
        break;
      case 'ArrowLeft':
        this.previousImage();
        break;
      case 'ArrowRight':
        this.nextImage();
        break;
    }
  }
}
