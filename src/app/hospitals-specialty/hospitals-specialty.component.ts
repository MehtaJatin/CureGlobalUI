// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
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
//   selector: 'app-hospitals-specialty',
//   templateUrl: './hospitals-specialty.component.html',
//   styleUrls: ['./hospitals-specialty.component.scss']
// })
// export class HospitalsSpecialtyComponent implements OnInit {
//   isLoading = true;
//   slug = '';
//   specialtyLabel = '';
//   hospitals: Hospital[] = [];
//   filtered: Hospital[] = [];
//   visible: Hospital[] = [];
//   page = 1;
//   pageSize = 6;
//   hasMore = false;
//
//   constructor(private route: ActivatedRoute, private adminService: AdminService) {}
//
//   ngOnInit(): void {
//     this.route.paramMap.subscribe(params => {
//       this.slug = (params.get('slug') || '').toString();
//       this.specialtyLabel = this.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
//       this.load();
//     });
//   }
//
//   private load(): void {
//     this.isLoading = true;
//     this.adminService.getActiveHospitals().subscribe({
//       next: (h) => {
//         this.hospitals = h || [];
//         this.filtered = this.hospitals.filter((x: any) => {
//           const arr: string[] = (x?.specialties || []) as string[];
//           return Array.isArray(arr) && arr.some(s => slugify(s) === this.slug);
//         });
//         this.page = 1;
//         this.applyPaging();
//         this.isLoading = false;
//       },
//       error: (err) => {
//         console.error('Failed to load hospitals', err);
//         this.isLoading = false;
//       }
//     });
//   }
//
//   getSlug(name: string): string {
//     return slugify(name);
//   }
//
//   loadMore(): void {
//     this.page += 1;
//     this.applyPaging();
//   }
//
//   private applyPaging(): void {
//     const end = this.page * this.pageSize;
//     this.visible = this.filtered.slice(0, end);
//     this.hasMore = end < this.filtered.length;
//   }
// }
