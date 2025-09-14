import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Hospital } from '../models/hospital-specialty.model';
import { HospitalService } from '../services/hospital.service';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hospitalService: HospitalService
  ) {
    console.log('HospitalDetailsComponent constructor called');
  }

  ngOnInit(): void {
    console.log('HospitalDetailsComponent ngOnInit called');
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

    this.hospitalService.getHospitalById(hospitalId).subscribe({
      next: (hospital) => {
        console.log('Hospital data received:', hospital);
        if (hospital) {
          this.hospital = hospital;
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

  onSubmitContactForm(formData: any): void {
    // Handle contact form submission
    console.log('Contact form submitted:', formData);
  }
}