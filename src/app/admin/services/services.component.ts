import { Component, OnInit } from '@angular/core';
import { AdminService, Service } from '../../backend/admin.service';
import { AuthService } from '../../backend/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class AdminServicesComponent implements OnInit {
  services: Service[] = [];
  isLoading = true;
  showAddForm = false;
  editingService: Service | null = null;

  newService: Partial<Service> = {
    name: '',
    description: '',
    price: 0,
    duration: 30,
    category: '',
    isActive: true,
  };

  categories = [
    'General Medicine',
    'Cardiology',
    'Dermatology',
    'Orthopedics',
    'Pediatrics',
    'Gynecology',
    'Neurology',
    'Ophthalmology',
    'Dental',
    'Surgery',
    'Emergency',
    'Laboratory',
  ];

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAdminAccess();
    this.loadServices();
  }

  async checkAdminAccess(): Promise<void> {
    this.authService.getCurrentUser().subscribe((user) => {
      if (!user || user.role !== 'admin') {
        this.router.navigate(['/login']);
      }
    });
  }

  loadServices(): void {
    this.adminService.getServices().subscribe({
      next: (services) => {
        this.services = services;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.isLoading = false;
      },
    });
  }

  showAddServiceForm(): void {
    this.showAddForm = true;
    this.editingService = null;
    this.resetForm();
  }

  showEditServiceForm(service: Service): void {
    this.editingService = service;
    this.showAddForm = true;
    this.newService = { ...service };
  }

  cancelForm(): void {
    this.showAddForm = false;
    this.editingService = null;
    this.resetForm();
  }

  resetForm(): void {
    this.newService = {
      name: '',
      description: '',
      price: 0,
      duration: 30,
      category: '',
      isActive: true,
    };
  }

  async saveService(): Promise<void> {
    if (
      !this.newService.name ||
      !this.newService.description ||
      !this.newService.category
    ) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (this.editingService) {
        // Update existing service
        await this.adminService.updateService(
          this.editingService.id!,
          this.newService
        );
        alert('Service updated successfully!');
      } else {
        // Add new service
        await this.adminService.addService(
          this.newService as Omit<Service, 'id' | 'createdAt' | 'updatedAt'>
        );
        alert('Service added successfully!');
      }

      this.showAddForm = false;
      this.editingService = null;
      this.resetForm();
      this.loadServices();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Error saving service. Please try again.');
    }
  }

  async deleteService(service: Service): Promise<void> {
    if (confirm(`Are you sure you want to delete "${service.name}"?`)) {
      try {
        await this.adminService.deleteService(service.id!);
        alert('Service deleted successfully!');
        this.loadServices();
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Error deleting service. Please try again.');
      }
    }
  }

  async toggleServiceStatus(service: Service): Promise<void> {
    try {
      await this.adminService.toggleServiceStatus(
        service.id!,
        !service.isActive
      );
      this.loadServices();
    } catch (error) {
      console.error('Error toggling service status:', error);
      alert('Error updating service status. Please try again.');
    }
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }
}
