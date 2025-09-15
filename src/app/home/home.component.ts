import { Component, OnInit, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../backend/firebase.service';
import { Hospital as FirebaseHospital } from '../backend/firebase.service';
import { hospital } from '../data-type';
import { book } from '../data-type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit{
  Bookingmsg: string | undefined;
  isSubmitting: boolean = false;
  showSuccessMessage: boolean = false;
  services: any[] = [];
  extendedServices = [
    {
      icon: 'fa-solid fa-user-doctor',
      title: 'Health Opinion and Price Estimation',
      desc: 'Expert advice and price estimates.'
    },
    {
      icon: 'fa-solid fa-language',
      title: 'Language interpreters',
      desc: 'Fluent experts bridging language gaps.'
    },
    {
      icon: 'fa-solid fa-stethoscope',
      title: 'Pre-Trip Consultation',
      desc: 'Review procedures and be travel ready.'
    },
    {
      icon: 'fa-solid fa-passport',
      title: 'Visa Guidance',
      desc: 'We\'ll guide you through your medical visa.'
    },
    {
      icon: 'fa-solid fa-sterling-sign',
      title: 'Currency Exchange',
      desc: 'Easy exchange services in your city.'
    },
    {
      icon: 'fa-solid fa-house-circle-check',
      title: 'Housing Choices',
      desc: 'Close to hospitals and fit to your needs.'
    },
    {
      icon: 'fa-solid fa-shuttle-van',
      title: 'Support with transportation',
      desc: 'Airport transfers at no extra charge.'
    },
    {
      icon: 'fa-solid fa-clipboard-list',
      title: 'Registration · Appointments · Pharmacy',
      desc: 'End‑to‑end medical logistics handling.'
    },
    {
      icon: 'fa-solid fa-user-nurse',
      title: 'Personalized Nursing Care',
      desc: 'Private nursing care arranged when required.'
    }
  ];

  hospitals: any[] = [];

  // Tiny neutral placeholder (SVG as data URI) used when an image fails to load
  private readonly hospitalPlaceholder =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#e9f2f7"/>
            <stop offset="100%" stop-color="#d7e7f0"/>
          </linearGradient>
        </defs>
        <rect width="640" height="360" fill="url(#g)"/>
        <g fill="#8aa3b5">
          <rect x="90" y="80" width="460" height="200" rx="8" fill="#cfe0ea"/>
          <rect x="120" y="110" width="80" height="60" rx="4"/>
          <rect x="240" y="110" width="80" height="60" rx="4"/>
          <rect x="360" y="110" width="80" height="60" rx="4"/>
          <rect x="480" y="110" width="40" height="60" rx="4"/>
          <rect x="120" y="190" width="400" height="30" rx="4"/>
        </g>
        <text x="50%" y="330" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#5a7487">Hospital image</text>
      </svg>
    `);

  onHospitalImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (!target) return;
    target.src = this.hospitalPlaceholder;
  }
  constructor(
    private firebaseService: FirebaseService,
    private host: ElementRef<HTMLElement>,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getServicesDetails();
    this.getHospitalDetails();
  }

  // Reveal-on-scroll for hospital cards
  @ViewChildren('hospitalCard') hospitalCards!: QueryList<ElementRef<HTMLElement>>;

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
          }
        });
      },
      { root: null, threshold: 0.15 }
    );

    // Defer to ensure elements are rendered
    setTimeout(() => {
      this.hospitalCards?.forEach((ref) => observer.observe(ref.nativeElement));
    });
  }

  onHospitalCardActivate(h: { title: string; city: string }): void {
    // Placeholder: hook navigation or modal here
    console.log('Hospital card activated:', h.title, h.city);
  }

  selectedHospital: { title: string; city: string } | null = null;

  selectHospital(h: { title: string; city: string }): void {
    this.selectedHospital = h;
    // Navigate to hospitals route (can be replaced with a dedicated hospital details route later)
    this.router.navigate(['/hospitals'], { queryParams: { q: h.title } });
  }

  // Procedures (pricing) data
  allProcedures = [
    { name: 'Knee Replacement', price: 4000, icon: 'assets/images/procedures/knee.png', category: 'Orthopedic' },
    { name: 'Hip Replacement', price: 5500, icon: 'assets/images/procedures/hip.png', category: 'Orthopedic' },
    { name: 'Brain Tumor', price: 5000, icon: 'assets/images/procedures/brain.png', category: 'Oncology' },
    { name: 'Heart Bypass Surgery', price: 4500, icon: 'assets/images/procedures/heart-bypass.png', category: 'Cardiac' },
    { name: 'Valve Replacement', price: 5000, icon: 'assets/images/procedures/valve.png', category: 'Cardiac' },
    { name: 'Breast Cancer', price: 5000, icon: 'assets/images/procedures/breast-cancer.png', category: 'Oncology' },
    { name: 'Lung Cancer', price: 5500, icon: 'assets/images/procedures/lung-cancer.png', category: 'Oncology' },
    { name: 'Rhinoplasty', price: 1800, icon: 'assets/images/procedures/rhinoplasty.png', category: 'Cosmetic' },
    { name: 'Breast Implants', price: 2750, icon: 'assets/images/procedures/breast-implants.png', category: 'Cosmetic' },
    { name: 'Hair Transplant', price: 1400, icon: 'assets/images/procedures/hair-transplant.png', category: 'Cosmetic' },
    { name: 'Cervical Cancer', price: 4500, icon: 'assets/images/procedures/cervical-cancer.png', category: 'Oncology' },
    { name: 'Hysterectomy', price: 3000, icon: 'assets/images/procedures/hysterectomy.png', category: 'Oncology' }
  ];

  procedures = this.allProcedures.map(p => ({...p, price: `$${p.price}`}));
  selectedCategory: 'All' | 'Orthopedic' | 'Oncology' | 'Cardiac' | 'Cosmetic' = 'All';
  searchTerm = '';
  sortBy: 'relevance' | 'price-asc' | 'price-desc' | 'name-asc' = 'relevance';

  private recomputeProcedures(): void {
    const term = this.searchTerm.trim().toLowerCase();
    let list = this.allProcedures.filter(p =>
      (this.selectedCategory === 'All' || p.category === this.selectedCategory) &&
      (term === '' || p.name.toLowerCase().includes(term))
    );

    switch (this.sortBy) {
      case 'price-asc': list = list.sort((a,b)=>a.price-b.price); break;
      case 'price-desc': list = list.sort((a,b)=>b.price-a.price); break;
      case 'name-asc': list = list.sort((a,b)=>a.name.localeCompare(b.name)); break;
      default: break;
    }

    this.procedures = list.map(p => ({...p, price: `$${p.price}`}));
  }

  setCategory(category: 'All' | 'Orthopedic' | 'Oncology' | 'Cardiac' | 'Cosmetic'){
    this.selectedCategory = category;
    this.recomputeProcedures();
  }

  onProcedureSearch(event: Event){
    const input = event.target as HTMLInputElement;
    this.searchTerm = input?.value || '';
    this.recomputeProcedures();
  }

  onSortChange(event: Event){
    const select = event.target as HTMLSelectElement;
    const value = (select?.value || 'relevance') as typeof this.sortBy;
    this.sortBy = value;
    this.recomputeProcedures();
  }

  private readonly procedurePlaceholder = this.hospitalPlaceholder;

  onProcedureImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (!target) return;
    target.src = this.procedurePlaceholder;
  }

  requestQuote(p: { name: string }): void {
    console.log('Request a quote for', p.name);
  }

  onLookingForHelp(): void {
    console.log('Looking for help clicked');
  }

  // Modal state
  showQuoteModal = false;
  selectedProcedure: { name: string } | null = null;

  openQuote(p: { name: string }): void {
    this.selectedProcedure = p;
    this.showQuoteModal = true;
    // Delay focusing to after render
    setTimeout(() => {
      const firstInput = document.querySelector('.quote-dialog .quote-input') as HTMLInputElement | null;
      firstInput?.focus();
    });
  }

  openContactModal(): void {
    this.showQuoteModal = true;
    // Delay focusing to after render
    setTimeout(() => {
      const firstInput = document.querySelector('.quote-dialog .quote-input') as HTMLInputElement | null;
      firstInput?.focus();
    });
  }

  closeQuote(): void {
    this.showQuoteModal = false;
    this.Bookingmsg = undefined;
    this.showSuccessMessage = false;
    this.isSubmitting = false;
  }

  submitQuote(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    const payload: Record<string, string> = {};
    data.forEach((v, k) => payload[k] = String(v));
    console.log('Quote form submitted', payload);
    this.closeQuote();
  }

  async Booking(data: book) {
    this.isSubmitting = true;
    this.Bookingmsg = undefined;
    this.showSuccessMessage = false;

    try {
      console.log('Submitting booking data:', data);

      // Validate required fields
      if (!data.patientName || !data.email || !data.phone || !data.concern) {
        this.Bookingmsg = 'Please fill in all required fields.';
        this.isSubmitting = false;
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        this.Bookingmsg = 'Please enter a valid email address.';
        this.isSubmitting = false;
        return;
      }

      // Basic phone validation
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
        this.Bookingmsg = 'Please enter a valid phone number.';
        this.isSubmitting = false;
        return;
      }

      const result = await this.firebaseService.addBooking(data);
      if (result.success) {
        this.showSuccessMessage = true;
        this.Bookingmsg = 'Your appointment request has been submitted successfully.';
        console.log(
          'Booking successfully stored in Firestore with ID:',
          result.id
        );

        // Auto-close modal after 3 seconds on success
        setTimeout(() => {
          this.closeQuote();
        }, 3000);

      } else {
        const code = result.error?.code || 'unknown-error';
        const msg = result.error?.message || '';
        this.Bookingmsg = `Error submitting booking: ${code}. ${msg}`;
        console.error('Firebase error:', result.error);
      }
    } catch (error) {
      this.Bookingmsg = 'Error submitting booking. Please try again.';
      console.error('Booking error:', error);
    } finally {
      this.isSubmitting = false;
    }

    // Clear error message after 5 seconds
    if (this.Bookingmsg && !this.showSuccessMessage) {
      setTimeout(() => {
        this.Bookingmsg = undefined;
      }, 5000);
    }
  }

  getServicesDetails(){
    this.firebaseService.getServices().subscribe({
      next: (services) => {
        const result = services;
        if(result.length>0){
          let cnt=1;
            for(let ser of result){
              this.services.push({
                id: ser.id,
                title: ser.name,
                description: ser.description,
                image: ser.photo,
                link: '/hospitals'+'?q='+ser.name
              });
              cnt++;
              if(cnt>6){
                break;
              }
            }
        }
      },
      error: (error) => {
        console.error('Error fetching services:', error);
      }
    });
  }


  getHospitalDetails(){
    this.firebaseService.getHospitals().subscribe({
      next: (firebaseHospitals) => {
        // Limit to only 6 hospitals
        const limitedHospitals = firebaseHospitals.slice(0, 6);
        this.hospitals = this.mapFirebaseHospitalsToLocal(limitedHospitals);
        console.log('Mapped hospitals (limited to 6):', this.hospitals);
        console.log('Number of mapped hospitals:', this.hospitals.length);

      },
      error: (error) => {
        console.error('Error fetching hospitals:', error);
        // Fallback to empty array
        this.hospitals = [];
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
        image: firebaseHospital.images? firebaseHospital.images[0] : 'assets/images/hospitals/default-hospital.jpg',
        description: firebaseHospital.description || 'No description available',
        specialties: firebaseHospital.specialities || [],
        address: firebaseHospital.address || ''
      } as any; // Type assertion to handle id type difference

      console.log(`Mapped hospital: ${mappedHospital.title} (${mappedHospital.city})`);
      return mappedHospital;
    });
  }
  

  goToHospitals(serviceName: string) {
    this.router.navigate(['/hospitals'], { queryParams: { speciality: serviceName } });
  }
  
  goToHospitalDetails(hospitalId:string){
    this.router.navigate(['/hospital-details/'+ hospitalId]);
  }
}
