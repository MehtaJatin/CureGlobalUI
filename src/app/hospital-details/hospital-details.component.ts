// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { AdminService, Hospital } from '../backend/admin.service';
//
// function slugify(s: string): string {
//   return (s || '')
//     .toString()
//     .trim()
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, '-')
//     .replace(/^-+|-+$/g, '');
// }
//
// @Component({
//   selector: 'app-hospital-details',
//   templateUrl: './hospital-details.component.html',
//   styleUrls: ['./hospital-details.component.scss']
// })
// export class HospitalDetailsComponent implements OnInit {
//   isLoading = true;
//   slug = '';
//   hospital: Partial<Hospital & {
//     image?: string;
//     gallery?: string[];
//     highlights?: string[];
//     specialties?: string[];
//     website?: string;
//   }> | null = null;
//
//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private adminService: AdminService
//   ) {}
//
//   ngOnInit(): void {
//     this.route.paramMap.subscribe(params => {
//       this.slug = (params.get('slug') || '').toString();
//       this.loadHospital();
//     });
//   }
//
//   private loadHospital(): void {
//     this.isLoading = true;
//     this.adminService.getActiveHospitals().subscribe({
//       next: (hospitals) => {
//         const match = hospitals.find(h => slugify(h.name) === this.slug);
//         this.hospital = match || (hospitals[0] || null);
//         this.isLoading = false;
//       },
//       error: (err) => {
//         console.error('Failed to load hospitals', err);
//         this.isLoading = false;
//       }
//     });
//   }
// }
