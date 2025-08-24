import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../backend/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  Bookingmsg: string | undefined;
  services: any[] = [];
  constructor(
    private firebaseService: FirebaseService,
  ) {}

  ngOnInit(): void {
    this.getServicesDetails();
  }

  getServicesDetails(){
    this.firebaseService.getServices().subscribe({
      next: (services) => {
        const result = services;
        if(result.length>0){
          let temp = result[0]['services'];
          let cnt=1;
            for(let ser of temp){
              console.log(ser);
              this.services.push({
                id: cnt++,
                title: ser.serviceName,
                description: ser.serviceDescription,
                image: 'assets/images/services/'+ ser.serviceName + '.avif',
                link: '/service-details'
              });
              if(cnt>6){
                break;
              }
            }
        }
      },
      error: (error) => {
        console.error('Error fetching services:', error);
      }
    });
  }
  
}
