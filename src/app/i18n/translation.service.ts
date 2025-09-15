import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

type Translations = Record<string, string>;

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private currentLang$ = new BehaviorSubject<string>('en');
  private version$ = new BehaviorSubject<number>(0);
  private dictionaries: Record<string, Translations> = {};

  // All supported languages
  private supportedLanguages = [
    'af', 'sq', 'am', 'ar', 'hy', 'az', 'eu', 'be', 'bn', 'bs', 'bg', 'ca', 'ceb', 'ny',
    'zh-CN', 'zh-TW', 'co', 'hr', 'cs', 'da', 'nl', 'en', 'eo', 'et', 'tl', 'fi', 'fr',
    'fy', 'gl', 'ka', 'de', 'el', 'gu', 'ht', 'ha', 'haw', 'iw', 'hi', 'hmn', 'hu', 'is',
    'ig', 'id', 'ga', 'it', 'ja', 'jw', 'kn', 'kk', 'km', 'ko', 'ku', 'ky', 'lo', 'la',
    'lv', 'lt', 'lb', 'mk', 'mg', 'ms', 'ml', 'mt', 'mi', 'mr', 'mn', 'my', 'ne', 'no',
    'ps', 'fa', 'pl', 'pt', 'pa', 'ro', 'ru', 'sm', 'gd', 'sr', 'st', 'sn', 'sd', 'si',
    'sk', 'sl', 'so', 'es', 'su', 'sw', 'sv', 'tg', 'ta', 'te', 'th', 'tr', 'uk', 'ur',
    'uz', 'vi', 'cy', 'xh', 'yi', 'yo', 'zu'
  ];

  constructor(private http: HttpClient) {
    // Preload core languages so keys resolve immediately
    ['en', 'hi', 'pa', 'it', 'es', 'fr', 'de', 'pt', 'ru', 'ar', 'ja', 'ko', 'zh-CN'].forEach((lng) =>
      this.load(lng).subscribe()
    );
  }

  setLanguage(lang: string): void {
    const normalized = this.supportedLanguages.includes(lang) ? lang : 'en';
    if (this.currentLang$.value !== normalized) {
      this.currentLang$.next(normalized);
    }
    if (!this.dictionaries[normalized]) {
      this.load(normalized).subscribe();
    }
  }

  getLanguageChanges(): Observable<string> {
    return this.currentLang$.asObservable();
  }

  getCurrentLanguage(): string {
    return this.currentLang$.value;
  }

  getSupportedLanguages(): string[] {
    return this.supportedLanguages;
  }

  getVersionChanges(): Observable<number> {
    return this.version$.asObservable();
  }

  translate(key: string): string {
    const lang = this.currentLang$.value;

    // Skip translation if current language is English
    if (lang === 'en') return key;

    // Check if translation exists in dictionary
    const dict = this.dictionaries[lang];
    if (dict && key in dict) return dict[key];

    // Check fallback dictionary
    const fallback = this.dictionaries['en'];
    if (fallback && key in fallback) return fallback[key];

    // For dynamic content or missing keys, return the original text
    // The machine translation pipe will handle runtime translation
    return key;
  }

  /**
   * Check if text is likely a translation key or natural text
   */
  isTranslationKey(text: string): boolean {
    // Consider it a key if it's all uppercase with underscores
    return /^[A-Z_][A-Z0-9_]*$/.test(text);
  }

  /**
   * Get translation with automatic fallback to machine translation
   */
  getTranslationWithFallback(text: string): string {
    const lang = this.currentLang$.value;

    // Skip if English or if it's clearly a translation key pattern
    if (lang === 'en' || this.isTranslationKey(text)) {
      return this.translate(text);
    }

    // For natural text, return as-is - let the MT pipe handle it
    return text;
  }

  private load(lang: string): Observable<Translations> {
    const obs = this.http.get<Translations>(`assets/i18n/${lang}.json`);
    obs.subscribe({
      next: (dict) => {
        this.dictionaries[lang] = dict || {};
        this.version$.next(this.version$.value + 1);
      },
      error: (e) => {
        console.error(`[i18n] Failed loading ${lang}.json`, e);
        this.dictionaries[lang] = {};
      },
    });
    return obs;
  }
}
