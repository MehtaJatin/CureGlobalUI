import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { book } from '../data-type';

@Injectable({
  providedIn: 'root',
})
export class WhatsAppService {
  constructor() {}

  private readonly allowedLengths: Record<
    string,
    number[] | { min: number; max: number }
  > = {
    '91': [10],
    '1': [10],
    '44': [9, 10, 11],
    '971': [9],
    '61': [8, 9],
    '65': [8],
    '49': [10, 11],
    '33': [9],
    '39': [9, 10],
    '34': [9],
    '31': [9],
    '41': [9],
    '27': [9],
    '55': [10, 11],
    '52': [10],
    '81': [10],
    '86': [11],
    '60': [9, 10],
    '62': { min: 9, max: 11 },
    '880': [10],
    '977': [10],
    '94': [9],
    '92': [10],
    '966': [9],
    '974': [8],
    '965': [8],
    '968': [8],
    '90': [10],
  };

  public validatePhone(
    countryCode: string | undefined,
    rawPhone: string
  ): string | null {
    const cc = (countryCode || '').replace(/\D+/g, '');
    let phone = (rawPhone || '').replace(/\D+/g, '').replace(/^0+/, '');
    if (!cc) {
      if (phone.length === 10) return null; // assume India by default
      return 'Please select a country and enter a valid phone number.';
    }
    const rule = this.allowedLengths[cc];
    if (!rule) return null; // unknown country rule → skip
    const len = phone.length;
    const valid = Array.isArray(rule)
      ? rule.includes(len)
      : len >= rule.min && len <= rule.max;
    if (!valid) {
      const expected = Array.isArray(rule)
        ? rule.join('/')
        : `${rule.min}-${rule.max}`;
      return `Invalid phone number length for +${cc}. Expected ${expected} digits, got ${len}.`;
    }
    return null;
  }

  private formatPhoneNumber(rawPhone: string, countryCode?: string): string {
    let phone = (rawPhone || '').replace(/\D+/g, '');
    phone = phone.replace(/^0+/, '');
    const cc = (countryCode || '').replace(/\D+/g, '');

    if (cc) {
      const rule = this.allowedLengths[cc];
      if (rule) {
        const len = phone.length;
        let valid = false;
        if (Array.isArray(rule)) {
          valid = rule.includes(len);
        } else {
          valid = len >= rule.min && len <= rule.max;
        }
        if (!valid) {
          throw new Error(
            `Invalid phone length for +${cc}. Expected ${
              Array.isArray(rule) ? rule.join('/') : `${rule.min}-${rule.max}`
            } digits, got ${len}.`
          );
        }
      }
      return `${cc}${phone}`;
    }

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
      `*Patient Name:* ${bookingData.patientName}`,
      `*Email:* ${bookingData.email}`,
      `*Phone:* ${bookingData.phone}`,
      `*City:* ${bookingData.city || '-'}`,
      `*Health Concern:*`,
      `${bookingData.concern || '-'}`,
      '',
      `*Submitted:* ${new Date().toLocaleString()}`,
      `*Booking ID:* ${bookingId}`,
      '',
      'Please review and respond to this appointment request.',
    ].join('\n');
    try {
      const encodedText = encodeURIComponent(message);
      const url = `https://wa.me/${phoneNumber}?text=${encodedText}`;
      window.open(url, '_blank');
      return of({ opened: true, url });
    } catch (err) {
      return throwError(() => err);
    }
  }
}
