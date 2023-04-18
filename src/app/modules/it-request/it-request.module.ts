import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItRequestRoutingModule } from './it-request-routing.module';
import { RequestListComponent } from './request-list/request-list.component';
import { FormRequestModalComponent } from './request-list/components/form-request-modal/form-request-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'src/app/_metronic/shared/ng-zorro-antd/ng-zorro-antd.module';
import { SharedModule } from 'src/app/_metronic/shared/shared/shared.module';
import { TranslationModule } from 'src/app/_metronic/shared/i18n/translation.module';


@NgModule({
  declarations: [RequestListComponent, FormRequestModalComponent],
  imports: [
    CommonModule,
    ItRequestRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    SharedModule,
    TranslationModule
  ]
})
export class ItRequestModule { }
