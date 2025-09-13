import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-test-route',
  template: `
    <div class="test-route">
      <h2>Test Route Component</h2>
      <p>This is a test route to check if routing is working.</p>
      <p *ngIf="specialization">
        Specialization: {{ specialization }}
      </p>
    </div>
  `,
  styles: [
    `
    .test-route {
      padding: 20px;
      margin: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    `
  ]
})
export class TestRouteComponent {
  specialization: string = '';

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.specialization = params['specialization'] || '';
      console.log('Test Route - Query Params:', params);
    });
  }
}
