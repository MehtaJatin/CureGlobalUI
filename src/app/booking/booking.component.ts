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

  // Test WhatsApp connection
  testWhatsAppConnection() {
    console.log('Testing WhatsApp connection...');
    this.whatsappService.testConnection().subscribe({
      next: (result) => {
        console.log('WhatsApp connection test successful:', result);
        this.Bookingmsg = 'WhatsApp connection test successful!';
      },
      error: (error) => {
        console.error('WhatsApp connection test failed:', error);
        this.Bookingmsg =
          'WhatsApp connection test failed. Check console for details.';
      },
    });

    setTimeout(() => {
      this.Bookingmsg = undefined;
    }, 5000);
  }

  async Booking(data: book) {
    try {
      console.log('Submitting booking data:', data);

      // Validate required fields
      if (!data.name || !data.email || !data.phone || !data.query) {
        this.Bookingmsg = 'Please fill in all fields.';
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
        this.Bookingmsg = 'Error submitting booking. Please try again.';
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
