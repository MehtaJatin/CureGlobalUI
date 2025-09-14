import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { hospital } from '../data-type';

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
  
  // Track expanded descriptions
  expandedHospitals: Set<number> = new Set();
  
  // Available filter options
  cities: string[] = [];
  specialties: string[] = [];
  
  private routeSubscription: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router
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

  private initializeHospitals(): void {
    this.hospitals = [
      {
        id: 1,
        title: 'Pushpawati Singhania Research Institute',
        city: 'New Delhi',
        country: 'India',
        image: 'assets/images/hospitals/psri.jpg',
        description: 'A premier multi-specialty hospital offering world-class healthcare services with state-of-the-art facilities.',
        specialties: ['Cardiology', 'Oncology', 'Neurology', 'Orthopedics', 'Gastroenterology'],
        rating: 4.8,
        establishedYear: 1996,
        bedCount: 200,
        accreditation: ['NABH', 'JCI'],
        website: 'https://www.psrihospital.com',
        phone: '+91-11-26925858',
        address: 'Press Enclave Marg, J Block, Saket, New Delhi - 110017'
      },
      {
        id: 2,
        title: 'Batra Hospital & Medical Research Centre',
        city: 'New Delhi',
        country: 'India',
        image: 'assets/images/hospitals/batra.jpg',
        description: 'Leading healthcare institution providing comprehensive medical care with advanced technology and expert doctors.',
        specialties: ['Cardiology', 'Neurology', 'Orthopedics', 'Urology', 'Gynecology'],
        rating: 4.6,
        establishedYear: 1987,
        bedCount: 500,
        accreditation: ['NABH', 'ISO 9001:2015'],
        website: 'https://www.batrahospitaldelhi.org',
        phone: '+91-11-29958747',
        address: '1, Tughlakabad Institutional Area, Mehrauli Badarpur Road, New Delhi - 110062'
      },
      {
        id: 3,
        title: 'Manipal Hospital Formerly AMRI Hospital',
        city: 'Kolkata',
        country: 'India',
        image: 'assets/images/hospitals/manipal-kolkata.jpg',
        description: 'Multi-specialty hospital offering advanced medical care with a focus on patient-centric healthcare.',
        specialties: ['Cardiology', 'Oncology', 'Neurology', 'Orthopedics', 'Pediatrics'],
        rating: 4.7,
        establishedYear: 1996,
        bedCount: 400,
        accreditation: ['NABH', 'JCI'],
        website: 'https://www.manipalhospitals.com/kolkata',
        phone: '+91-33-6606-6606',
        address: '58, Canal Circular Road, Kadapara, Phool Bagan, Kankurgachi, Kolkata - 700054'
      },
      {
        id: 4,
        title: 'Fortis Hospital Delhi Shalimar Bagh',
        city: 'New Delhi',
        country: 'India',
        image: 'assets/images/hospitals/fortis-shalimar.jpg',
        description: 'Advanced multi-specialty hospital providing comprehensive healthcare services with modern infrastructure.',
        specialties: ['Cardiology', 'Oncology', 'Neurology', 'Orthopedics', 'Transplant'],
        rating: 4.5,
        establishedYear: 2010,
        bedCount: 262,
        accreditation: ['NABH', 'JCI'],
        website: 'https://www.fortishealthcare.com',
        phone: '+91-11-45302222',
        address: 'A-Block, Shalimar Bagh, New Delhi - 110088'
      },
      {
        id: 5,
        title: 'Fortis Escorts Hospital',
        city: 'Amritsar',
        country: 'India',
        image: 'assets/images/hospitals/fortis-escorts-amritsar.jpg',
        description: 'Premier cardiac care hospital with world-class facilities and experienced medical professionals.',
        specialties: ['Cardiology', 'Cardiac Surgery', 'Interventional Cardiology', 'Electrophysiology'],
        rating: 4.9,
        establishedYear: 1991,
        bedCount: 200,
        accreditation: ['NABH', 'JCI'],
        website: 'https://www.fortishealthcare.com',
        phone: '+91-183-250-0000',
        address: 'The Mall, Amritsar - 143001, Punjab'
      },
      {
        id: 6,
        title: 'Apollo Gleneagles Hospital',
        city: 'Kolkata',
        country: 'India',
        image: 'assets/images/hospitals/apollo-kolkata.jpg',
        description: 'International standard healthcare facility offering comprehensive medical services across multiple specialties.',
        specialties: ['Cardiology', 'Oncology', 'Neurology', 'Orthopedics', 'Transplant'],
        rating: 4.6,
        establishedYear: 2003,
        bedCount: 700,
        accreditation: ['NABH', 'JCI'],
        website: 'https://www.apollohospitals.com',
        phone: '+91-33-2320-3040',
        address: '58, Canal Circular Road, Kadapara, Phool Bagan, Kankurgachi, Kolkata - 700054'
      },
      {
        id: 7,
        title: 'Manipal Hospital Formerly Columbia Asia',
        city: 'Gurgaon',
        country: 'India',
        image: 'assets/images/hospitals/manipal-gurgaon.jpg',
        description: 'Modern healthcare facility providing advanced medical care with international standards.',
        specialties: ['Cardiology', 'Oncology', 'Neurology', 'Orthopedics', 'Emergency Medicine'],
        rating: 4.4,
        establishedYear: 2008,
        bedCount: 150,
        accreditation: ['NABH'],
        website: 'https://www.manipalhospitals.com',
        phone: '+91-124-496-2000',
        address: 'Sector 6, Palam Vihar, Gurgaon - 122017, Haryana'
      },
      {
        id: 8,
        title: 'Apollo Hospital Bangalore Bannerghatta Road',
        city: 'Bangalore',
        country: 'India',
        image: 'assets/images/hospitals/apollo-bannerghatta.jpg',
        description: 'Leading multi-specialty hospital providing world-class healthcare services with advanced technology.',
        specialties: ['Cardiology', 'Oncology', 'Neurology', 'Orthopedics', 'Transplant', 'Robotic Surgery'],
        rating: 4.7,
        establishedYear: 2007,
        bedCount: 250,
        accreditation: ['NABH', 'JCI'],
        website: 'https://www.apollohospitals.com',
        phone: '+91-80-2630-4050',
        address: '154/11, Bannerghatta Road, Bangalore - 560076, Karnataka'
      }
    ];

    this.extractFilterOptions();
    this.applyFilters();
  }

  private extractFilterOptions(): void {
    // Extract unique cities
    this.cities = [...new Set(this.hospitals.map(h => h.city))].sort();
    
    // Extract unique specialties
    const allSpecialties = this.hospitals.flatMap(h => h.specialties);
    this.specialties = [...new Set(allSpecialties)].sort();
  }

  private setupRouteSubscription(): void {
    this.routeSubscription = this.route.queryParams.subscribe(params => {
      this.searchTerm = params['q'] || '';
      this.selectedCity = params['city'] || '';
      this.selectedSpecialty = params['specialty'] || '';
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
        h.specialties.some(s => s.toLowerCase().includes(term)) ||
        h.description.toLowerCase().includes(term)
      );
    }

    // Apply city filter
    if (this.selectedCity) {
      filtered = filtered.filter(h => h.city === this.selectedCity);
    }

    // Apply specialty filter
    if (this.selectedSpecialty) {
      filtered = filtered.filter(h => h.specialties.includes(this.selectedSpecialty));
    }

    // Apply service filter (map service links to specialties)
    if (this.selectedService) {
      const serviceToSpecialtyMap: { [key: string]: string } = {
        '/service-details': '', // General service, no specific filter
        '/dentict': 'Cardiology',
        '/doctor': 'Orthopedics',
        '/doctor-details': 'Oncology'
      };
      
      const mappedSpecialty = serviceToSpecialtyMap[this.selectedService];
      if (mappedSpecialty) {
        filtered = filtered.filter(h => h.specialties.includes(mappedSpecialty));
      }
    }

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
    this.updateQueryParams({ specialty: target.value });
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
      queryParamsHandling: 'merge'
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
    // Toggle expanded state for this hospital
    if (this.expandedHospitals.has(hospital.id)) {
      this.expandedHospitals.delete(hospital.id);
    } else {
      this.expandedHospitals.add(hospital.id);
    }
  }

  isHospitalExpanded(hospitalId: number): boolean {
    return this.expandedHospitals.has(hospitalId);
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
}
