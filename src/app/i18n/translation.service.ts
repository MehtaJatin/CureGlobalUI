import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

type Translations = Record<string, string>;

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private currentLang$ = new BehaviorSubject<string>('en');
  private dictionaries: Record<string, Translations> = {};

  constructor(private http: HttpClient) {
    // Preload English as fallback
    this.load('en').subscribe();
  }

  setLanguage(lang: string): void {
    if (this.currentLang$.value !== lang) {
      this.currentLang$.next(lang);
    }
    if (!this.dictionaries[lang]) {
      this.load(lang).subscribe();
    }
  }

  getLanguageChanges(): Observable<string> {
    return this.currentLang$.asObservable();
  }

  getCurrentLanguage(): string {
    return this.currentLang$.value;
  }

  translate(key: string): string {
    const lang = this.currentLang$.value;
    const dict = this.dictionaries[lang];
    if (dict && key in dict) return dict[key];
    const fallback = this.dictionaries['en'];
    if (fallback && key in fallback) return fallback[key];
    return key;
  }

  private load(lang: string): Observable<Translations> {
    const obs = this.http.get<Translations>(`assets/i18n/${lang}.json`);
    obs.subscribe({
      next: (dict) => (this.dictionaries[lang] = dict || {}),
      error: () => (this.dictionaries[lang] = {}),
    });
    return obs;
  }
}
