import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/_metronic/shared/http/auth.guard';
import { PromulgateListComponent } from './promulgate-list/promulgate-list.component';
import { RegimeDetailComponent } from './regime-list/components/regime-detail/regime-detail.component';
import { RegimeListComponent } from './regime-list/regime-list.component';
import { DetailRequestsPaymentComponent } from './requests-payment-list/components/detail-requests-payment/detail-requests-payment.component';
import { RequestsPaymentListComponent } from './requests-payment-list/requests-payment-list.component';
import { SubmissionsDetailComponent } from './submissions-list/components/submissions-detail/submissions-detail.component';
import { SubmissionsListComponent } from './submissions-list/submissions-list.component';
import { SubmissionsComponent } from './submissions.component';

const routes: Routes = [
  {
    path: '',
    component: SubmissionsComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'list',
        component: SubmissionsListComponent,
        data: { screenKey: 'ToTrinh', action: 'Index' },
      },
      {
        path: 'detail/:hoSoId',
        component: SubmissionsDetailComponent,
        data: { screenKey: 'ToTrinh', action: 'Index' },
      },
      {
        path: 'requests-payment',
        component: RequestsPaymentListComponent,
        data: { screenKey: 'DeNghiThanhToanDaiLy', action: 'Index' },
      },
      {
        path: 'payment-detail/:hoSoId',
        component: DetailRequestsPaymentComponent,
        data: { screenKey: 'DeNghiThanhToanDaiLy', action: 'Index' },
      },
      {
        path: 'promulgate',
        component: PromulgateListComponent,
        data: { screenKey: 'BanHanh', action: 'Index' },
      },
      {
        path: 'regime-list',
        component: RegimeListComponent,
        data: { screenKey: '', action: 'Index' },
      },
      {
        path: 'regime-detail/:hoSoId',
        component: RegimeDetailComponent,
        data: { screenKey: '', action: 'Index' },
      },
      { path: '**', redirectTo: 'submissions', pathMatch: 'full' },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubmissionsRoutingModule { }
