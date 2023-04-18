import { SharedModule } from 'src/app/_metronic/shared/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NewsComponent } from './components/news/news.component';
import { NewsDetailComponent } from './components/news-detail/news-detail.component';
import { OverviewComponent } from './components/overview/overview.component';
import { TranslationModule } from 'src/app/_metronic/shared/i18n/translation.module';
import { AngularCalendarModule } from 'src/app/_metronic/shared/angular-calendar/angular-calendar.module';
import { NgZorroAntdModule } from 'src/app/_metronic/shared/ng-zorro-antd/ng-zorro-antd.module';
import { SliderModule } from 'src/app/_metronic/shared/slider/slider.module';
import { KyNiemComponent } from './components/ky-niem/ky-niem.component';


@NgModule({
  declarations: [
    HomeComponent,
    OverviewComponent,
    NewsComponent,
    NewsDetailComponent,
    KyNiemComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    AngularCalendarModule,
    SharedModule,
    NgZorroAntdModule,
    TranslationModule,
    SliderModule
  ]
})
export class HomeModule { }
