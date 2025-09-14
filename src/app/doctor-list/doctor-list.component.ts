import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { doctor } from '../data-type';
import { FirebaseService } from '../backend/firebase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.scss']
})
export class DoctorListComponent implements OnInit, OnDestroy {
  doctors: doctor[] = [];
  filteredDoctors: doctor[] = [];
  searchTerm = '';
  selectedSpecialty = '';
  selectedLocation = '';
  selectedExperience = '';
  sortBy: 'name' | 'rating' | 'experience' | 'consultationFee' = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';

  // Track expanded descriptions
  expandedDoctors: Set<number> = new Set();

  // Available filter options
  specialties: string[] = [];
  locations: string[] = [];
  experienceLevels: string[] = ['0-5 Years', '5-10 Years', '10-15 Years', '15-20 Years', '20+ Years'];

  private routeSubscription: Subscription | undefined;
  private doctorsSubscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit(): void {
    this.initializeDoctors();
    this.setupRouteSubscription();
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.doctorsSubscription) {
      this.doctorsSubscription.unsubscribe();
    }
  }

  private initializeDoctors(): void {
    this.doctorsSubscription = this.firebaseService.getDoctors().subscribe({
      next: (doctors) => {
        console.log('Fetched doctors from Firestore:', doctors);
        this.doctors = doctors.map((doc: any) => ({
          id: doc.id,
          name: doc.name || '',
          specialty: doc.specialization || doc.specialty || '',
          image: doc.imageBase64 || doc.image || this.doctorPlaceholder,
          location: doc.location || '',
          experience: doc.experience || '',
          designation: doc.position || doc.designation || '',
          hospital: doc.hospitalAffiliation || doc.hospital || '',
          qualifications: typeof doc.qualifications === 'string'
            ? doc.qualifications.split(',').map((q: string) => q.trim())
            : (doc.qualifications || []),
          description: doc.biography || doc.description || '',
          rating: doc.rating || 4.5,
          consultationFee: doc.consultationFee || 1500,
          languages: doc.languages || ['English'],
          availability: doc.availability || 'Mon-Fri: 9AM-5PM',
          phone: doc.phone || '',
          email: doc.email || ''
        }));

        this.extractFilterOptions();
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error fetching doctors from Firestore:', error);
        // Fallback to empty array or show error message
        this.doctors = [];
        this.extractFilterOptions();
        this.applyFilters();
      }
    });
  }

  private extractFilterOptions(): void {
    // Extract unique specialties
    this.specialties = [...new Set(this.doctors.map(d => d.specialty))].sort();

    // Extract unique locations
    this.locations = [...new Set(this.doctors.map(d => d.location))].sort();
  }

  private setupRouteSubscription(): void {
    this.routeSubscription = this.route.queryParams.subscribe(params => {
      this.searchTerm = params['q'] || '';
      this.selectedSpecialty = params['specialty'] || '';
      this.selectedLocation = params['location'] || '';
      this.selectedExperience = params['experience'] || '';
      this.sortBy = params['sortBy'] || 'name';
      this.sortOrder = params['sortOrder'] || 'asc';

      this.applyFilters();
    });
  }

  private applyFilters(): void {
    let filtered = [...this.doctors];

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(term) ||
        d.specialty.toLowerCase().includes(term) ||
        d.hospital.toLowerCase().includes(term) ||
        d.designation.toLowerCase().includes(term) ||
        d.description.toLowerCase().includes(term)
      );
    }

    // Apply specialty filter
    if (this.selectedSpecialty) {
      filtered = filtered.filter(d => d.specialty === this.selectedSpecialty);
    }

    // Apply location filter
    if (this.selectedLocation) {
      filtered = filtered.filter(d => d.location === this.selectedLocation);
    }

    // Apply experience filter
    if (this.selectedExperience) {
      filtered = filtered.filter(d => {
        const expYears = parseInt(d.experience);
        switch (this.selectedExperience) {
          case '0-5 Years': return expYears <= 5;
          case '5-10 Years': return expYears > 5 && expYears <= 10;
          case '10-15 Years': return expYears > 10 && expYears <= 15;
          case '15-20 Years': return expYears > 15 && expYears <= 20;
          case '20+ Years': return expYears > 20;
          default: return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (this.sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'experience':
          aValue = parseInt(a.experience);
          bValue = parseInt(b.experience);
          break;
        case 'consultationFee':
          aValue = a.consultationFee || 0;
          bValue = b.consultationFee || 0;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (this.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    this.filteredDoctors = filtered;
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.updateQueryParams({ q: target.value });
  }

  onSpecialtyChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.updateQueryParams({ specialty: target.value });
  }

  onLocationChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.updateQueryParams({ location: target.value });
  }

  onExperienceChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.updateQueryParams({ experience: target.value });
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
      specialty: '',
      location: '',
      experience: '',
      sortBy: 'name',
      sortOrder: 'asc'
    });
  }

  private updateQueryParams(params: any): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge'
    });
  }

  onDoctorImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (!target) return;
    target.src = this.doctorPlaceholder;
  }

  // Placeholder image for doctors without images
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

  getStarRating(rating: number): string[] {
    const stars = [];
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

  viewDoctorDetails(doctor: doctor): void {
    // Toggle expanded state for this doctor
    if (this.expandedDoctors.has(doctor.id)) {
      this.expandedDoctors.delete(doctor.id);
    } else {
      this.expandedDoctors.add(doctor.id);
    }
  }

  isDoctorExpanded(doctorId: number): boolean {
    return this.expandedDoctors.has(doctorId);
  }

  contactDoctor(doctor: doctor): void {
    // Open contact modal or navigate to contact page
    console.log('Contact doctor:', doctor.name);
    // You can implement contact functionality here
  }

  bookConsultation(doctor: doctor): void {
    // Navigate to booking page with doctor details
    console.log('Book consultation with:', doctor.name);
    // You can implement booking functionality here
  }
}
