import { ChangeDetectorRef } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from './translation.service';

@Pipe({ name: 't', pure: false })
export class TranslatePipe implements PipeTransform {
  constructor(
    private i18n: TranslationService,
    private cdr: ChangeDetectorRef
  ) {
    this.i18n.getLanguageChanges().subscribe(() => this.cdr.markForCheck());
    this.i18n.getVersionChanges().subscribe(() => this.cdr.markForCheck());
  }
  transform(value: string): string {
    return this.i18n.translate(value || '');
  }
}
