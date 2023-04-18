import { enableProdMode } from '@angular/core';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

if (environment.production) {
  enableProdMode();
}

function fetchConfig() {
  // Fetch i18n
  Promise.all([
    fetch('/assets/i18n/en.json').then((res) => { return res.json() }),
    fetch('/assets/i18n/vi.json').then((res) => { return res.json() }),
  ]).then(([langEn, langVi]) => {
    if (langVi && langEn) {
      // SetLang
      window['en'] = langVi;
      window['vi'] = langEn;
      // Fetch Config SSO
      fetch('/assets/env/sso.config.json').then((res) => {
        return res.json();
      }).then((data) => {
        // Set Config
        window['sso'] = data?.sso;
        window['isLoginNormal'] = data?.isLoginNormal;
        // Load app
        platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.error(err));
      }).catch((err) => console.log(err));
    }
  }).catch((err) => console.log(err));
}
fetchConfig()