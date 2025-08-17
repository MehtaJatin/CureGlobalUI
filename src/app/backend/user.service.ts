import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { book, login, signUp } from '../data-type';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  invalidUserAuth = new EventEmitter<boolean>(false);
  constructor(private http: HttpClient, private router: Router) {}

  userSignUp(user: signUp) {
    this.http
      .post('http://seller-9gw5.onrender.com/users', user, {
        observe: 'response',
      })
      .subscribe((result) => {
        if (result) {
          localStorage.setItem('user', JSON.stringify(result.body));
          this.router.navigate(['/']);
        }
      });
  }

  userLogin(data: login) {
    this.http
      .get<signUp[]>(
        `http://seller-9gw5.onrender.com/users?email=${data.email}&password=${data.password}`,
        { observe: 'response' }
      )
      .subscribe((result) => {
        if (result && result.body?.length) {
          localStorage.setItem('user', JSON.stringify(result.body[0]));
          this.router.navigate(['/']);
          this.invalidUserAuth.emit(false);
        } else {
          this.invalidUserAuth.emit(true);
        }
      });
  }

  userBooking(user: book) {
    // Store booking data in localStorage (simulating Firebase)
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const newBooking = {
      ...user,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    bookings.push(newBooking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    console.log('Booking stored in localStorage:', newBooking);
    console.log('All bookings:', bookings);

    // Also send to your existing API
    this.http
      .post('http://seller-9gw5.onrender.com/users', user, {
        observe: 'response',
      })
      .subscribe((result) => {
        if (result) {
          localStorage.setItem('user', JSON.stringify(result.body));
          this.router.navigate(['/']);
        }
      });
  }
}
