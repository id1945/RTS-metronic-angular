import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/_metronic/shared/http/auth.guard';
import { AgencyPolicyListComponent } from './agencypolicy-list/agencypolicy-list.component';
import { AgencyPolicyDetailComponent } from './agencypolicy-list/components/agencypolicy-detail/agencypolicy-detail.component';
import { DocumentsComponent } from './documents.component';
import { InternalReportListComponent } from './internalreport-list/internalreport-list.component';
import { LibraryLawDetailComponent } from './librarylaw-list/components/librarylaw-detail/librarylaw-detail.component';
import { LibraryLawListComponent } from './librarylaw-list/librarylaw-list.component';
import { NumberdocsDetailComponent } from './numberdocs-list/components/numberdocs-detail/numberdocs-detail.component';
import { NumberdocsListComponent } from './numberdocs-list/numberdocs-list.component';
import { RegimeDetailComponent } from './regime-list/components/regime-detail/regime-detail.component';
import { RegimeListComponent } from './regime-list/regime-list.component';
import { RegimeProposeDetailComponent } from './regime-propose-list/components/regime-propose-detail/regime-propose-detail.component';
import { RegimeProposeListComponent } from './regime-propose-list/regime-propose-list.component';

const routes: Routes = [{
  path: '',
  component: DocumentsComponent,
  canActivateChild: [AuthGuard],
  children: [
    {
      path: 'regime',
      component: RegimeListComponent,
      data: { screenKey: 'VanBanDinhChe', action: 'Index' },
    },
    {
      path: 'regime-detail/:id',
      component: RegimeDetailComponent,
      data: { screenKey: 'VanBanDinhChe', action: 'Index' },
    },
    {
      path: 'regime-propose',
      component: RegimeProposeListComponent,
      data: { screenKey: 'allow', action: 'Index' },
    },
    {
      path: 'regime-propose-detail/:hoSoId',
      component: RegimeProposeDetailComponent,
      data: { screenKey: 'allow', action: 'Index' },
    },
    {
      path: 'numberdocs',
      component: NumberdocsListComponent,
      data: { screenKey: 'allow', action: 'Index' },
    },
    {
      path: 'numberdocs-detail/:laySoVanBanId',
      component: NumberdocsDetailComponent,
      data: { screenKey: 'allow', action: 'Index' },
    },
    {
      path: 'librarylaw',
      component: LibraryLawListComponent,
      data: { screenKey: 'ThuVienPhapLuat', action: 'Index' },
    },
    {
      path: 'librarylaw-detail/:id',
      component: LibraryLawDetailComponent,
      data: { screenKey: 'ThuVienPhapLuat', action: 'Index' },
    },
    {
      path: 'internalreport',
      component: InternalReportListComponent,
      data: { screenKey: 'BaoCaoNoiBo', action: 'Index' },
    },
    {
      path: 'agencypolicy',
      component: AgencyPolicyListComponent,
      data: { screenKey: 'ChinhSachDaiLy', action: 'Index' },
    },
    {
      path: 'agencypolicy-detail/:id',
      component: AgencyPolicyDetailComponent,
      data: { screenKey: 'ChinhSachDaiLy', action: 'Index' },
    },
    { path: '', redirectTo: 'documents', pathMatch: 'full' },
    { path: '**', redirectTo: 'documents', pathMatch: 'full' },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentsRoutingModule { }
