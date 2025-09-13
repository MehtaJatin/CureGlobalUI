import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Doctor } from '../backend/admin.service';
import { db } from '../firebase.config';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface SearchQuery {
  name: string;
  phone: string;
  email: string;
  city: string;
  message: string;
}

@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.scss'],
})
export class DoctorDetailsComponent implements OnInit {
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  visibleDoctors: Doctor[] = [];
  specialization: string = '';
  isLoading: boolean = true;
  isSticky: boolean = false;
  private expandedIds = new Set<string>();
  // pagination
  page = 1;
  pageSize = 6;
  hasMore = false;
  // specialization chips
  specializations: string[] = [];

  searchQuery: SearchQuery = {
    name: '',
    phone: '',
    email: '',
    city: '',
    message: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset > 100;
  }

  // Inline expand helpers
  isExpanded(doc: Doctor): boolean {
    return !!doc?.id && this.expandedIds.has(doc.id);
  }

  toggleExpanded(doc: Doctor): void {
    if (!doc?.id) return;
    if (this.expandedIds.has(doc.id)) this.expandedIds.delete(doc.id);
    else this.expandedIds.add(doc.id);
  }

  private applyFiltersAndPaging(): void {
    const norm = (s: string) => (s || '').toString().trim().toLowerCase();
    const spec = norm(this.specialization);
    let base = [...this.doctors];
    if (spec) {
      const matchesSpec = (d: any) => {
        const ds = norm(d.specialization);
        if (!ds) return false;
        if (ds === spec) return true;
        if (ds.includes(spec) || spec.includes(ds)) return true;
        const tokens = ds.split(/[|,/]|\s{2,}/).map((t: string) => norm(t)).filter(Boolean);
        return tokens.some((t: string) => t === spec || t.includes(spec) || spec.includes(t));
      };
      base = base.filter(matchesSpec);
    }
    this.filteredDoctors = base;
    // pagination
    const end = this.page * this.pageSize;
    this.visibleDoctors = base.slice(0, end);
    this.hasMore = end < base.length;
  }

  loadMore(): void {
    this.page += 1;
    this.applyFiltersAndPaging();
  }

  ngOnInit(): void {
    // Subscribe to route query parameters
    this.route.queryParams.subscribe((params) => {
      // Get the specialization from query params, default to empty string if not provided
      const newSpecialization = params['specialization'] || '';

      // Only reload doctors if specialization has changed
      if (this.specialization !== newSpecialization) {
        this.specialization = newSpecialization;
        this.loadDoctors();
      }
    });

    // Initial load in case there are no query params
    if (!this.specialization) {
      this.loadDoctors();
    }
  }

  async loadDoctors(): Promise<void> {
    this.isLoading = true;
    try {
      const doctorsRef = collection(db, 'doctors');
      const snapshot = await getDocs(doctorsRef);
      let doctors = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) })) as Doctor[];

      // Treat missing isActive as active (true)
      const activeDoctors = doctors.filter((d: any) => d.isActive === undefined || d.isActive === true);

      const norm = (s: string) => (s || '').toString().trim().toLowerCase();
      const spec = norm(this.specialization);

      if (spec) {
        // Flexible matching: exact, partial, token-based, and reverse-includes
        const matchesSpec = (d: any) => {
          const ds = norm(d.specialization);
          if (!ds) return false;
          if (ds === spec) return true;
          if (ds.includes(spec) || spec.includes(ds)) return true;
          // token-based match on common separators
          const tokens = ds.split(/[|,/]|\s{2,}/).map((t: string) => norm(t)).filter(Boolean);
          return tokens.some((t: string) => t === spec || t.includes(spec) || spec.includes(t));
        };

        this.doctors = activeDoctors.filter(matchesSpec);

        // Fallback: if nothing matches, show all active so the page isn't empty
        if (this.doctors.length === 0) {
          this.doctors = activeDoctors;
        }
      } else {
        // No specialization provided — show all active doctors
        this.doctors = activeDoctors;
      }

      // build specialization chips (unique, sorted)
      const set = new Set<string>();
      this.doctors.forEach((d: any) => {
        const s = (d?.specialization || '').toString().trim();
        if (s) set.add(s);
      });
      this.specializations = Array.from(set).sort((a, b) => a.localeCompare(b));

      // reset paging on new load
      this.page = 1;
      this.applyFiltersAndPaging();
      this.isLoading = false;

      // Debug
      console.log('Specialization filter:', this.specialization);
      console.log('Active doctors count:', activeDoctors.length);
      console.log('Filtered doctors:', this.doctors);
    } catch (error) {
      console.error('Error loading doctors:', error);
      this.isLoading = false;
    }
  }

  searchDoctors(): void {
    // In a real app, you would send this data to your backend
    console.log('Search query submitted:', this.searchQuery);
    // For now, we'll just show a confirmation
    alert('Your request has been submitted. We will contact you soon!');
    this.resetSearchForm();
  }

  resetSearchForm(): void {
    this.searchQuery = {
      name: '',
      phone: '',
      email: '',
      city: '',
      message: ''
    };
  }

  // Helper method to get the first name from full name
  getFirstName(fullName: string): string {
    return fullName ? fullName.split(' ')[0] : '';
  }
}
