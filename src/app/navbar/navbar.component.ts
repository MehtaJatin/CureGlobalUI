import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../backend/firebase.service';
declare var $: any;
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  userName: string = '';
  services: any[] = [];

  constructor(private firebaseService: FirebaseService, private router: Router) {}

  ngOnInit(): void {
    this.getServices();

    window.onscroll = function () {
      myFunction();
    };

    const navbar = document.querySelector('.navbar-area');

    function myFunction() {
      if (window.pageYOffset >= 20) {
        navbar?.classList.add('sticky');
      } else {
        navbar?.classList.remove('sticky');
      }
    }
  }

  goToHospital(serviceLink: string) {
    this.router.navigate(['/hospitals'], { queryParams: { speciality: serviceLink } });
  }

  getServices() {
    this.firebaseService.getServices().subscribe({
      next: (services) => {
        const result = services;
        if (result.length > 0) {
          let cnt = 1;
          for (let ser of result) {
            this.services.push({
              id: cnt++,
              title: ser.name,
              description: ser.description,
              image: ser.photo,
              link: ser.name ,
            });
          }
        }
      },
      error: (error) => {
        console.error('Error fetching services:', error);
      },
    });
    this.services.push({
      id: 121313234,
      title: 'cardiology',
      description: ' as a sa s a ',
      image: '',
      link: 'Cardiology' ,
    });
  }
}
