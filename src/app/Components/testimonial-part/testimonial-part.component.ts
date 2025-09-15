import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { testimonial } from '../../data-type';
import { HttpClient } from '@angular/common/http';
import { FirebaseService } from '../../backend/firebase.service';

@Component({
  selector: 'app-testimonial-part',
  templateUrl: './testimonial-part.component.html',
  styleUrls: ['./testimonial-part.component.scss']
})
export class TestimonialPartComponent implements OnInit {
  testimonials: testimonial[] = [];
  isLoading: boolean = true;

  constructor(private http: HttpClient, private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.loadTestimonialsFromFirebase();
  }

  // Method to load testimonials from Firebase
  loadTestimonialsFromFirebase(): void {
    this.isLoading = true;
    this.firebaseService.getTestimonials().subscribe({
      next: (firebaseTestimonials) => {
        console.log('Fetched testimonials from Firebase:', firebaseTestimonials);
        
        // Map Firebase testimonials to local format
        this.testimonials = this.mapFirebaseTestimonialsToLocal(firebaseTestimonials);
        console.log('Mapped testimonials:', this.testimonials);
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading testimonials from Firebase:', error);
        // Fallback to JSON file if Firebase fails
        this.loadTestimonialsFromJson();
      }
    });
  }

  // Method to load testimonials from JSON file (fallback)
  loadTestimonialsFromJson(): void {
    this.http.get<testimonial[]>('assets/json/testimonials.json').subscribe({
      next: (data) => {
        this.testimonials = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading testimonials from JSON:', error);
        // Use default testimonials if both Firebase and JSON fail
        this.testimonials = this.getDefaultTestimonials();
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

  // Default testimonials as fallback
  private getDefaultTestimonials(): testimonial[] {
    return [
      {
        id: 1,
        name: 'Dr. Sarah Taylor',
        specialty: 'Nephrologists',
        image: 'assets/images/review-1.jpg',
        review: 'Specializing in emergency medicine, Dr. Johnson is prepared of acute illnesses, injuries or conditions. Emergency physicians, or ER doctors, must incorporate knowledge and experience gained across a broad range of medical topics.',
        rating: 5
      },
      {
        id: 2,
        name: 'Dr. Aiken Ward',
        specialty: 'Endocrinologists',
        image: 'assets/images/review-2.jpg',
        review: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        rating: 5
      },
      {
        id: 3,
        name: 'Dr. Eachann Jhon',
        specialty: 'Cardiologists',
        image: 'assets/images/review-3.jpg',
        review: 'Specializing in emergency medicine, Dr. Johnson is prepared of acute illnesses, injuries or conditions. Emergency physicians, or ER doctors, must incorporate knowledge and experience gained across a broad range of medical topics.',
        rating: 5
      }
    ];
  }

  // Method to add new testimonial
  addTestimonial(testimonial: testimonial): void {
    this.testimonials.push(testimonial);
  }

  // Method to get testimonials by specialty
  getTestimonialsBySpecialty(specialty: string): testimonial[] {
    return this.testimonials.filter(t => t.specialty.toLowerCase().includes(specialty.toLowerCase()));
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    margin:25,
    autoplaySpeed:1000,
    autoplay:true,
    autoplayTimeout:5000,
    navSpeed: 700,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 2
      }
    },
    nav: false
  }
}
