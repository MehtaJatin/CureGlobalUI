import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

type Translations = Record<string, string>;

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private currentLang$ = new BehaviorSubject<string>('en');
  private version$ = new BehaviorSubject<number>(0);
  private dictionaries: Record<string, Translations> = {};

  constructor(private http: HttpClient) {
    // Preload common languages so keys resolve immediately
    ['en', 'hi', 'pa', 'it', 'es'].forEach((lng) => this.load(lng).subscribe());
  }

  setLanguage(lang: string): void {
    const supported = ['en', 'hi', 'pa', 'it', 'es'];
    const normalized = supported.includes(lang) ? lang : 'en';
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

  getVersionChanges(): Observable<number> {
    return this.version$.asObservable();
  }

  translate(key: string): string {
    const lang = this.currentLang$.value;
    const dict = this.dictionaries[lang];
    if (dict && key in dict) return dict[key];
    const fallback = this.dictionaries['en'];
    if (fallback && key in fallback) return fallback[key];
    console.warn(
      `[i18n] Missing key '${key}' for lang '${lang}' and fallback 'en'`
    );
    return key;
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
