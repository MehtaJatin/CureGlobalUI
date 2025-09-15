import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MachineTranslateService } from './mt.service';
import { TranslationService } from './translation.service';

/**
 * Universal Auto-Translation Pipe
 *
 * Automatically translates ANY text at runtime without requiring JSON files.
 * Perfect for dynamic content from Firestore, API responses, or any text.
 *
 * Usage:
 *   {{ 'Any text here' | autoTranslate }}
 *   {{ doctor.name | autoTranslate }}
 *   {{ hospital.description | autoTranslate }}
 *   {{ firestoreData.dynamicContent | autoTranslate }}
 */
@Pipe({ name: 'autoTranslate', pure: false })
export class AutoTranslatePipe implements PipeTransform {
  private translationCache = new Map<string, string>();
  private pendingTranslations = new Set<string>();
  private lastInput: string | null = null;
  private lastLang: string | null = null;
  private lastOutput: string = '';

  constructor(
    private mt: MachineTranslateService,
    private i18n: TranslationService
  ) {}

  transform(value: string | null | undefined): string {
    const text = (value || '').trim();
    const lang = this.i18n.getCurrentLanguage();

    // Return immediately if empty or English
    if (!text || lang === 'en') {
      return text;
    }

    // Create cache key
    const cacheKey = `${text}::${lang}`;

    // Return cached translation if available
    if (this.translationCache.has(cacheKey)) {
      return this.translationCache.get(cacheKey)!;
    }

    // If not in cache and not pending, start translation
    if (!this.pendingTranslations.has(cacheKey)) {
      this.pendingTranslations.add(cacheKey);

      // Start async translation directly with English text
      this.mt.translate(text, 'en', lang).subscribe({
        next: (translatedText) => {
          // Cache the result
          this.translationCache.set(cacheKey, translatedText);
          this.pendingTranslations.delete(cacheKey);

          // Trigger change detection by updating internal state
          if (this.lastInput === text && this.lastLang === lang) {
            this.lastOutput = translatedText;
          }
        },
        error: (error) => {
          console.warn(`Translation failed for "${text}":`, error);
          this.translationCache.set(cacheKey, text); // Fallback to original
          this.pendingTranslations.delete(cacheKey);
        }
      });
    }

    // Return original text while translation is pending
    // Once translation completes, Angular's change detection will re-run this pipe
    return this.translationCache.get(cacheKey) || text;
  }
}