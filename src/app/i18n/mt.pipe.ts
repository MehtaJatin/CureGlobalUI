import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MachineTranslateService } from './mt.service';
import { TranslationService } from './translation.service';

@Pipe({ name: 'mt', pure: false })
export class MachineTranslatePipe implements PipeTransform {
  private lastInput: string | null = null;
  private lastLang: string | null = null;
  private lastOutput$: Observable<string> = of('');

  constructor(
    private mt: MachineTranslateService,
    private i18n: TranslationService
  ) {}

  transform(value: string | null | undefined): Observable<string> {
    const text = value || '';
    const lang = this.i18n.getCurrentLanguage();
    if (/^[A-Z0-9_\.]+$/.test(text)) {
      return of(this.i18n.translate(text));
    }
    if (this.lastInput === text && this.lastLang === lang)
      return this.lastOutput$;
    this.lastInput = text;
    this.lastLang = lang;
    this.lastOutput$ = this.mt.translate(text, 'auto', lang);
    return this.lastOutput$;
  }
}
