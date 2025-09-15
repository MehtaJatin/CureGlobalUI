import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MachineTranslateService } from './mt.service';
import { TranslationService } from './translation.service';

@Pipe({ name: 'mt', pure: false })
export class MachineTranslatePipe implements PipeTransform {
  private lastInput: string | null = null;
  private lastLang: string | null = null;
  private lastOutput$: Observable<string> = of('');
  private translationCache: Map<string, string> = new Map();
  private checkedKeys: Set<string> = new Set();

  constructor(
    private mt: MachineTranslateService,
    private i18n: TranslationService
  ) {}

  transform(value: string | null | undefined): Observable<string> {
    const text = value || '';
    const lang = this.i18n.getCurrentLanguage();

    // Skip if empty or already English
    if (!text || lang === 'en') {
      return of(text);
    }

    // Check if it's a translation key pattern (uppercase with underscores)
    const isTranslationKey = /^[A-Z_][A-Z0-9_]*$/.test(text);

    if (isTranslationKey) {
      // Handle translation keys through i18n service first
      const cacheKey = `${text}_${lang}`;

      // Return cached translation if available
      if (this.translationCache.has(cacheKey)) {
        return of(this.translationCache.get(cacheKey)!);
      }

      // Only check translation once per key per language
      if (!this.checkedKeys.has(cacheKey)) {
        this.checkedKeys.add(cacheKey);
        const translated = this.i18n.translate(text);

        // If translation found and different from key, use it
        if (translated !== text) {
          this.translationCache.set(cacheKey, translated);
          return of(translated);
        }
      }

      // If no translation found for key, treat as regular text
    }

    // For all text (including dynamic content from Firestore), use machine translation
    if (this.lastInput === text && this.lastLang === lang) {
      return this.lastOutput$;
    }

    this.lastInput = text;
    this.lastLang = lang;

    // Use machine translation for all text
    this.lastOutput$ = this.mt.translate(text, 'en', lang);
    return this.lastOutput$;
  }
}
