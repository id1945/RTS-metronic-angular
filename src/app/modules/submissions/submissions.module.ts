import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgxSummernoteModule } from 'ngx-summernote';
import { InlineSVGModule } from 'ng-inline-svg';

import { SubmissionsRoutingModule } from './submissions-routing.module';
import { SubmissionsComponent } from './submissions.component';
import { SubmissionsListComponent } from './submissions-list/submissions-list.component';
import { NgbDatepickerModule, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownMenusModule } from 'src/app/_metronic/partials/content/dropdown-menus/dropdown-menus.module';
import { SubmissionsCreateModalComponent } from './submissions-list/components/submissions-create-modal/submissions-create-modal.component';
import { SharedModule } from 'src/app/_metronic/shared/shared/shared.module';
import { SubmissionsDetailComponent } from './submissions-list/components/submissions-detail/submissions-detail.component';
import { ApproveModalComponent } from './submissions-list/components/submissions-detail/approve-modal/approve-modal.component';
import { ConsultationModalComponent } from './submissions-list/components/submissions-detail/consultation-modal/consultation-modal.component';
import { RequestsPaymentListComponent } from './requests-payment-list/requests-payment-list.component';
import { RequestsPaymentCreateModalComponent } from './requests-payment-list/components/requests-payment-create-modal/requests-payment-create-modal.component';
import { DetailRequestsPaymentComponent } from './requests-payment-list/components/detail-requests-payment/detail-requests-payment.component';
import { ApproveRequestsPaymentModalComponent } from './requests-payment-list/components/detail-requests-payment/components/approve-requests-payment-modal/approve-requests-payment-modal.component';
import { PromulgateListComponent } from './promulgate-list/promulgate-list.component';
import { PromulgateCreateModalComponent } from './submissions-list/components/promulgate-create-modal/promulgate-create-modal.component';
import { PaymentConfirmationModalComponent } from './requests-payment-list/components/payment-confirmation-modal/payment-confirmation-modal.component';
import { TranslationModule } from 'src/app/_metronic/shared/i18n/translation.module';
import { NgZorroAntdModule } from 'src/app/_metronic/shared/ng-zorro-antd/ng-zorro-antd.module';
import { RegimeListComponent } from './regime-list/regime-list.component';
import { RegimeDetailComponent } from './regime-list/components/regime-detail/regime-detail.component';
import { RegimeFormModalComponent } from './regime-list/components/regime-form-modal/regime-form-modal.component';
import { ApproveRegimeModalComponent } from './regime-list/components/regime-detail/approve-regime-modal/approve-regime-modal.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { AdditionalRequestModalComponent } from './requests-payment-list/components/detail-requests-payment/components/additional-request-modal/additional-request-modal.component';


@NgModule({
  declarations: [
    SubmissionsComponent,
    SubmissionsListComponent,
    SubmissionsCreateModalComponent,
    SubmissionsDetailComponent,
    ApproveModalComponent,
    ConsultationModalComponent,
    RequestsPaymentListComponent,
    RequestsPaymentCreateModalComponent,
    DetailRequestsPaymentComponent,
    ApproveRequestsPaymentModalComponent,
    PromulgateListComponent,
    PromulgateCreateModalComponent,
    PaymentConfirmationModalComponent,
    RegimeListComponent,
    RegimeDetailComponent,
    RegimeFormModalComponent,
    ApproveRegimeModalComponent,
    AdditionalRequestModalComponent,
  ],
  imports: [
    CommonModule,
    SubmissionsRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    InlineSVGModule,
    NgbModalModule,
    DropdownMenusModule,
    NgbTooltipModule,
    SharedModule,
    NgbDatepickerModule,
    NgxSummernoteModule,
    TranslationModule,
    NgxExtendedPdfViewerModule,
  ],
  providers: []
})
export class SubmissionsModule { }
