import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../backend/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit {
  services: any[] = [];

  constructor(private firebaseService: FirebaseService, private router:Router) {}

  ngOnInit(): void {
    this.getServicesDetails();
  }

  getServicesDetails() {
    this.firebaseService.getServices().subscribe({
      next: (services) => {
        const result = services;
        if (result.length > 0) {
          let temp = result;
          let cnt = 1;
          for (let ser of temp) {
            console.log(ser);
            this.services.push({
              id: cnt++,
              title: ser.name,
              description: ser.description,
              image: ser.photo,
              link: `/hospital-treatments/${ser.name}`,
            });
          }
        }
      },
      error: (error) => {
        console.error('Error fetching services:', error);
      },
    });
  }

  goToHospitals(serviceName: string) {
    this.router.navigate(['/hospitals'], { queryParams: { speciality: serviceName } });
  }
}
