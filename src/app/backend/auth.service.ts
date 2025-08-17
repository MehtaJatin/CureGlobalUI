import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from } from 'rxjs';
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
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.firestore
            .doc<User>(`users/${user.uid}`)
            .valueChanges()
            .pipe(map((userData) => userData || null));
        } else {
          return from([null]);
        }
      })
    );
  }

  // Sign up with email and password
  async signUp(
    email: string,
    password: string,
    displayName: string
  ): Promise<any> {
    try {
      const credential = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );

      if (credential.user) {
        // Create user document in Firestore
        const userData: User = {
          uid: credential.user.uid,
          email: email,
          displayName: displayName,
          role: 'user', // Default role
          createdAt: new Date(),
        };

        await this.firestore.doc(`users/${credential.user.uid}`).set(userData);
        return { success: true, user: userData };
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<any> {
    try {
      const credential = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      return { success: true, user: credential.user };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await this.afAuth.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
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
    try {
      const credential = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );

      if (credential.user) {
        const userData: User = {
          uid: credential.user.uid,
          email: email,
          displayName: displayName,
          role: 'admin',
          createdAt: new Date(),
        };

        await this.firestore.doc(`users/${credential.user.uid}`).set(userData);
        return { success: true, user: userData };
      }
    } catch (error) {
      console.error('Create admin error:', error);
      throw error;
    }
  }
}
