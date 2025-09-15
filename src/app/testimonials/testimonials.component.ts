import { Component, OnInit, OnDestroy } from '@angular/core';
import { testimonial } from '../data-type';
import { FirebaseService } from '../backend/firebase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements OnInit, OnDestroy {
  testimonials: testimonial[] = [];
  isLoading: boolean = true;
  private testimonialsSubscription: Subscription | undefined;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.loadTestimonialsFromFirebase();
  }

  ngOnDestroy(): void {
    if (this.testimonialsSubscription) {
      this.testimonialsSubscription.unsubscribe();
    }
  }

  // Method to load testimonials from Firebase
  loadTestimonialsFromFirebase(): void {
    this.isLoading = true;
    this.testimonialsSubscription = this.firebaseService.getTestimonials().subscribe({
      next: (firebaseTestimonials) => {
        console.log('Fetched testimonials from Firebase:', firebaseTestimonials);

        // Map Firebase testimonials to local format
        this.testimonials = this.mapFirebaseTestimonialsToLocal(firebaseTestimonials);
        console.log('Mapped testimonials:', this.testimonials);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading testimonials from Firebase:', error);
        this.isLoading = false;
      }
    });
  }

  // Map Firebase testimonials to local testimonial format
  private mapFirebaseTestimonialsToLocal(firebaseTestimonials: any[]): testimonial[] {
    return firebaseTestimonials.map((firebaseTestimonial, index) => ({
      id: parseInt(firebaseTestimonial.id) || index + 1,
      name: firebaseTestimonial.name || 'Anonymous',
      specialty: firebaseTestimonial.specialty || 'General',
      image: firebaseTestimonial.image || 'assets/images/review-default.jpg',
      review: firebaseTestimonial.review || 'No review available',
      rating: firebaseTestimonial.rating || 5
    }));
  }
}
