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

    // Check if it's likely a translation key (more specific pattern)
    // Only consider it a translation key if it has underscores or starts with specific prefixes
    if (/^[A-Z0-9_\.]+$/.test(text) && (text.includes('_') || text.startsWith('SVC_') || text.startsWith('NAV_') || text.startsWith('BTN_'))) {
      const cacheKey = `${text}_${lang}`;

      // Return cached translation if available
      if (this.translationCache.has(cacheKey)) {
        return of(this.translationCache.get(cacheKey)!);
      }

      // Only check translation once per key per language
      if (!this.checkedKeys.has(cacheKey)) {
        this.checkedKeys.add(cacheKey);
        const translated = this.i18n.translate(text);
        this.translationCache.set(cacheKey, translated);
        return of(translated);
      }

      // If already checked and not found, return the original text
      return of(text);
    }

    // For machine translation
    if (this.lastInput === text && this.lastLang === lang)
      return this.lastOutput$;
    this.lastInput = text;
    this.lastLang = lang;
    this.lastOutput$ = this.mt.translate(text, 'auto', lang);
    return this.lastOutput$;
  }
}
