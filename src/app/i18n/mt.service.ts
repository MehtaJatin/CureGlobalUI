import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { TranslationService } from './translation.service';

interface LibreTranslateResponse {
  translatedText: string;
}

interface GoogleTranslateResponse {
  sentences?: Array<{
    trans: string;
  }>;
}

interface MyMemoryResponse {
  responseData: {
    translatedText: string;
    match: number;
  };
}

@Injectable({ providedIn: 'root' })
export class MachineTranslateService {
  // Multiple translation services (CORS-friendly)
  private translationServices = [
    {
      name: 'MyMemory',
      url: 'https://api.mymemory.translated.net/get',
      method: 'GET'
    },
    {
      name: 'GoogleTranslate',
      url: 'https://translate.googleapis.com/translate_a/single',
      method: 'GET'
    }
  ];

  // Language mappings for different services
  private languageMappings: Record<string, Record<string, string>> = {
    mymemory: {
      // Direct mappings for MyMemory supported languages
      'af': 'af', 'sq': 'sq', 'am': 'am', 'ar': 'ar', 'hy': 'hy', 'az': 'az', 'eu': 'eu', 'be': 'be',
      'bn': 'bn', 'bs': 'bs', 'bg': 'bg', 'ca': 'ca', 'zh-CN': 'zh', 'zh-TW': 'zh', 'hr': 'hr',
      'cs': 'cs', 'da': 'da', 'nl': 'nl', 'en': 'en', 'eo': 'eo', 'et': 'et', 'tl': 'tl', 'fi': 'fi',
      'fr': 'fr', 'gl': 'gl', 'ka': 'ka', 'de': 'de', 'el': 'el', 'gu': 'gu', 'ht': 'ht', 'ha': 'ha',
      'iw': 'he', 'hi': 'hi', 'hu': 'hu', 'is': 'is', 'id': 'id', 'ga': 'ga', 'it': 'it', 'ja': 'ja',
      'kn': 'kn', 'kk': 'kk', 'km': 'km', 'ko': 'ko', 'ky': 'ky', 'lo': 'lo', 'la': 'la', 'lv': 'lv',
      'lt': 'lt', 'mk': 'mk', 'mg': 'mg', 'ms': 'ms', 'ml': 'ml', 'mt': 'mt', 'mi': 'mi', 'mr': 'mr',
      'mn': 'mn', 'my': 'my', 'ne': 'ne', 'no': 'no', 'ps': 'ps', 'fa': 'fa', 'pl': 'pl', 'pt': 'pt',
      'pa': 'pa', 'ro': 'ro', 'ru': 'ru', 'sr': 'sr', 'si': 'si', 'sk': 'sk', 'sl': 'sl', 'so': 'so',
      'es': 'es', 'sw': 'sw', 'sv': 'sv', 'tg': 'tg', 'ta': 'ta', 'te': 'te', 'th': 'th', 'tr': 'tr',
      'uk': 'uk', 'ur': 'ur', 'uz': 'uz', 'vi': 'vi', 'cy': 'cy', 'yi': 'yi', 'yo': 'yo', 'zu': 'zu',
      // Fallbacks for unsupported languages
      'ceb': 'tl', 'ny': 'sw', 'co': 'fr', 'fy': 'nl', 'haw': 'en', 'hmn': 'zh', 'ig': 'en',
      'jw': 'id', 'ku': 'tr', 'lb': 'de', 'sm': 'en', 'gd': 'ga', 'st': 'zu', 'sn': 'sw',
      'sd': 'ur', 'su': 'id', 'xh': 'zu'
    },
    google: {
      // Google Translate supports more languages directly
      'af': 'af', 'sq': 'sq', 'am': 'am', 'ar': 'ar', 'hy': 'hy', 'az': 'az', 'eu': 'eu', 'be': 'be',
      'bn': 'bn', 'bs': 'bs', 'bg': 'bg', 'ca': 'ca', 'ceb': 'ceb', 'ny': 'ny', 'zh-CN': 'zh-cn',
      'zh-TW': 'zh-tw', 'co': 'co', 'hr': 'hr', 'cs': 'cs', 'da': 'da', 'nl': 'nl', 'en': 'en',
      'eo': 'eo', 'et': 'et', 'tl': 'tl', 'fi': 'fi', 'fr': 'fr', 'fy': 'fy', 'gl': 'gl', 'ka': 'ka',
      'de': 'de', 'el': 'el', 'gu': 'gu', 'ht': 'ht', 'ha': 'ha', 'haw': 'haw', 'iw': 'iw', 'hi': 'hi',
      'hmn': 'hmn', 'hu': 'hu', 'is': 'is', 'ig': 'ig', 'id': 'id', 'ga': 'ga', 'it': 'it', 'ja': 'ja',
      'jw': 'jw', 'kn': 'kn', 'kk': 'kk', 'km': 'km', 'ko': 'ko', 'ku': 'ku', 'ky': 'ky', 'lo': 'lo',
      'la': 'la', 'lv': 'lv', 'lt': 'lt', 'lb': 'lb', 'mk': 'mk', 'mg': 'mg', 'ms': 'ms', 'ml': 'ml',
      'mt': 'mt', 'mi': 'mi', 'mr': 'mr', 'mn': 'mn', 'my': 'my', 'ne': 'ne', 'no': 'no', 'ps': 'ps',
      'fa': 'fa', 'pl': 'pl', 'pt': 'pt', 'pa': 'pa', 'ro': 'ro', 'ru': 'ru', 'sm': 'sm', 'gd': 'gd',
      'sr': 'sr', 'st': 'st', 'sn': 'sn', 'sd': 'sd', 'si': 'si', 'sk': 'sk', 'sl': 'sl', 'so': 'so',
      'es': 'es', 'su': 'su', 'sw': 'sw', 'sv': 'sv', 'tg': 'tg', 'ta': 'ta', 'te': 'te', 'th': 'th',
      'tr': 'tr', 'uk': 'uk', 'ur': 'ur', 'uz': 'uz', 'vi': 'vi', 'cy': 'cy', 'xh': 'xh', 'yi': 'yi',
      'yo': 'yo', 'zu': 'zu'
    }
  };

