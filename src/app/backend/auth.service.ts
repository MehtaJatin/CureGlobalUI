import { Injectable } from '@angular/core';
// import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(
    // private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {
    // Temporarily disable auth for hospital functionality
    this.user$ = of(null);
  }

  // Sign up with email and password
  async signUp(
    email: string,
    password: string,
    displayName: string
  ): Promise<any> {
    console.log('Auth temporarily disabled for hospital functionality');
    return { success: false, message: 'Auth disabled' };
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<any> {
    console.log('Auth temporarily disabled for hospital functionality');
    return { success: false, message: 'Auth disabled' };
  }

  // Sign out
  async signOut(): Promise<void> {
    console.log('Auth temporarily disabled for hospital functionality');
    this.router.navigate(['/login']);
  }

  // Check if user is admin
  isAdmin(): Observable<boolean> {
    return this.user$.pipe(map((user) => user?.role === 'admin'));
  }

  // Get current user
  getCurrentUser(): Observable<User | null> {
    return this.user$;
  }

  // Update user role (admin only)
  async updateUserRole(uid: string, role: 'admin' | 'user'): Promise<void> {
    try {
      await this.firestore.doc(`users/${uid}`).update({ role });
    } catch (error) {
      console.error('Update role error:', error);
      throw error;
    }
  }

  // Create admin user (for initial setup)
  async createAdminUser(
    email: string,
    password: string,
    displayName: string
  ): Promise<any> {
    console.log('Auth temporarily disabled for hospital functionality');
    return { success: false, message: 'Auth disabled' };
  }
}