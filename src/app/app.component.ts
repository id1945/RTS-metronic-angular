import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
} from '@angular/core';
// language list
// import { locale as enLang } from './_metronic/shared/i18n/vocabs/en';
// import { locale as viLang } from './_metronic/shared/i18n/vocabs/vi';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslationService } from './_metronic/shared/i18n/translation.service';
import { ApiService } from './_metronic/shared/http/api.service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private translationService: TranslationService,
    private router: Router,
    public api: ApiService,
  ) {
    this.loadTranslationFile();
  }

  private async loadTranslationFile() {
    // register translations
    this.translationService.loadTranslations(
      window['en'],
      window['vi'],
    );
  }

  public spinnerStyle = {
    width: '60px',
    height: '58px',
    position: 'fixed',
    margin: 'auto',
    zIndex: '9999999999999',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  ngOnInit() {
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {

        // scroll to top on every route change
        window.scrollTo(0, 0);

        // to display back the body content
        setTimeout(() => {
          document.body.classList.add('page-loaded');
        }, 500);
      }
    });
    this.unsubscribe.push(routerSubscription);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
