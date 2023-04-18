import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { OAuthModule } from 'angular-oauth2-oidc';
import { HttpModule } from './_metronic/shared/http/http.module';
import { SsoModule } from './_metronic/shared/sso/sso.module';

// UseIcon
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

// Set locales vietnamese
import vi from '@angular/common/locales/vi';
import { DatePipe, registerLocaleData } from '@angular/common';
import { RouteReuseService } from './_metronic/shared/shared/services/route-reuse.service';
import { RouteReuseStrategy } from '@angular/router';
import { ItRequestComponent } from './modules/it-request/it-request.component';
registerLocaleData(vi);

@NgModule({
  declarations: [AppComponent, ItRequestComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    ClipboardModule,
    AppRoutingModule,
    HttpModule,
    InlineSVGModule.forRoot(),
    NgbModule,
    NzSpinModule,
    SsoModule,
    OAuthModule.forRoot()
  ],
  providers: [
    DatePipe,
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_ICONS, useValue: icons },
    // { provide: RouteReuseStrategy, useClass: RouteReuseService }, // Lazy module customize
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
