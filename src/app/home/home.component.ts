import { Component, OnInit, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../backend/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit{
  Bookingmsg: string | undefined;
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

  hospitals = [
    {
      title: 'Pushpawati Singhania Research Institute, New Delhi',
      city: 'New Delhi, India',
      image: 'assets/images/hospitals/psri.jpg'
    },
    {
      title: 'Batra Hospital & Medical Research Centre, New Delhi',
      city: 'New Delhi, India',
      image: 'assets/images/hospitals/batra.jpg'
    },
    {
      title: 'Manipal Hospital Formerly AMRI Hospital, Kolkata',
      city: 'Kolkata, India',
      image: 'assets/images/hospitals/manipal-kolkata.jpg'
    },
    {
      title: 'Fortis Hospital Delhi Shalimar Bagh',
      city: 'New Delhi, India',
      image: 'assets/images/hospitals/fortis-shalimar.jpg'
    },
    {
      title: 'Fortis Escorts Hospital, Amritsar',
      city: 'Amritsar, India',
      image: 'assets/images/hospitals/fortis-escorts-amritsar.jpg'
    },
    {
      title: 'Apollo Gleneagles Hospital Kolkata',
      city: 'Kolkata, India',
      image: 'assets/images/hospitals/apollo-kolkata.jpg'
    },
    {
      title: 'Manipal Hospital Formerly Columbia Asia, Palam Vihar Gurgaon',
      city: 'Gurgaon, India',
      image: 'assets/images/hospitals/manipal-gurgaon.jpg'
    },
    {
      title: 'Apollo Hospital Bangalore Bannerghatta Road',
      city: 'Bangalore, India',
      image: 'assets/images/hospitals/apollo-bannerghatta.jpg'
    }
  ];

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

  closeQuote(): void {
    this.showQuoteModal = false;
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

  getServicesDetails(){
    this.firebaseService.getServices().subscribe({
      next: (services) => {
        const result = services;
        if(result.length>0){
          let temp = result[0]['services'];
          let cnt=1;
            for(let ser of temp){
              console.log(ser);
              this.services.push({
                id: cnt++,
                title: ser.serviceName,
                description: ser.serviceDescription,
                image: 'assets/images/services/'+ ser.serviceName + '.avif',
                link: '/service-details'
              });
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
  
}