  private cache = new Map<string, Observable<string>>();
  private missingTranslations = new Map<string, string[]>();

  constructor(private http: HttpClient, private i18n: TranslationService) {}

  translate(
    text: string,
    sourceLang?: string,
    targetLang?: string
  ): Observable<string> {
    const target = targetLang || this.i18n.getCurrentLanguage();

    // Skip translation if text is empty or already in target language
    if (!text || !target || target === 'en') return of(text);

    const key = `${text}::${sourceLang || 'auto'}::${target}`;

    // Return cached translation if available
    if (this.cache.has(key)) return this.cache.get(key)!;

    const req$ = this.translateWithServices(text, sourceLang || 'en', target, 0);
    this.cache.set(key, req$);
    return req$;
  }

  private translateWithServices(text: string, source: string, target: string, serviceIndex: number): Observable<string> {
    if (serviceIndex >= this.translationServices.length) {
      // All services failed, store for batch processing and return original text
      this.storeMissingTranslation(text, target);
      return of(text);
    }

    const service = this.translationServices[serviceIndex];

    switch (service.name) {
      case 'MyMemory':
        return this.translateWithMyMemory(text, source, target, serviceIndex);
      case 'GoogleTranslate':
        return this.translateWithGoogleTranslate(text, source, target, serviceIndex);
      default:
        return this.translateWithServices(text, source, target, serviceIndex + 1);
    }
  }

  private translateWithMyMemory(text: string, source: string, target: string, serviceIndex: number): Observable<string> {
    const mappedTarget = this.languageMappings['mymemory']?.[target] || target;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${mappedTarget}`;

    return this.http.get<MyMemoryResponse>(url).pipe(
      map(response => {
        const translatedText = response?.responseData?.translatedText;
        if (translatedText && translatedText.toLowerCase() !== text.toLowerCase()) {
          return translatedText;
        }
        throw new Error('No translation found');
      }),
      catchError((error) => {
        console.warn(`MyMemory translation failed:`, error);
        // Try next service
        return this.translateWithServices(text, source, target, serviceIndex + 1);
      }),
      shareReplay(1)
    );
  }

  private translateWithGoogleTranslate(text: string, source: string, target: string, serviceIndex: number): Observable<string> {
    const mappedTarget = this.languageMappings['google']?.[target] || target;
    // Use Google Translate's public API endpoint (may have limitations)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${mappedTarget}&dt=t&q=${encodeURIComponent(text)}`;

    return this.http.get<any>(url).pipe(
      map(response => {
        if (response && Array.isArray(response) && response[0] && Array.isArray(response[0]) && response[0][0]) {
          const translatedText = response[0][0][0];
          if (translatedText && translatedText.toLowerCase() !== text.toLowerCase()) {
            return translatedText;
          }
        }
        throw new Error('No translation found');
      }),
      catchError((error) => {
        console.warn(`Google Translate failed:`, error);
        // Try next service
        return this.translateWithServices(text, source, target, serviceIndex + 1);
      }),
      shareReplay(1)
    );
  }

  private storeMissingTranslation(text: string, targetLang: string): void {
    if (!this.missingTranslations.has(targetLang)) {
      this.missingTranslations.set(targetLang, []);
    }
    const missing = this.missingTranslations.get(targetLang)!;
    if (!missing.includes(text)) {
      missing.push(text);
    }
  }

  // Method to get all missing translations for manual processing
  getMissingTranslations(): Map<string, string[]> {
    return this.missingTranslations;
  }

  // Method to clear missing translations after manual processing
  clearMissingTranslations(targetLang?: string): void {
    if (targetLang) {
      this.missingTranslations.delete(targetLang);
    } else {
      this.missingTranslations.clear();
    }
  }
}
