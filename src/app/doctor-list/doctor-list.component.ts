import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { doctor } from '../data-type';

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
  
  private routeSubscription: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeDoctors();
    this.setupRouteSubscription();
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private initializeDoctors(): void {
    this.doctors = [
      {
        id: 1,
        name: 'Dr. Vivek Gupta',
        specialty: 'Oncology',
        image: 'assets/images/doctors/dr-vivek-gupta.jpg',
        location: 'India',
        experience: '16+ Years',
        designation: 'Senior Consultant',
        hospital: 'Millennium Cancer Center, Gurgaon',
        qualifications: ['MBBS', 'MD', 'DM'],
        description: 'Dr. Vivek Gupta is a Senior Consultant in the department of Surgical Oncology. He has a rich experience in the field of Surgical Oncology and has worked in different capacities at leading cancer centers.',
        rating: 4.8,
        consultationFee: 1500,
        languages: ['English', 'Hindi'],
        availability: 'Mon-Fri: 9AM-5PM',
        phone: '+91-9876543210',
        email: 'dr.vivek@example.com'
      },
      {
        id: 2,
        name: 'Dr. Atul Sharma',
        specialty: 'Cosmetic',
        image: 'assets/images/doctors/dr-atul-sharma.jpg',
        location: 'India',
        experience: '12+ Years',
        designation: 'Plastic Surgeon',
        hospital: 'Apollo Hospitals, Delhi',
        qualifications: ['MS', 'MCh', 'DNB'],
        description: 'Dr. Atul Sharma is a renowned Plastic Surgeon with extensive experience in cosmetic and reconstructive surgery. He specializes in facial aesthetics, body contouring, and breast surgery.',
        rating: 4.7,
        consultationFee: 2000,
        languages: ['English', 'Hindi'],
        availability: 'Mon-Sat: 10AM-6PM',
        phone: '+91-9876543211',
        email: 'dr.atul@example.com'
      },
      {
        id: 3,
        name: 'Dr. Anant Kumar',
        specialty: 'Kidney Transplant',
        image: 'assets/images/doctors/dr-anant-kumar.jpg',
        location: 'India',
        experience: '44+ Years',
        designation: 'Chairman, Uro-Oncology',
        hospital: 'Max Super Speciality Hospital, Delhi',
        qualifications: ['MBBS', 'MS', 'MCh', 'FRCS'],
        description: 'Dr. Anant Kumar is a pioneer in kidney transplantation and uro-oncology. With over 44 years of experience, he has performed thousands of successful kidney transplants and complex urological procedures.',
        rating: 4.9,
        consultationFee: 2500,
        languages: ['English', 'Hindi', 'Punjabi'],
        availability: 'Mon-Fri: 8AM-4PM',
        phone: '+91-9876543212',
        email: 'dr.anant@example.com'
      },
      {
        id: 4,
        name: 'Dr. Deepak Dubey',
        specialty: 'Kidney Transplant',
        image: 'assets/images/doctors/dr-deepak-dubey.jpg',
        location: 'India',
        experience: '18+ Years',
        designation: 'Senior Consultant',
        hospital: 'Fortis Hospital, Mumbai',
        qualifications: ['MBBS', 'MS', 'DNB'],
        description: 'Dr. Deepak Dubey is a Senior Consultant in Nephrology and Kidney Transplantation. He has extensive experience in managing complex kidney diseases and performing kidney transplants.',
        rating: 4.6,
        consultationFee: 1800,
        languages: ['English', 'Hindi', 'Marathi'],
        availability: 'Mon-Sat: 9AM-5PM',
        phone: '+91-9876543213',
        email: 'dr.deepak@example.com'
      },
      {
        id: 5,
        name: 'Dr. Priya Singh',
        specialty: 'Cardiology',
        image: 'assets/images/doctors/dr-priya-singh.jpg',
        location: 'India',
        experience: '14+ Years',
        designation: 'Interventional Cardiologist',
        hospital: 'Medanta The Medicity, Gurgaon',
        qualifications: ['MBBS', 'MD', 'DM'],
        description: 'Dr. Priya Singh is a leading Interventional Cardiologist specializing in complex cardiac procedures including angioplasty, stenting, and structural heart interventions.',
        rating: 4.8,
        consultationFee: 2200,
        languages: ['English', 'Hindi'],
        availability: 'Mon-Fri: 8AM-6PM',
        phone: '+91-9876543214',
        email: 'dr.priya@example.com'
      },
      {
        id: 6,
        name: 'Dr. Rajesh Verma',
        specialty: 'Orthopedics',
        image: 'assets/images/doctors/dr-rajesh-verma.jpg',
        location: 'India',
        experience: '20+ Years',
        designation: 'Joint Replacement Surgeon',
        hospital: 'Apollo Hospitals, Bangalore',
        qualifications: ['MBBS', 'MS', 'MCh'],
        description: 'Dr. Rajesh Verma is a renowned Joint Replacement Surgeon with expertise in hip and knee replacement surgeries. He has performed over 5000 successful joint replacement procedures.',
        rating: 4.7,
        consultationFee: 1900,
        languages: ['English', 'Hindi', 'Kannada'],
        availability: 'Mon-Sat: 9AM-5PM',
        phone: '+91-9876543215',
        email: 'dr.rajesh@example.com'
      },
      {
        id: 7,
        name: 'Dr. Sunita Reddy',
        specialty: 'Neurology',
        image: 'assets/images/doctors/dr-sunita-reddy.jpg',
        location: 'India',
        experience: '16+ Years',
        designation: 'Neurologist',
        hospital: 'NIMHANS, Bangalore',
        qualifications: ['MBBS', 'MD', 'DM'],
        description: 'Dr. Sunita Reddy is a leading Neurologist specializing in stroke management, epilepsy, and movement disorders. She has extensive experience in neuroimaging and interventional neurology.',
        rating: 4.6,
        consultationFee: 1700,
        languages: ['English', 'Hindi', 'Telugu'],
        availability: 'Mon-Fri: 9AM-4PM',
        phone: '+91-9876543216',
        email: 'dr.sunita@example.com'
      },
      {
        id: 8,
        name: 'Dr. Amit Patel',
        specialty: 'Gastroenterology',
        image: 'assets/images/doctors/dr-amit-patel.jpg',
        location: 'India',
        experience: '13+ Years',
        designation: 'Gastroenterologist',
        hospital: 'AIIMS, Delhi',
        qualifications: ['MBBS', 'MD', 'DM'],
        description: 'Dr. Amit Patel is a skilled Gastroenterologist specializing in advanced endoscopic procedures, liver diseases, and inflammatory bowel diseases.',
        rating: 4.5,
        consultationFee: 1600,
        languages: ['English', 'Hindi', 'Gujarati'],
        availability: 'Mon-Sat: 10AM-6PM',
        phone: '+91-9876543217',
        email: 'dr.amit@example.com'
      }
    ];

    this.extractFilterOptions();
    this.applyFilters();
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
