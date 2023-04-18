import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { InlineSVGModule } from 'ng-inline-svg'
import { NgbDatepickerModule, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'
import { NgxSummernoteModule } from 'ngx-summernote';

import { DropdownMenusModule } from 'src/app/_metronic/partials/content/dropdown-menus/dropdown-menus.module'
import { SharedModule } from 'src/app/_metronic/shared/shared/shared.module'
import { NgZorroAntdModule } from 'src/app/_metronic/shared/ng-zorro-antd/ng-zorro-antd.module'

import { PurchaseRoutingModule } from './purchase-routing.module'
import { PurchaseComponent } from './purchase.component'
import { PurchaseListComponent } from './purchase-list/purchase-list.component'
import { PurchaseDetailComponent } from './purchase-list/components/purchase-detail/purchase-detail.component'
import { ApproveModalComponent } from './purchase-list/components/purchase-detail/approve-modal/approve-modal.component'
import { ConsultationModalComponent } from './purchase-list/components/purchase-detail/consultation-modal/consultation-modal.component';
import { TableFullModalComponent } from './purchase-list/components/purchase-detail/table-full-modal/table-full-modal.component'
import { SupplierSelectionListComponent } from './supplier-selection-list/supplier-selection-list.component';
import { DetailSupplierSelectionComponent } from './supplier-selection-list/components/detail-supplier-selection/detail-supplier-selection.component'
import { ContractListComponent } from './contract-list/contract-list.component';
import { DetailContractComponent } from './contract-list/components/detail-contract/detail-contract.component';
import { ApproveContractModalComponent } from './contract-list/components/detail-contract/approve-contract-modal/approve-contract-modal.component'
import { ConsultationContractModalComponent } from './contract-list/components/detail-contract/consultation-contract-modal/consultation-contract-modal.component'
import { ApproveSupplierModalComponent } from './supplier-selection-list/components/detail-supplier-selection/approve-supplier-modal/approve-supplier-modal.component'
import { ConsultationSupplierModalComponent } from './supplier-selection-list/components/detail-supplier-selection/consultation-supplier-modal/consultation-supplier-modal.component';
import { PurchaseFormModalComponent } from './purchase-list/components/purchase-form-modal/purchase-form-modal.component';
import { ContractFullTableModalComponent } from './contract-list/components/detail-contract/contract-full-table-modal/contract-full-table-modal.component'
import { TranslationModule } from 'src/app/_metronic/shared/i18n/translation.module';
import { FormContractModalComponent } from './contract-list/components/form-contract-modal/form-contract-modal.component';
import { FormSupplierSelectionModalComponent } from './supplier-selection-list/components/form-supplier-selection-modal/form-supplier-selection-modal.component'

@NgModule({
  declarations: [
    PurchaseComponent,
    PurchaseListComponent,
    PurchaseDetailComponent,
    ApproveModalComponent,
    ConsultationModalComponent,
    TableFullModalComponent,
    SupplierSelectionListComponent,
    DetailSupplierSelectionComponent,
    DetailContractComponent,
    ContractListComponent,
    ApproveContractModalComponent,
    ConsultationContractModalComponent,
    ApproveSupplierModalComponent,
    ConsultationSupplierModalComponent,
    PurchaseFormModalComponent,
    ContractFullTableModalComponent,
    FormContractModalComponent,
    FormSupplierSelectionModalComponent
  ],
  imports: [
    CommonModule,
    PurchaseRoutingModule,
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
    TranslationModule
  ],
  providers: []
})
export class PurchaseModule { }
