import { Component } from '@angular/core';
import { AuthService } from '../../backend/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.scss'],
})
export class CreateAdminComponent {
  adminData = {
    email: '',
    password: '',
    displayName: '',
  };

  isLoading = false;
  message = '';
  messageType = '';

  constructor(private authService: AuthService, private router: Router) {}

  async createAdmin(): Promise<void> {
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
        this.showMessage('Admin user created successfully!', 'success');
        // Clear form
        this.adminData = {
          email: '',
          password: '',
          displayName: '',
        };
      }
    } catch (error: any) {
      console.error('Error creating admin:', error);
      this.showMessage(error.message || 'Error creating admin user', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;

    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 5000);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
