import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KPIComponent } from './KPI.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/_metronic/shared/shared/shared.module';
import { NgxSummernoteModule } from 'ngx-summernote';
import { TranslationModule } from 'src/app/_metronic/shared/i18n/translation.module';
import { NgZorroAntdModule } from 'src/app/_metronic/shared/ng-zorro-antd/ng-zorro-antd.module';
import { KPIRoutingModule } from './KPI-routing.module';
import { TargetKPIListComponent } from './target-kpi-list/target-kpi-list.component';
import { FormTargetKPIModalComponent } from './target-kpi-list/components/form-target-kpi-modal/form-target-kpi-modal.component';
import { CriterionKPIListComponent } from './criterion-kpi-list/criterion-kpi-list.component';
import { FormCriterionKPIModalComponent } from './criterion-kpi-list/components/form-criterion-kpi-modal/form-criterion-kpi-modal.component';
import { KpiListComponent } from './kpi-list/kpi-list.component';
import { KpiDetailComponent } from './kpi-list/components/kpi-detail/kpi-detail.component';
import { ResultKpiModalComponent } from './kpi-list/components/kpi-detail/components/result-kpi-modal/result-kpi-modal.component';
import { KpiFormModalComponent } from './kpi-list/components/kpi-form-modal/kpi-form-modal.component';
import { SwitchApproveModalComponent } from './kpi-list/components/switch-approve-modal/switch-approve-modal.component';
import { UpdateKpiDetailComponent } from './update-kpi-detail/update-kpi-detail.component';
import { LibraryKpiListComponent } from './library-kpi-list/library-kpi-list.component';
import { LibraryFormModalComponent } from './library-kpi-list/components/library-form-modal/library-form-modal.component';
import { AddIngredientsModalComponent } from './library-kpi-list/components/library-form-modal/components/add-ingredients-modal/add-ingredients-modal.component';
import { TargetKpiPartsListComponent } from './target-kpi-parts-list/target-kpi-parts-list.component';
import { FormKpiPartsModalComponent } from './target-kpi-parts-list/components/form-kpi-parts-modal/form-kpi-parts-modal.component';
import { DetailKpiPartsComponent } from './target-kpi-parts-list/components/detail-kpi-parts/detail-kpi-parts.component';
import { EKpiListComponent } from './target-kpi-parts-list/components/detail-kpi-parts/components/e-kpi-list/e-kpi-list.component';
import { EPlanListComponent } from './target-kpi-parts-list/components/detail-kpi-parts/components/e-plan-list/e-plan-list.component';
import { ETargetListComponent } from './target-kpi-parts-list/components/detail-kpi-parts/components/e-target-list/e-target-list.component';
import { CommentModalComponent } from './target-kpi-parts-list/components/detail-kpi-parts/components/comment-modal/comment-modal.component';
import { FormPlantModalComponent } from './target-kpi-parts-list/components/detail-kpi-parts/components/e-plan-list/components/form-plan-modal/form-plan-modal.component';
import { ApplyingFormulaModalComponent } from './target-kpi-parts-list/components/detail-kpi-parts/components/e-kpi-list/components/applying-formula-modal/applying-formula-modal.component';
import { FormKpiModalComponent } from './target-kpi-parts-list/components/detail-kpi-parts/components/e-kpi-list/components/form-kpi-modal/form-kpi-modal.component';
import { EditTinyTargetModalComponent } from './target-kpi-parts-list/components/detail-kpi-parts/components/e-plan-list/components/edit-tiny-target-modal/edit-tiny-target-modal.component';
import { ApproveTargetKpiPartsModalComponent } from './target-kpi-parts-list/components/detail-kpi-parts/components/approve-target-kpi-parts-modal/approve-target-kpi-parts-modal.component';
import { TargetReportComponent } from './target-report/target-report.component';


@NgModule({
  declarations: [
    KPIComponent,
    TargetKPIListComponent,
    FormTargetKPIModalComponent,
    CriterionKPIListComponent,
    FormCriterionKPIModalComponent,
    KpiListComponent,
    KpiDetailComponent,
    ResultKpiModalComponent,
    KpiFormModalComponent,
    SwitchApproveModalComponent,
    UpdateKpiDetailComponent,
    LibraryKpiListComponent,
    LibraryFormModalComponent,
    AddIngredientsModalComponent,
    TargetKpiPartsListComponent,
    FormKpiPartsModalComponent,
    DetailKpiPartsComponent,
    EKpiListComponent,
    EPlanListComponent,
    ETargetListComponent,
    CommentModalComponent,
    FormPlantModalComponent,
    ApplyingFormulaModalComponent,
    FormKpiModalComponent,
    EditTinyTargetModalComponent,
    ApproveTargetKpiPartsModalComponent,
    TargetReportComponent,
  ],
  imports: [
    CommonModule,
    KPIRoutingModule,
    // import lib
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    NgbModalModule,
    TranslationModule,
    NgxSummernoteModule,
    SharedModule,
  ]
})
export class KPIModule { }
