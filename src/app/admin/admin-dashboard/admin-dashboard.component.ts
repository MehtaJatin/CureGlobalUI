import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../backend/auth.service';
import { AdminService } from '../../backend/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  stats: any = {};
  isLoading = true;
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAdminAccess();
    this.loadDashboardStats();
  }

  async checkAdminAccess(): Promise<void> {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      if (!user || user.role !== 'admin') {
        this.router.navigate(['login']);
      }
    });
  }

  async loadDashboardStats(): Promise<void> {
    try {
      this.stats = await this.adminService.getDashboardStats();
      this.isLoading = false;
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      this.isLoading = false;
    }
  }

  navigateToServices(): void {
    this.router.navigate(['/admin/services']);
  }

  navigateToHospitals(): void {
    this.router.navigate(['/admin/hospitals']);
  }

  navigateToDoctors(): void {
    this.router.navigate(['/admin/doctors']);
  }

  navigateToBookings(): void {
    this.router.navigate(['/admin/bookings']);
  }

  async signOut(): Promise<void> {
    try {
      await this.authService.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }
}
