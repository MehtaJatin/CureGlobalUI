import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FirestoreTranslateService } from '../i18n/firestore-translate.service';
import { TranslationService } from '../i18n/translation.service';

@Component({
  selector: 'app-runtime-translation',
  template: `
    <div class="container mt-4">
      <h2>🌍 Runtime Translation Examples</h2>
      <p class="lead">No JSON files needed! Everything translates automatically.</p>

      <!-- Language Selector -->
      <div class="mb-4">
        <label class="form-label">Select Language:</label>
        <select class="form-select" [(ngModel)]="selectedLanguage" (change)="changeLanguage()">
          <option value="en">English</option>
          <option value="hi">Hindi (हिन्दी)</option>
          <option value="es">Spanish (Español)</option>
          <option value="fr">French (Français)</option>
          <option value="de">German (Deutsch)</option>
          <option value="it">Italian (Italiano)</option>
          <option value="pt">Portuguese (Português)</option>
          <option value="ru">Russian (Русский)</option>
          <option value="ar">Arabic (العربية)</option>
          <option value="ja">Japanese (日本語)</option>
          <option value="ko">Korean (한국어)</option>
          <option value="zh-CN">Chinese (中文)</option>
        </select>
      </div>

      <!-- Example 1: Simple Text Translation -->
      <div class="card mb-4">
        <div class="card-header">
          <h5>1. Simple Text (No JSON files needed)</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <h6>Static Text:</h6>
              <p>{{ 'Welcome to our hospital' | autoTranslate }}</p>
              <p>{{ 'We provide excellent healthcare services' | autoTranslate }}</p>
              <p>{{ 'Our doctors are highly qualified' | autoTranslate }}</p>
            </div>
            <div class="col-md-4">
              <h6>Dynamic Variables:</h6>
              <p>{{ dynamicWelcomeMessage | autoTranslate }}</p>
              <p>{{ userMessage | autoTranslate }}</p>
            </div>
            <div class="col-md-4">
              <h6>Form Input:</h6>
              <textarea class="form-control mb-2"
                        [(ngModel)]="userInput"
                        placeholder="Type anything here in English..."></textarea>
              <p><strong>Translated:</strong> {{ userInput | autoTranslate }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Example 2: Firestore Doctor Data -->
      <div class="card mb-4">
        <div class="card-header">
          <h5>2. Firestore Doctor Data (Translated Automatically)</h5>
        </div>
        <div class="card-body">
          <div class="row" *ngFor="let doctor of translatedDoctors | async">
            <div class="col-md-6">
              <div class="card">
                <div class="card-body">
                  <h6 class="card-title">{{ doctor.name }}</h6>
                  <p class="text-muted">{{ doctor.specialty }}</p>
                  <p class="card-text">{{ doctor.bio }}</p>
                  <small class="text-muted">{{ doctor.qualifications }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Example 3: Firestore Hospital Services -->
      <div class="card mb-4">
        <div class="card-header">
          <h5>3. Hospital Services (From Firestore)</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-4 mb-3" *ngFor="let service of translatedServices | async">
              <div class="card h-100">
                <div class="card-body">
                  <h6 class="card-title">{{ service.name }}</h6>
                  <p class="card-text">{{ service.description }}</p>
                  <ul class="list-unstyled">
                    <li><strong>Department:</strong> {{ service.department }}</li>
                    <li><strong>Duration:</strong> {{ service.duration }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Example 4: Mixed Content -->
      <div class="card mb-4">
        <div class="card-header">
          <h5>4. Mixed Content (Static + Dynamic + Translation Keys)</h5>
        </div>
        <div class="card-body">
          <div class="alert alert-info">
            <h6>{{ 'MAKE_APPOINTMENT' | autoTranslate }}</h6> <!-- Translation key -->
            <p>{{ 'Book your appointment with our specialist doctors today!' | autoTranslate }}</p> <!-- Dynamic text -->
            <p>{{ appointmentInfo | autoTranslate }}</p> <!-- Variable -->
          </div>
        </div>
      </div>

      <!-- Example 5: Real-time User Input Translation -->
      <div class="card mb-4">
        <div class="card-header">
          <h5>5. Real-time Translation</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <label class="form-label">Enter your message (English):</label>
              <textarea class="form-control mb-3"
                        [(ngModel)]="realTimeInput"
                        rows="3"
                        placeholder="Type your message here..."></textarea>
            </div>
            <div class="col-md-6">
              <label class="form-label">Automatically Translated:</label>
              <div class="border p-3 bg-light rounded" style="min-height: 100px;">
                {{ realTimeInput | autoTranslate }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Info -->
      <div class="card">
        <div class="card-header">
          <h5>📈 Performance Info</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <strong>Current Language:</strong> {{ currentLanguage }}
            </div>
            <div class="col-md-4">
              <strong>Cache Size:</strong> {{ cacheSize }}
            </div>
            <div class="col-md-4">
              <button class="btn btn-sm btn-outline-danger" (click)="clearCache()">
                Clear Cache
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      margin-bottom: 20px;
    }
    .form-control {
      margin-bottom: 10px;
    }
    .alert {
      border-left: 4px solid #007bff;
    }
  `]
})
export class RuntimeTranslationComponent implements OnInit {
  selectedLanguage = 'en';
  currentLanguage = 'en';
  cacheSize = 0;

