import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/_metronic/shared/http/auth.guard';
import { DetailContractComponent } from './contract-list/components/detail-contract/detail-contract.component';
import { ContractListComponent } from './contract-list/contract-list.component';
import { PurchaseDetailComponent } from './purchase-list/components/purchase-detail/purchase-detail.component';
import { PurchaseListComponent } from './purchase-list/purchase-list.component';
import { PurchaseComponent } from './purchase.component';
import { DetailSupplierSelectionComponent } from './supplier-selection-list/components/detail-supplier-selection/detail-supplier-selection.component';
import { SupplierSelectionListComponent } from './supplier-selection-list/supplier-selection-list.component';

const routes: Routes = [
  {
    path: '',
    component: PurchaseComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'list',
        component: PurchaseListComponent,
        data: { screenKey: 'Purchase', action: 'Index' },
      },
      {
        path: 'detail/:id/:maThamChieu',
        component: PurchaseDetailComponent,
        data: { screenKey: 'Purchase', action: 'Index' },
      },
      {
        path: 'supplier-selection',
        component: SupplierSelectionListComponent,
        data: { screenKey: 'allow', action: 'Index' },
      },
      {
        path: 'supplier-selection/detail/:id',
        component: DetailSupplierSelectionComponent,
        data: { screenKey: 'allow', action: 'Index' },
      },
      {
        path: 'contract',
        component: ContractListComponent,
        data: { screenKey: 'Contract', action: 'Index' },
      },
      {
        path: 'contract/detail/:id',
        component: DetailContractComponent,
        data: { screenKey: 'Contract', action: 'Index' },
      },
      { path: '**', redirectTo: 'purchase', pathMatch: 'full' },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
