import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SliderComponent } from './slider/slider.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { AboutComponent } from './about/about.component';
import { ServicesComponent } from './services/services.component';
import { DentictsComponent } from './denticts/denticts.component';
import { DoctorDetailsComponent } from './doctor-details/doctor-details.component';
import { HospitalDetailsComponent } from './hospital-details/hospital-details.component';
import { BookingComponent } from './booking/booking.component';
import { PricingComponent } from './pricing/pricing.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { BlogComponent } from './blog/blog.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { ContactComponent } from './contact/contact.component';
import { ServiceDetailsComponent } from './service-details/service-details.component';
import { CallUsComponent } from './Components/call-us/call-us.component';
import { AboutPartComponent } from './Components/about-part/about-part.component';
import { FooterComponent } from './footer/footer.component';
import { VaccineComponent } from './vaccine/vaccine.component';
import { DentictsPartComponent } from './Components/denticts-part/denticts-part.component';
import { TestimonialPartComponent } from './Components/testimonial-part/testimonial-part.component';
import { ScrollComponent } from './Components/scroll/scroll.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminServicesComponent } from './admin/services/services.component';
import { AdminSetupComponent } from './admin-setup/admin-setup.component';
import { HospitalListComponent } from './hospital-list/hospital-list.component';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from './backend/firebase.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
import { TranslatePipe } from './i18n/translate.pipe';
import { LocalizePipe } from './i18n/localize.pipe';
import { MachineTranslatePipe } from './i18n/mt.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavbarComponent,
    SliderComponent,
    HomeComponent,
    AboutComponent,
    ServicesComponent,
    DentictsComponent,
    DoctorDetailsComponent,
    HospitalDetailsComponent,
    BookingComponent,
    PricingComponent,
    TestimonialsComponent,
    PrivacyComponent,
    LoginComponent,
    RegisterComponent,
    NotfoundComponent,
    BlogComponent,
    BlogDetailsComponent,
    ContactComponent,
    ServiceDetailsComponent,
    CallUsComponent,
    AboutPartComponent,
    FooterComponent,
    VaccineComponent,
    DentictsPartComponent,
    TestimonialPartComponent,
    ScrollComponent,
    AdminDashboardComponent,
    AdminServicesComponent,
    AdminSetupComponent,
    HospitalListComponent,
    DoctorListComponent,
    TranslatePipe,
    LocalizePipe,
    MachineTranslatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CarouselModule,
    HttpClientModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent],
})
export class AppModule {}
