import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from './translation.service';

type LocalizedValue =
  | string
  | { [langCode: string]: string }
  | null
  | undefined;

@Pipe({ name: 'localize', pure: false })
export class LocalizePipe implements PipeTransform {
  constructor(private i18n: TranslationService) {}

  transform(value: LocalizedValue, fallbackKey?: string): string {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    const lang = this.i18n.getCurrentLanguage();
    if (value[lang]) return value[lang];
    if (value['en']) return value['en'];
    if (fallbackKey && value[fallbackKey]) return value[fallbackKey];
    // As a last resort, return the first available translation
    const first = Object.values(value).find((v) => !!v);
    return typeof first === 'string' ? first : '';
  }
}
