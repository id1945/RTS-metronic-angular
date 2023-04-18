import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegimeListComponent } from './regime-list/regime-list.component';
import { RegimeDetailComponent } from './regime-list/components/regime-detail/regime-detail.component';
import { RegimeExpiredComponent } from './regime-list/components/regime-expired/regime-expired.component';
import { RegimeNewComponent } from './regime-list/components/regime-new/regime-new.component';
import { RegimeFormModalComponent } from './regime-list/components/regime-form-modal/regime-form-modal.component';
import { DocumentsComponent } from './documents.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbDatepickerModule, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownMenusModule } from 'src/app/_metronic/partials/content/dropdown-menus/dropdown-menus.module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { SharedModule } from 'src/app/_metronic/shared/shared/shared.module';
import { LibraryLawListComponent } from './librarylaw-list/librarylaw-list.component';
import { LibraryLawFormModalComponent } from './librarylaw-list/components/librarylaw-form-modal/librarylaw-form-modal.component';
import { DocumentsRoutingModule } from './documents-routing.module';
import { TranslationModule } from 'src/app/_metronic/shared/i18n/translation.module';
import { NgZorroAntdModule } from 'src/app/_metronic/shared/ng-zorro-antd/ng-zorro-antd.module';
import { RegimeProposeListComponent } from './regime-propose-list/regime-propose-list.component';
import { RegimeProposeFormModalComponent } from './regime-propose-list/components/regime-propose-form-modal/regime-propose-form-modal.component';
import { ApproveRegimeProposeModalComponent } from './regime-propose-list/components/regime-propose-detail/approve-regime-propose-modal/approve-regime-propose-modal.component';
import { RegimeProposeDetailComponent } from './regime-propose-list/components/regime-propose-detail/regime-propose-detail.component';
import { NumberdocsListComponent } from './numberdocs-list/numberdocs-list.component';
import { NumberdocsFormModalComponent } from './numberdocs-list/components/numberdocs-form-modal/numberdocs-form-modal.component';
import { NumberdocsDetailComponent } from './numberdocs-list/components/numberdocs-detail/numberdocs-detail.component';
import { InternalReportListComponent } from './internalreport-list/internalreport-list.component';
import { InternalReportFormModalComponent } from './internalreport-list/components/internalreport-form-modal/internalreport-form-modal.component';
import { InternalReportDetailComponent } from './internalreport-list/components/internalreport-detail/internalreport-detail.component';
import { AgencyPolicyListComponent } from './agencypolicy-list/agencypolicy-list.component';
import { AgencyPolicyFormModalComponent } from './agencypolicy-list/components/agencypolicy-form-modal/agencypolicy-form-modal.component';
import { AgencyPolicyDetailComponent } from './agencypolicy-list/components/agencypolicy-detail/agencypolicy-detail.component';
import { LibraryLawDetailComponent } from './librarylaw-list/components/librarylaw-detail/librarylaw-detail.component';
import { ApproveNumberdocsModalComponent } from './numberdocs-list/components/approve-numberdocs-modal/approve-numberdocs-modal.component';


@NgModule({
  declarations: [
    RegimeListComponent,
    RegimeDetailComponent,
    RegimeExpiredComponent,
    RegimeNewComponent,
    RegimeFormModalComponent,
    LibraryLawListComponent,
    LibraryLawFormModalComponent,
    LibraryLawDetailComponent,
    DocumentsComponent,
    RegimeProposeListComponent,
    RegimeProposeFormModalComponent,
    ApproveRegimeProposeModalComponent,
    RegimeProposeDetailComponent,
    NumberdocsListComponent,
    NumberdocsFormModalComponent,
    NumberdocsDetailComponent,
    InternalReportListComponent,
    InternalReportListComponent,
    InternalReportFormModalComponent,
    InternalReportDetailComponent,
    AgencyPolicyListComponent,
    AgencyPolicyFormModalComponent,
    AgencyPolicyDetailComponent,
    ApproveNumberdocsModalComponent
  ],
  imports: [
    CommonModule,
    DocumentsRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    InlineSVGModule,
    NgbModalModule,
    DropdownMenusModule,
    NgbTooltipModule,
    NgbDatepickerModule,
    NgxExtendedPdfViewerModule,
    TranslationModule,
    SharedModule
  ]
})
export class DocumentsModule { }
