import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../backend/firebase.service';
import { AdminService } from '../backend/admin.service';

declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @ViewChild('doctorsDropdown') doctorsDropdown: ElementRef;
  
  userName: string = '';
  services: any[] = [];
  hospitalSpecialties: string[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.getServices();
    this.loadHospitalSpecialties();

    window.onscroll = function () {
      myFunction();
    };

    const navbar = document.querySelector('.navbar-area');

    function myFunction() {
      if (window.pageYOffset >= 20) {
        navbar?.classList.add('sticky');
      } else {
        navbar?.classList.remove('sticky');
      }
    }
  }

  private slugify(s: string): string {
    return (s || '')
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  getSlug(s: string): string { return this.slugify(s); }

  private loadHospitalSpecialties() {
    const set = new Set<string>();
    this.adminService.getActiveHospitals().subscribe({
      next: (hospitals: any[]) => {
        hospitals.forEach((h: any) => {
          const arr: string[] = (h?.specialties || []) as string[];
          if (Array.isArray(arr)) arr.forEach((sp) => {
            const val = (sp || '').toString().trim();
            if (val) set.add(val);
          });
        });
        this.hospitalSpecialties = Array.from(set).sort((a, b) => a.localeCompare(b));
      },
      error: (e) => console.error('Error fetching hospital specialties:', e)
    });
  }

  getServices() {
    this.firebaseService.getServices().subscribe({
      next: (services) => {
        const result = services;
        if (result.length > 0) {
          let cnt = 1;
          for (let ser of result) {
            this.services.push({
              id: cnt++,
              title: ser.name,
              description: ser.description,
              image: ser.photo,
              link: '/service-details',
            });
          }
        }
      },
      error: (error) => {
        console.error('Error fetching services:', error);
      },
    });
  }

  closeDropdowns() {
    // Close the dropdown menu
    if (this.doctorsDropdown) {
      const dropdownElement = this.doctorsDropdown.nativeElement;
      if (dropdownElement.classList.contains('show')) {
        dropdownElement.classList.remove('show');
      }
    }
    
    // Remove the 'show' class from all dropdown menus
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
      if (menu.classList.contains('show')) {
        menu.classList.remove('show');
      }
    });
    
    // Remove the 'show' class from all dropdown toggles
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
      if (toggle.getAttribute('aria-expanded') === 'true') {
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
}
