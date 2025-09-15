import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService, Hospital } from '../backend/firebase.service';
declare var $: any;
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  userName: string = '';
  services: any[] = [];
  hospitals: Hospital[] = [];
  hospitalSpecialties: any[] = [];
  doctors: any[] = [];
  doctorSpecialties: any[] = [];
  private hospitalsSubscription: Subscription | undefined;
  private servicesSubscription: Subscription | undefined;
  private doctorsSubscription: Subscription | undefined;

  constructor(private firebaseService: FirebaseService, private router: Router) {}

  ngOnInit(): void {
    this.getServices();
    this.getHospitals();
    this.getDoctors();

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

  ngOnDestroy(): void {
    if (this.hospitalsSubscription) {
      this.hospitalsSubscription.unsubscribe();
    }
    if (this.servicesSubscription) {
      this.servicesSubscription.unsubscribe();
    }
    if (this.doctorsSubscription) {
      this.doctorsSubscription.unsubscribe();
    }
  }

  goToHospital(serviceLink: string) {
    this.router.navigate(['/hospitals'], { queryParams: { speciality: serviceLink } });
  }

  goToHospitalsBySpecialty(specialty: any) {
    this.router.navigate(['/hospitals'], { queryParams: { speciality: specialty.id } });
  }

  goToDoctorsBySpecialty(service: any) {
    this.router.navigate(['/doctors'], { queryParams: { speciality: service.id } });
  }

  getServices() {
    this.servicesSubscription = this.firebaseService.getServices().subscribe({
      next: (services) => {
        const result = services;
        if (result.length > 0) {
          let cnt = 1;
          for (let ser of result) {
            this.services.push({
              id: ser.id,
              title: ser.name,
              description: ser.description,
              image: ser.photo,
              link: ser.name ,
            });
          }
        }
        // Re-extract doctor specialties after services are loaded
        if (this.doctors.length > 0) {
          this.extractDoctorSpecialties();
        }
      },
      error: (error) => {
        console.error('Error fetching services:', error);
      },
    });
  }

  getHospitals() {
    this.hospitalsSubscription = this.firebaseService.getHospitals().subscribe({
      next: (hospitals) => {
        console.log('Fetched hospitals for navbar:', hospitals);
        this.hospitals = hospitals;
        this.extractHospitalSpecialties();
      },
      error: (error) => {
        console.error('Error fetching hospitals for navbar:', error);
      }
    });
  }

  private extractHospitalSpecialties() {
    const specialitySet = new Set<string>();

    this.hospitals.forEach(hospital => {
      if (hospital.specialities && Array.isArray(hospital.specialities)) {
        hospital.specialities.forEach(specialty => {
          specialitySet.add(specialty);
        });
      }
    });
     this.firebaseService.getServices().subscribe((specialites)=>{
      this.hospitalSpecialties = specialites.filter((spec: any) =>
        specialitySet.has(spec.id)
      );
    });

    console.log('Extracted hospital specialties:', this.hospitalSpecialties);
  }

  getDoctors() {
    this.doctorsSubscription = this.firebaseService.getDoctors().subscribe({
      next: (doctors) => {
        console.log('Fetched doctors for navbar:', doctors);
        this.doctors = doctors;
        // Only extract specialties if services are already loaded
        if (this.services.length > 0) {
          this.extractDoctorSpecialties();
        }
      },
      error: (error) => {
        console.error('Error fetching doctors for navbar:', error);
      }
    });
  }

  private extractDoctorSpecialties() {
    const specialtySet = new Set<string>();

    this.doctors.forEach(doctor => {
      // Also check if there's a specialties array (plural)
      if (doctor.specializations && Array.isArray(doctor.specializations)) {
        console.log('specialityIdtest', doctor.specializations)
        doctor.specializations.forEach((specialtyId: string) => {
          console.log('specialityId', specialtyId)
          // Find the service name that matches this specialization key
          const matchingService = this.services.find(service =>
            service.id === specialtyId
          );
         console.log('matchingService', matchingService)
          const displayName = matchingService ? specialtySet.add(matchingService) : "";
        });
      }
    });

    this.doctorSpecialties = Array.from(specialtySet).sort();
    console.log('Extracted doctor specialties:', this.doctorSpecialties);
  }
}
