import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from './translation.service';

@Pipe({ name: 't', pure: false })
export class TranslatePipe implements PipeTransform {
  constructor(private i18n: TranslationService) {}
  transform(value: string): string {
    return this.i18n.translate(value);
  }
}
