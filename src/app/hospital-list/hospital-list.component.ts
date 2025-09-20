import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { hospital } from '../data-type';
import { FirebaseService, Hospital as FirebaseHospital } from '../backend/firebase.service';
import { WhatsAppService } from '../backend/whatsapp.service';

@Component({
  selector: 'app-hospital-list',
  templateUrl: './hospital-list.component.html',
  styleUrls: ['./hospital-list.component.scss']
})
export class HospitalListComponent implements OnInit, OnDestroy {
  hospitals: hospital[] = [];
  filteredHospitals: hospital[] = [];
  searchTerm = '';
  selectedCity = '';
  selectedSpecialty = '';
  selectedService = '';
  sortBy: 'name' | 'rating' | 'bedCount' | 'establishedYear' = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  loading = true;
  error = '';


  // Available filter options
  cities: string[] = [];
  specialties: any[] = [];

  private routeSubscription: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebaseService: FirebaseService,
    private whatsAppService: WhatsAppService
  ) {}

  ngOnInit(): void {
    this.initializeHospitals();
    this.setupRouteSubscription();
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  getSpeicalityNameById(id: string): string {
    const matched = (this.specialties || []).find((spec: any) => spec && spec.id == id);
    return matched?.name || id;
  }

  public initializeHospitals(): void {
    this.loading = true;
    this.error = '';

    this.firebaseService.getHospitals().subscribe({
      next: (firebaseHospitals) => {
        console.log('Fetched hospitals from Firebase:', firebaseHospitals);
        console.log('Number of hospitals fetched:', firebaseHospitals.length);

        // Debug: Check isActive status
        firebaseHospitals.forEach((hospital, index) => {
          console.log(`Hospital ${index}:`, {
            name: hospital.name,
            isActive: hospital.isActive,
            hasRequiredFields: !!(hospital.name && hospital.address)
          });
        });

        this.hospitals = this.mapFirebaseHospitalsToLocal(firebaseHospitals);
        console.log('Mapped hospitals:', this.hospitals);
        console.log('Number of mapped hospitals:', this.hospitals.length);

        this.extractFilterOptions();
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching hospitals:', error);
        this.error = 'Failed to load hospitals. Please try again later.';
        this.loading = false;
        // Fallback to empty array
        this.hospitals = [];
        this.filteredHospitals = [];
      }
    });
  }

  private mapFirebaseHospitalsToLocal(firebaseHospitals: FirebaseHospital[]): hospital[] {
    console.log('Starting mapping process...');

    // First, let's be more lenient with filtering - only filter out hospitals that are explicitly inactive
    const filteredHospitals = firebaseHospitals.filter(h => {
      const isActive = h.isActive !== false; // Consider undefined or true as active
      console.log(`Hospital ${h.name}: isActive = ${h.isActive}, will include = ${isActive}`);
      return isActive && h.name && h.address; // Must have name and address
    });

    console.log(`Filtered ${filteredHospitals.length} hospitals from ${firebaseHospitals.length} total`);

    return filteredHospitals.map((firebaseHospital, index) => {
      console.log(`hospital ${index}:`, firebaseHospital);
      // Extract city from address if not explicitly provided
      const addressParts = firebaseHospital.address?.split(',') || [];
      const city = addressParts.length > 1 ? addressParts[addressParts.length - 1].trim() : 'Unknown';

      // Handle createdAt safely
      let establishedYear = 2023; // Default year
      if (firebaseHospital.createdAt) {
        try {
          establishedYear = new Date(firebaseHospital.createdAt).getFullYear();
        } catch (e) {
          console.warn('Invalid createdAt date for hospital:', firebaseHospital.name);
        }
      }

      const mappedHospital = {
        id: firebaseHospital.id || String(index + 1), // Keep as string for navigation
        title: firebaseHospital.name || 'Unnamed Hospital',
        city: city,
        country: 'India', // Default country
        image: firebaseHospital.images || [firebaseHospital.image, 'assets/images/hospitals/default-hospital.jpg'],
        description: firebaseHospital.description || 'No description available',
        specialities: firebaseHospital.specialities || [],
        rating: 4.5, // Default rating - can be enhanced with actual ratings
        establishedYear: establishedYear,
        bedCount: 100, // Default bed count - can be enhanced with actual data
        accreditation: ['NABH'], // Default accreditation
        website: '', // Not available in Firebase structure
        phone: firebaseHospital.phone || '',
        address: firebaseHospital.address || ''
      } as any; // Type assertion to handle id type difference

      console.log(`Mapped hospital: ${mappedHospital.title} (${mappedHospital.city})`);
      return mappedHospital;
    });
  }

  private extractFilterOptions(): void {
    // Extract unique cities
    this.cities = [...new Set(this.hospitals.map(h => h.city))].sort();

    // this.specialties = [...new Set(this.doctors.flatMap(d => d.specialities || []))].sort();
    this.firebaseService.getServices().subscribe((specialtyList )=>{
      this.specialties = specialtyList
    });
    // Extract unique specialties
    // const allSpecialties = this.hospitals.flatMap(h => h.specialties);
    // this.specialties = [...new Set(allSpecialties)].sort();
  }

  private setupRouteSubscription(): void {
    this.routeSubscription = this.route.queryParams.subscribe(params => {
      this.searchTerm = params['q'] || '';
      this.selectedCity = params['city'] || '';
      this.selectedSpecialty = params['speciality'] || '';
      this.selectedService = params['service'] || '';
      this.sortBy = params['sortBy'] || 'name';
      this.sortOrder = params['sortOrder'] || 'asc';

      this.applyFilters();
    });
  }

  private applyFilters(): void {
    let filtered = [...this.hospitals];

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(h =>
        h.title.toLowerCase().includes(term) ||
        h.city.toLowerCase().includes(term) ||
        h.specialities.some(s => s.toLowerCase().includes(term)) ||
        h.description.toLowerCase().includes(term)
      );
    }

    // Apply city filter
    if (this.selectedCity) {
      filtered = filtered.filter(h => h.city === this.selectedCity);
    }

    // Apply specialty filter
    // if (this.selectedSpecialty) {
    //   filtered = filtered.filter(h => h.specialties.includes(this.selectedSpecialty));
    // }

    if (this.selectedSpecialty) {
      const selected = this.selectedSpecialty.trim().toLowerCase();
      filtered = filtered.filter(d =>
        (d.specialities || []).some(s => (s || '').toString().trim().toLowerCase() === selected)
      );
    }

    // Apply service filter (map service links to specialties)
    // if (this.selectedService) {
    //   const serviceToSpecialtyMap: { [key: string]: string } = {
    //     '/service-details': '', // General service, no specific filter
    //     '/dentict': 'Cardiology',
    //     '/doctor': 'Orthopedics',
    //     '/doctor-details': 'Oncology'
    //   };

    //   const mappedSpecialty = serviceToSpecialtyMap[this.selectedService];
    //   if (mappedSpecialty) {
    //     filtered = filtered.filter(h => h.specialities.includes(mappedSpecialty));
    //   }
    // }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (this.sortBy) {
        case 'name':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'bedCount':
          aValue = a.bedCount;
          bValue = b.bedCount;
          break;
        case 'establishedYear':
          aValue = a.establishedYear;
          bValue = b.establishedYear;
          break;
        default:
          aValue = a.title;
          bValue = b.title;
      }

      if (this.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    this.filteredHospitals = filtered;
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.updateQueryParams({ q: target.value });
  }

  onCityChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.updateQueryParams({ city: target.value });
  }

  onSpecialtyChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.updateQueryParams({ speciality: target.value });
  }

  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const [sortBy, sortOrder] = target.value.split('-');
    this.updateQueryParams({
      sortBy: sortBy as any,
      sortOrder: sortOrder as any
    });
  }

  clearFilters(): void {
    this.updateQueryParams({
      q: '',
      city: '',
      specialty: '',
      service: '',
      sortBy: 'name',
      sortOrder: 'asc'
    });
  }

  private updateQueryParams(params: any): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: ''
    });
  }

  onHospitalImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (!target) return;
    target.src = this.hospitalPlaceholder;
  }

  // Placeholder image for hospitals without images
  private readonly hospitalPlaceholder =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#e9f2f7"/>
            <stop offset="100%" stop-color="#d7e7f0"/>
          </linearGradient>
        </defs>
        <rect width="400" height="200" fill="url(#g)"/>
        <g fill="#8aa3b5">
          <rect x="50" y="50" width="300" height="100" rx="8" fill="#cfe0ea"/>
          <rect x="70" y="70" width="50" height="30" rx="4"/>
          <rect x="140" y="70" width="50" height="30" rx="4"/>
          <rect x="210" y="70" width="50" height="30" rx="4"/>
          <rect x="280" y="70" width="25" height="30" rx="4"/>
          <rect x="70" y="110" width="235" height="20" rx="4"/>
        </g>
        <text x="50%" y="170" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#5a7487">Hospital Image</text>
      </svg>
    `);

  getStarRating(rating: number): string[] {
    const stars: string[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('full');
    }

    if (hasHalfStar) {
      stars.push('half');
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push('empty');
    }

    return stars;
  }

  viewHospitalDetails(hospital: hospital): void {
    // Navigate to hospital details page using the hospital ID
    this.router.navigate(['/hospital-details', hospital.id]);
  }


  contactHospital(hospital: hospital): void {
    // Open contact modal or navigate to contact page
    console.log('Contact hospital:', hospital.title);
    // You can implement contact functionality here
  }

  getServiceName(serviceLink: string): string {
    const serviceNameMap: { [key: string]: string } = {
      '/service-details': 'General Services',
      '/dentict': 'Cardiology',
      '/doctor': 'Orthopedics',
      '/doctor-details': 'Oncology'
    };

    return serviceNameMap[serviceLink] || 'Unknown Service';
  }

  get whatsappLink(): string {
    return this.whatsAppService.getWhatsAppLink();
  }
}
