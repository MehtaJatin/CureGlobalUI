import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { book } from '../data-type';

@Injectable({
  providedIn: 'root',
})
export class WhatsAppService {
  constructor() {}

  private formatPhoneNumber(rawPhone: string, countryCode?: string): string {
    let phone = (rawPhone || '').replace(/\D+/g, '');
    // Remove leading zeros commonly used for national format
    phone = phone.replace(/^0+/, '');
    const cc = (countryCode || '').replace(/\D+/g, '');
    if (cc) {
      return `${cc}${phone}`;
    }
    // Fallback: assume India if 10-digit local number
    if (phone.length === 10) {
      return `91${phone}`;
    }
    return phone;
  }

  /**
   * Send WhatsApp notification for a new booking
   */
  sendBookingNotification(
    bookingData: book,
    bookingId: string
  ): Observable<any> {
    // Always send to clinic/business number (destination)
    const phoneNumber = this.formatPhoneNumber('9896717405', '91');
    const message = [
      '*New Appointment Request*',
      '———————————————',
      `*Name:* ${bookingData.name}`,
      `*Email:* ${bookingData.email}`,
      `*Patient Phone:* ${bookingData.phone}`,
      `*Query:*`,
      `${bookingData.query || '-'}`,
      '',
      `*Submitted:* ${new Date().toLocaleString()}`,
      `*Booking ID:* ${bookingId}`,
      '',
      'Please review and respond to this appointment request.',
    ].join('\n');
    const encodedText = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    window.open(url, '_blank');
    return of({ opened: true, url });
  }
}