  // Dynamic content examples
  dynamicWelcomeMessage = 'Welcome to The Cure Globe - Your health is our priority';
  userMessage = 'We are committed to providing world-class medical care';
  userInput = '';
  realTimeInput = '';
  appointmentInfo = 'Schedule your consultation with our expert medical team';

  // Simulated Firestore data
  mockDoctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology and Heart Surgery',
      bio: 'Dr. Johnson is a leading cardiologist with over 15 years of experience in treating complex heart conditions. She specializes in minimally invasive cardiac procedures.',
      qualifications: 'MD from Harvard Medical School, Fellowship in Interventional Cardiology'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Neurology and Brain Surgery',
      bio: 'Dr. Chen is renowned for his expertise in neurological disorders and brain surgery. He has performed over 2000 successful brain operations.',
      qualifications: 'MD from Stanford University, Board Certified Neurosurgeon'
    }
  ];

  mockServices = [
    {
      id: 1,
      name: 'Cardiac Surgery',
      description: 'Advanced heart surgery using state-of-the-art technology and minimally invasive techniques for faster recovery.',
      department: 'Cardiology Department',
      duration: '3-6 hours'
    },
    {
      id: 2,
      name: 'Brain Tumor Surgery',
      description: 'Precision brain tumor removal using advanced imaging and surgical techniques to ensure patient safety.',
      department: 'Neurology Department',
      duration: '4-8 hours'
    },
    {
      id: 3,
      name: 'Kidney Transplant',
      description: 'Complete kidney transplant services with experienced surgical team and comprehensive post-operative care.',
      department: 'Nephrology Department',
      duration: '5-7 hours'
    }
  ];

  translatedDoctors: Observable<any[]> = of([]);
  translatedServices: Observable<any[]> = of([]);

  constructor(
    private firestoreTranslate: FirestoreTranslateService,
    private i18n: TranslationService
  ) {}

  ngOnInit(): void {
    this.updateTranslations();
    this.updateCacheSize();

    // Listen to language changes
    this.i18n.getLanguageChanges().subscribe(lang => {
      this.currentLanguage = lang;
      this.updateTranslations();
      this.updateCacheSize();
    });
  }

  changeLanguage(): void {
    this.i18n.setLanguage(this.selectedLanguage);
  }

  updateTranslations(): void {
    // Translate doctor data
    this.translatedDoctors = this.firestoreTranslate.translateDocuments(
      this.mockDoctors,
      ['name', 'specialty', 'bio', 'qualifications']
    );

    // Translate service data
    this.translatedServices = this.firestoreTranslate.translateDocuments(
      this.mockServices,
      ['name', 'description', 'department', 'duration']
    );
  }

  clearCache(): void {
    this.firestoreTranslate.clearCache();
    this.updateCacheSize();
  }

  updateCacheSize(): void {
    this.cacheSize = this.firestoreTranslate.getCacheSize();
  }
}