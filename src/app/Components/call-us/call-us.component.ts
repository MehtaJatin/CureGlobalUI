import { Component } from '@angular/core';

@Component({
  selector: 'app-call-us',
  templateUrl: './call-us.component.html',
  styleUrls: ['./call-us.component.scss']
})
export class CallUsComponent {

  submitInquiry(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    const payload: Record<string, string> = {};
    data.forEach((v, k) => payload[k] = String(v));
    console.log('Inquiry form submitted', payload);
    
    // Reset form after submission
    form.reset();
    
    // Show success message (you can implement a toast notification here)
    alert('Thank you for your inquiry! We will contact you soon.');
  }
}
