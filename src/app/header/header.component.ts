import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../i18n/translation.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  lang: string;
  constructor(private i18n: TranslationService) {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'en';
    this.i18n.setLanguage(this.lang);
  }

  changeLang(lang: string) {
    this.lang = lang;
    localStorage.setItem('lang', lang);
    this.i18n.setLanguage(lang);
  }
}
