import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from './admin.service';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    AdminService,
    AuthService,
    FirebaseService
  ]
})
export class BackendModule { }
