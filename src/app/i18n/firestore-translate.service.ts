import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MachineTranslateService } from './mt.service';
import { TranslationService } from './translation.service';

/**
 * Service for translating Firestore documents and dynamic data
 */
@Injectable({ providedIn: 'root' })
export class FirestoreTranslateService {
  private documentCache = new Map<string, any>();

  constructor(
    private mt: MachineTranslateService,
    private i18n: TranslationService
  ) {}

  /**
   * Translate any object/document with specified fields
   * @param data - The data object from Firestore
   * @param fieldsToTranslate - Array of field names to translate
   * @param targetLang - Target language (optional, uses current language)
   */
  translateDocument(
    data: any,
    fieldsToTranslate: string[],
    targetLang?: string
  ): Observable<any> {
    const lang = targetLang || this.i18n.getCurrentLanguage();

    // Skip if English
    if (lang === 'en' || !data) {
      return of(data);
    }

    const cacheKey = `${JSON.stringify(data)}_${lang}_${fieldsToTranslate.join(',')}`;

    // Return cached if available
    if (this.documentCache.has(cacheKey)) {
      return of(this.documentCache.get(cacheKey));
    }

    // Create translation tasks for each field
    const translationTasks: Observable<{field: string, value: string}>[] = [];

    fieldsToTranslate.forEach(field => {
      if (data[field] && typeof data[field] === 'string') {
        const translationTask = this.mt.translate(data[field], 'en', lang).pipe(
          map(translatedValue => ({ field, value: translatedValue })),
          catchError(() => of({ field, value: data[field] })) // Fallback to original
        );
        translationTasks.push(translationTask);
      }
    });

    // If no fields to translate, return original
    if (translationTasks.length === 0) {
      return of(data);
    }

    // Execute all translations in parallel
    return forkJoin(translationTasks).pipe(
      map(results => {
        // Create new object with translated fields
        const translatedData = { ...data };

        results.forEach(({ field, value }) => {
          translatedData[field] = value;
        });

        // Cache the result
        this.documentCache.set(cacheKey, translatedData);
        return translatedData;
      }),
      catchError(() => of(data)) // Fallback to original data on error
    );
  }

  /**
   * Translate an array of documents
   * @param documents - Array of documents
   * @param fieldsToTranslate - Fields to translate in each document
   * @param targetLang - Target language
   */
  translateDocuments(
    documents: any[],
    fieldsToTranslate: string[],
    targetLang?: string
  ): Observable<any[]> {
    if (!documents || documents.length === 0) {
      return of(documents);
    }

    const translationTasks = documents.map(doc =>
      this.translateDocument(doc, fieldsToTranslate, targetLang)
    );

    return forkJoin(translationTasks);
  }

  /**
   * Translate specific text fields commonly found in medical/hospital data
   * @param data - The data object
   * @param targetLang - Target language
   */
  translateMedicalData(data: any, targetLang?: string): Observable<any> {
    const commonMedicalFields = [
      'name', 'title', 'description', 'specialty', 'speciality', 'specialities',
      'about', 'bio', 'summary', 'details', 'services', 'treatments',
      'qualifications', 'experience', 'location', 'address', 'department',
      'designation', 'expertise', 'procedures', 'conditions', 'symptoms'
    ];

    return this.translateDocument(data, commonMedicalFields, targetLang);
  }

  /**
   * Translate hospital data
   */
  translateHospitalData(hospital: any, targetLang?: string): Observable<any> {
    const hospitalFields = [
      'name', 'description', 'about', 'services', 'specialities',
      'address', 'location', 'facilities', 'departments', 'summary'
    ];

    return this.translateDocument(hospital, hospitalFields, targetLang);
  }

  /**
   * Translate doctor data
   */
  translateDoctorData(doctor: any, targetLang?: string): Observable<any> {
    const doctorFields = [
      'name', 'specialty', 'speciality', 'bio', 'about', 'qualifications',
      'experience', 'designation', 'department', 'expertise', 'languages',
      'education', 'awards', 'research'
    ];

    return this.translateDocument(doctor, doctorFields, targetLang);
  }

  /**
   * Translate service data
   */
  translateServiceData(service: any, targetLang?: string): Observable<any> {
    const serviceFields = [
      'name', 'title', 'description', 'details', 'benefits', 'procedures',
      'treatment', 'overview', 'preparation', 'recovery', 'risks'
    ];

    return this.translateDocument(service, serviceFields, targetLang);
  }

  /**
   * Real-time translation for form data or user input
   */
  translateUserContent(content: string, targetLang?: string): Observable<string> {
    const lang = targetLang || this.i18n.getCurrentLanguage();

    if (lang === 'en' || !content) {
      return of(content);
    }

    return this.mt.translate(content, 'en', lang);
  }

  /**
   * Clear translation cache (useful when language changes)
   */
  clearCache(): void {
    this.documentCache.clear();
  }

  /**
   * Get cache size for debugging
   */
  getCacheSize(): number {
    return this.documentCache.size;
  }
}
