import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/_metronic/shared/http/auth.guard';
import { CriterionKPIListComponent } from './criterion-kpi-list/criterion-kpi-list.component';
import { KpiDetailComponent } from './kpi-list/components/kpi-detail/kpi-detail.component';
import { KpiListComponent } from './kpi-list/kpi-list.component';
import { KPIComponent } from './KPI.component';
import { LibraryKpiListComponent } from './library-kpi-list/library-kpi-list.component';
import { TargetKPIListComponent } from './target-kpi-list/target-kpi-list.component';
import { DetailKpiPartsComponent } from './target-kpi-parts-list/components/detail-kpi-parts/detail-kpi-parts.component';
import { TargetKpiPartsListComponent } from './target-kpi-parts-list/target-kpi-parts-list.component';
import { TargetReportComponent } from './target-report/target-report.component';
import { UpdateKpiDetailComponent } from './update-kpi-detail/update-kpi-detail.component';

const routes: Routes = [
  {
    path: '',
    component: KPIComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'kpi',
        component: KpiListComponent,
        data: { screenKey: 'KPIQuy', action: 'Index' },
      },
      {
        path: 'kpi/detail/:kpiQuyId',
        component: KpiDetailComponent,
        data: { screenKey: 'KPIQUYCHITIET', action: 'Index' },
      },
      {
        path: 'target-kpi',
        component: TargetKPIListComponent,
        data: { screenKey: 'KPIMucTieu', action: 'Index' },
      },
      {
        path: 'update-kpi-detail',
        component: UpdateKpiDetailComponent,
        data: { screenKey: 'KPIQUYCHITIET', action: 'Index' },
      },
      {
        path: 'update-kpi-detail/:kpiQuyId',
        component: UpdateKpiDetailComponent,
        data: { screenKey: 'KPIQUYCHITIET', action: 'Index' },
      },
      {
        path: 'criterion-kpi',
        component: CriterionKPIListComponent,
        data: { screenKey: 'KPINhomTieuChi', action: 'Index' },
      },
      {
        path: 'target-kpi-parts',
        component: TargetKpiPartsListComponent,
        data: { screenKey: 'KPIMucTieuNamBoPhan', action: 'Index' },
      },
      {
        path: 'target-kpi-parts/detail/:kpiMucTieuNamBoPhanId',
        component: DetailKpiPartsComponent,
        data: { screenKey: 'KPIMucTieuNamBoPhan', action: 'Index' },
      },
      {
        path: 'target-report',
        component: TargetReportComponent,
        data: { screenKey: 'KPIQuy', action: 'Index' },
      },
      {
        path: 'library-kpi',
        component: LibraryKpiListComponent,
        data: { screenKey: 'KPIMucTieu', action: 'Index' },
      },
      { path: '', redirectTo: 'KPI', pathMatch: 'full' },
      { path: '**', redirectTo: 'KPI', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KPIRoutingModule { }
