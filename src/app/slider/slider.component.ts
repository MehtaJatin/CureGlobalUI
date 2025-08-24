import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent {
  slides = [
    {
      id: 1,
      backgroundImage: 'assets/images/slides-bg1.jpg',
      subTitle: 'Where Wellness Meets The World',
      title: 'Excellent Medical Treatment',
      description: 'Connect with experienced specialists who listen, guide, and provide solutions tailored to your needs. Whether you are seeking medical advice, a second opinion, or personalized health recommendations, our team ensures clarity, transparency, and care every step of the way.',
      buttonText: 'Book Appointment',
      buttonLink: '/booking'
    },
    {
      id: 2,
      backgroundImage: 'assets/images/slides-bg2.jpg',
      subTitle: 'Where Wellness Meets The World',
      title: 'Affordability & Transparency',
      description: 'Our consultation services are built on the values of affordability and transparency. We ensure clear guidance, honest recommendations, and cost-effective solutions so you can make informed decisions with complete confidence.',
      buttonText: 'Book Appointment',
      buttonLink: '/booking'
    },
    {
      id: 3,
      backgroundImage: 'assets/images/slides-bg3.jpg',
      subTitle: 'Where Wellness Meets The World',
      title: 'Your Health is Our Top Priority',
      description: 'Your well-being comes first. Our consultation services are designed to provide expert guidance, personalized care, and trusted support—ensuring you receive the right advice and treatment at the right time, with complete peace of mind.',
      buttonText: 'Book Appointment',
      buttonLink: '/booking'
    }
  ];

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    autoplay:true,
    autoplayTimeout:5000,
    animateOut: 'fadeOut',
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
        items: 1
      }
    },
    nav: false
  }
}
