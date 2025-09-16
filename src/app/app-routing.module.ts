import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { BlogComponent } from './blog/blog.component';
import { BookingComponent } from './booking/booking.component';
import { ContactComponent } from './contact/contact.component';
import { DentictsComponent } from './denticts/denticts.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { PricingComponent } from './pricing/pricing.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { RegisterComponent } from './register/register.component';
import { ServiceDetailsComponent } from './service-details/service-details.component';
import { ServicesComponent } from './services/services.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { VaccineComponent } from './vaccine/vaccine.component';
import { AdminSetupComponent } from './admin-setup/admin-setup.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminServicesComponent } from './admin/services/services.component';
import { DoctorDetailsComponent } from './doctor-details/doctor-details.component';
import { HospitalListComponent } from './hospital-list/hospital-list.component';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { HospitalDetailsComponent } from './hospital-details/hospital-details.component';
import { TranslationManagerComponent } from './translation-manager/translation-manager.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'services', component: ServicesComponent },
  // Hospital list page with filtering
  { path: 'hospitals', component: HospitalListComponent },
  { path: 'service-details', component: ServiceDetailsComponent },
  { path: 'dentict', component: DentictsComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'testimonials', component: TestimonialsComponent },
  { path: 'vaccine', component: VaccineComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog-details', component: BlogDetailsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'admin-setup', component: AdminSetupComponent },
  { path: 'doctor-details', component: DoctorDetailsComponent },
  { path: 'doctors', component: DoctorListComponent },
  { path: 'hospital-details/:id', component: HospitalDetailsComponent },
  { path: 'translation-manager', component: TranslationManagerComponent },
  { path: 'notfound', component: NotfoundComponent },
  { path: '**', component: NotfoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
