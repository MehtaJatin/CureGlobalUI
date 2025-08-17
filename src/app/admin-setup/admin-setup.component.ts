import { Component } from '@angular/core';
import { AuthService } from '../backend/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-setup',
  templateUrl: './admin-setup.component.html',
  styleUrls: ['./admin-setup.component.scss'],
})
export class AdminSetupComponent {
  adminData = {
    email: '',
    password: '',
    displayName: '',
  };
  isLoading = false;
  message = '';
  messageType = '';

  constructor(private authService: AuthService, private router: Router) {}

  async createAdminUser(): Promise<void> {
    if (
      !this.adminData.email ||
      !this.adminData.password ||
      !this.adminData.displayName
    ) {
      this.showMessage('Please fill in all fields', 'error');
      return;
    }

    this.isLoading = true;
    this.message = '';

    try {
      const result = await this.authService.createAdminUser(
        this.adminData.email,
        this.adminData.password,
        this.adminData.displayName
      );

      if (result.success) {
        this.showMessage(
          'Admin user created successfully! You can now login.',
          'success'
        );
        // Clear form
        this.adminData = {
          email: '',
          password: '',
          displayName: '',
        };
      }
    } catch (error: any) {
      console.error('Error creating admin user:', error);
      this.showMessage(error.message || 'Error creating admin user', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
