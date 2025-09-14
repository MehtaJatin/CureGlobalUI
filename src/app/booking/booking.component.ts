import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../backend/firebase.service';
import { WhatsAppService } from '../backend/whatsapp.service';
import { book } from '../data-type';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements OnInit {
  Bookingmsg: string | undefined;
  defaultCountryCode = '91';
  countryCodes: { name: string; dial: string }[] = [
    { name: 'India', dial: '91' },
    { name: 'United States', dial: '1' },
    { name: 'United Kingdom', dial: '44' },
    { name: 'United Arab Emirates', dial: '971' },
    { name: 'Australia', dial: '61' },
    { name: 'Canada', dial: '1' },
    { name: 'Singapore', dial: '65' },
    { name: 'Germany', dial: '49' },
    { name: 'France', dial: '33' },
    { name: 'Italy', dial: '39' },
    { name: 'Spain', dial: '34' },
    { name: 'Netherlands', dial: '31' },
    { name: 'Switzerland', dial: '41' },
    { name: 'South Africa', dial: '27' },
    { name: 'Brazil', dial: '55' },
    { name: 'Mexico', dial: '52' },
    { name: 'Japan', dial: '81' },
    { name: 'China', dial: '86' },
    { name: 'Malaysia', dial: '60' },
    { name: 'Indonesia', dial: '62' },
    { name: 'Bangladesh', dial: '880' },
    { name: 'Nepal', dial: '977' },
    { name: 'Sri Lanka', dial: '94' },
    { name: 'Pakistan', dial: '92' },
    { name: 'Saudi Arabia', dial: '966' },
    { name: 'Qatar', dial: '974' },
    { name: 'Kuwait', dial: '965' },
    { name: 'Oman', dial: '968' },
    { name: 'Turkey', dial: '90' },
  ];
  constructor(
    private firebaseService: FirebaseService,
    private whatsappService: WhatsAppService
  ) {}

  ngOnInit(): void {
    // Test Firebase connection
    console.log('Testing Firebase connection...');
    this.testFirebaseConnection();
  }

  async testFirebaseConnection() {
    try {
      // Try to get existing bookings from Firestore
      const bookings = await this.firebaseService.getBookings().toPromise();
      console.log(
        'Firebase connection successful. Existing bookings:',
        bookings
      );
    } catch (error) {
      console.error('Firebase connection test failed:', error);
    }
  }

  async Booking(data: book) {
    try {
      console.log('Submitting booking data:', data);

      // Validate required fields
      if (!data.patientName || !data.email || !data.phone || !data.concern) {
        this.Bookingmsg = 'Please fill in all required fields.';
        return;
      }

      // Basic phone validation
      if (!data.phone || data.phone.length < 10) {
        this.Bookingmsg = 'Please enter a valid phone number.';
        return;
      }

      const result = await this.firebaseService.addBooking(data);
      if (result.success) {
        this.Bookingmsg =
          'Your appointment request has been submitted successfully!';
        console.log(
          'Booking successfully stored in Firestore with ID:',
          result.id
        );

        // Send WhatsApp notification
        try {
          this.whatsappService
            .sendBookingNotification(data, result.id)
            .subscribe({
              next: (whatsappResult) => {
                console.log(
                  'WhatsApp notification sent successfully:',
                  whatsappResult
                );
                this.Bookingmsg += ' WhatsApp notification sent!';
              },
              error: (whatsappError) => {
                console.error('WhatsApp notification failed:', whatsappError);
                // Don't show error to user as booking was successful
              },
            });
        } catch (whatsappError) {
          console.error('WhatsApp service error:', whatsappError);
        }
      } else {
        const code = result.error?.code || 'unknown-error';
        const msg = result.error?.message || '';
        this.Bookingmsg = `Error submitting booking: ${code}. ${msg}`;
        console.error('Firebase error:', result.error);
      }
    } catch (error) {
      this.Bookingmsg = 'Error submitting booking. Please try again.';
      console.error('Booking error:', error);
    }

    setTimeout(() => {
      this.Bookingmsg = undefined;
    }, 3000);
  }
}
