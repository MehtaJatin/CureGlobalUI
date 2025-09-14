import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { TranslationService } from './translation.service';

interface LibreTranslateResponse {
  translatedText: string;
}

@Injectable({ providedIn: 'root' })
export class MachineTranslateService {
  private endpoint = 'https://libretranslate.de/translate'; // public instance; consider hosting your own for reliability

  // Map app language codes to LibreTranslate supported targets
  private mapTarget(lang: string): string {
    // LibreTranslate supports: ar, az, zh, cs, da, nl, en, fi, fr, de, el, hi, hu, id, ga, it, ja, ko, fa, pl, pt, ru, sk, es, sv, tr, uk, ur, vi
    switch (lang) {
      case 'pa':
        return 'hi'; // Punjabi fallback to Hindi
      default:
        return lang;
    }
  }
  private cache = new Map<string, Observable<string>>();

  constructor(private http: HttpClient, private i18n: TranslationService) {}

  translate(
    text: string,
    sourceLang?: string,
    targetLang?: string
  ): Observable<string> {
    // Temporarily disable machine translation to avoid CORS issues
    // Return original text instead of calling external API
    return of(text);

    /* Original implementation commented out due to CORS issues:
    const target = this.mapTarget(targetLang || this.i18n.getCurrentLanguage());
    if (!text || !target) return of(text);
    // no-op if already target language marker like [xx] is present - skip
    const key = `${text}::${sourceLang || 'auto'}::${target}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const req$ = this.http
      .post<LibreTranslateResponse>(this.endpoint, {
        q: text,
        source: sourceLang || 'auto',
        target,
        format: 'text',
      })
      .pipe(
        map((r) => r?.translatedText || text),
        catchError(() => of(text)),
        shareReplay(1)
      );

    this.cache.set(key, req$);
    return req$;
    */
  }
}
