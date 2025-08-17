import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { book } from '../data-type';

@Injectable({
  providedIn: 'root'
})
export class WhatsAppService {

  // WhatsApp Business API configuration
  private readonly WHATSAPP_TOKEN = 'YOUR_WHATSAPP_TOKEN'; // Replace with your token
  private readonly WHATSAPP_PHONE_NUMBER_ID = 'YOUR_PHONE_NUMBER_ID'; // Replace with your phone number ID
  private readonly WHATSAPP_API_URL = `https://graph.facebook.com/v18.0/${this.WHATSAPP_PHONE_NUMBER_ID}/messages`;

  constructor(private http: HttpClient) { }

  /**
   * Send WhatsApp notification for a new booking
   */
  sendBookingNotification(bookingData: book, bookingId: string): Observable<any> {
    // Format phone number (remove + if present and ensure it starts with country code)
    let phoneNumber = bookingData.phone.replace(/\s+/g, '').replace(/^\+/, '');
    
    // If phone number doesn't start with country code, assume it's Indian (+91)
    if (!phoneNumber.startsWith('91') && phoneNumber.length === 10) {
      phoneNumber = `91${phoneNumber}`;
    }

    // Create WhatsApp message
    const message = `🏥 *New Appointment Request*

👤 *Patient Name:* ${bookingData.name}
📧 *Email:* ${bookingData.email}
📱 *Phone:* ${bookingData.phone}
💬 *Query:* ${bookingData.query}
📅 *Submitted:* ${new Date().toLocaleString()}
🆔 *Booking ID:* ${bookingId}

Please review and respond to this appointment request.`;

    const payload = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'text',
      text: { body: message }
    };

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(this.WHATSAPP_API_URL, payload, { headers });
  }

  /**
   * Test WhatsApp connection
   */
  testConnection(): Observable<any> {
    const testMessage = '🧪 This is a test message from your Medical App WhatsApp integration!';
    const testPhone = '919876543210'; // Replace with your test phone number

    const payload = {
      messaging_product: 'whatsapp',
      to: testPhone,
      type: 'text',
      text: { body: testMessage }
    };

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(this.WHATSAPP_API_URL, payload, { headers });
  }

  /**
   * Send custom WhatsApp message
   */
  sendCustomMessage(phoneNumber: string, message: string): Observable<any> {
    // Format phone number
    let formattedPhone = phoneNumber.replace(/\s+/g, '').replace(/^\+/, '');
    
    if (!formattedPhone.startsWith('91') && formattedPhone.length === 10) {
      formattedPhone = `91${formattedPhone}`;
    }

    const payload = {
      messaging_product: 'whatsapp',
      to: formattedPhone,
      type: 'text',
      text: { body: message }
    };

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(this.WHATSAPP_API_URL, payload, { headers });
  }
}
