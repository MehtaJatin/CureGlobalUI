import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../i18n/translation.service';
import { MachineTranslateService } from '../i18n/mt.service';

@Component({
  selector: 'app-translation-manager',
  template: `
    <div class="container mt-4">
      <h2>Translation Manager</h2>
      <div class="row">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5>Translation Completeness</h5>
            </div>
            <div class="card-body">
              <div *ngFor="let item of completenessStats | keyvalue" class="mb-3">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="fw-bold text-uppercase">{{ item.key }}:</span>
                  <span>{{ item.value.translated }} / {{ item.value.total }}</span>
                </div>
                <div class="progress">
                  <div class="progress-bar"
                       [style.width.%]="item.value.percentage"
                       [class]="getProgressBarClass(item.value.percentage)">
                    {{ item.value.percentage }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5>Auto-Translation Actions</h5>
            </div>
            <div class="card-body">
              <button class="btn btn-primary mb-3 w-100"
                      (click)="generateAllMissing()"
                      [disabled]="isGenerating">
                <span *ngIf="isGenerating" class="spinner-border spinner-border-sm me-2"></span>
                Generate All Missing Translations
              </button>
              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <label class="form-label">Select Languages to Update:</label>
                  <button class="btn btn-sm btn-outline-secondary" (click)="toggleLanguageView()">
                    {{ showAllLanguages ? 'Show Popular Only' : 'Show All Languages' }}
                  </button>
                </div>
                <div class="form-check" *ngFor="let lang of getDisplayLanguages()">
                  <input class="form-check-input" type="checkbox"
                         [id]="'lang-' + lang"
                         [(ngModel)]="selectedLanguages[lang]">
                  <label class="form-check-label" [for]="'lang-' + lang">
                    <span class="badge bg-secondary me-2">{{ lang.toUpperCase() }}</span>
                    {{ getLanguageName(lang) }}
                  </label>
                </div>
              </div>
              <button class="btn btn-success w-100"
                      (click)="generateSelectedLanguages()"
                      [disabled]="isGenerating || !hasSelectedLanguages()">
                <span *ngIf="isGenerating" class="spinner-border spinner-border-sm me-2"></span>
                Generate Selected Languages
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-4" *ngIf="missingTranslations.size > 0">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5>Missing Translations (For Manual Review)</h5>
            </div>
            <div class="card-body">
              <div *ngFor="let item of missingTranslationsArray" class="mb-3">
                <h6 class="text-uppercase">{{ item.language }}:</h6>
                <div class="alert alert-warning">
                  <small>{{ item.texts.join(', ') }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5>Manual Translation Tool</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-4">
                  <label class="form-label">Text to Translate:</label>
                  <textarea class="form-control" rows="3" [(ngModel)]="manualText"
                            placeholder="Enter text to translate..."></textarea>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Target Language:</label>
                  <select class="form-select" [(ngModel)]="manualTargetLang">
                    <option *ngFor="let lang of availableLanguages" [value]="lang">
                      {{ getLanguageName(lang) }}
                    </option>
                  </select>
                  <button class="btn btn-outline-primary mt-2 w-100"
                          (click)="translateManualText()"
                          [disabled]="!manualText">
                    Translate
                  </button>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Translation Result:</label>
                  <textarea class="form-control" rows="3" [value]="manualResult" readonly></textarea>
                  <button class="btn btn-outline-success mt-2 w-100"
                          (click)="copyToClipboard(manualResult)"
                          [disabled]="!manualResult">
                    Copy Result
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4" *ngIf="statusMessage">
        <div class="alert" [class]="'alert-' + (statusType === 'error' ? 'danger' : statusType)">
          {{ statusMessage }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .progress {
      height: 20px;
    }
    .card {
      margin-bottom: 20px;
    }
    .spinner-border-sm {
      width: 1rem;
      height: 1rem;
    }
  `]
})
export class TranslationManagerComponent implements OnInit {
  completenessStats: Record<string, { total: number; translated: number; percentage: number }> = {};
  missingTranslations = new Map<string, string[]>();
  missingTranslationsArray: Array<{ language: string; texts: string[] }> = [];

  availableLanguages: string[] = [];
  allLanguages: Record<string, string> = {};
  selectedLanguages: Record<string, boolean> = {};
  showAllLanguages = false;

  isGenerating = false;
  statusMessage = '';
  statusType: 'success' | 'warning' | 'error' = 'success';

  // Manual translation tool
  manualText = '';
  manualTargetLang = 'hi';
  manualResult = '';

  constructor(
    private translation: TranslationService,
    private machineTranslate: MachineTranslateService
  ) {}

  ngOnInit(): void {
    // Initialize languages
    this.allLanguages = {}; // this.autoTranslate.getAllLanguages();
    this.availableLanguages = []; // this.autoTranslate.getPopularLanguages();

    // Initialize selected languages
    this.availableLanguages.forEach(lang => {
      this.selectedLanguages[lang] = false;
    });

    this.updateStats();
    this.updateMissingTranslations();
  }

  updateStats(): void {
    this.completenessStats = {}; // this.autoTranslate.getTranslationCompleteness();
  }

  updateMissingTranslations(): void {
    this.missingTranslations = this.machineTranslate.getMissingTranslations();
    this.missingTranslationsArray = Array.from(this.missingTranslations.entries())
      .map(([language, texts]) => ({ language, texts }));
  }

  generateAllMissing(): void {
    this.isGenerating = false;
    this.statusMessage = 'Auto-translate service not available';
    this.statusType = 'warning';

    // Auto-translate service methods disabled
  }

  generateSelectedLanguages(): void {
    const selected = Object.keys(this.selectedLanguages)
      .filter(lang => this.selectedLanguages[lang]);

    if (selected.length === 0) return;

    this.isGenerating = false;
    this.statusMessage = 'Auto-translate service not available';
    this.statusType = 'warning';

    // Auto-translate service methods disabled
  }

  hasSelectedLanguages(): boolean {
    return Object.values(this.selectedLanguages).some(selected => selected);
  }

  translateManualText(): void {
    if (!this.manualText) return;

    this.machineTranslate.translate(this.manualText, 'en', this.manualTargetLang)
      .subscribe({
        next: (result) => {
          this.manualResult = result;
        },
        error: (error) => {
          this.manualResult = 'Translation failed: ' + error.message;
        }
      });
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.statusMessage = 'Copied to clipboard!';
      this.statusType = 'success';
      setTimeout(() => this.statusMessage = '', 3000);
    });
  }

  getProgressBarClass(percentage: number): string {
    if (percentage >= 90) return 'bg-success';
    if (percentage >= 70) return 'bg-warning';
    return 'bg-danger';
  }

  toggleLanguageView(): void {
    this.showAllLanguages = !this.showAllLanguages;

    // Reset selected languages when switching views
    Object.keys(this.selectedLanguages).forEach(lang => {
      this.selectedLanguages[lang] = false;
    });

    // Initialize new languages
    this.getDisplayLanguages().forEach(lang => {
      if (!(lang in this.selectedLanguages)) {
        this.selectedLanguages[lang] = false;
      }
    });
  }

  getDisplayLanguages(): string[] {
    return this.showAllLanguages
      ? [] // this.autoTranslate.getAvailableLanguageCodes()
      : this.availableLanguages;
  }

  getLanguageName(code: string): string {
    return this.allLanguages[code] || code.toUpperCase();
  }
}
