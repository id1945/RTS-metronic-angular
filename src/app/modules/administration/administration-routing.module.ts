import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/_metronic/shared/http/auth.guard';
import { AdministrationComponent } from './administration.component';
import { BusinessTripListComponent } from './businesstrip-list/businesstrip-list.component';
import { CreateBusinessTripComponent } from './businesstrip-list/components/create-businesstrip/create-businesstrip.component';
import { DetailBusinessTripComponent } from './businesstrip-list/components/detail-businesstrip/detail-businesstrip.component';
import { DeliveryListComponent } from './delivery-list/delivery-list.component';
import { ImportParcelListComponent } from './importparcel-list/importparcel-list.component';
import { ParcelListComponent } from './parcel-list/parcel-list.component';
import { RegisterCutRiceComponent } from './register-cut-rice/register-cut-rice.component';
import { DetailRegisterVehicleComponent } from './registervehicle-list/components/detail-registervehicle/detail-registervehicle.component';
import { RegisterVehicleListComponent } from './registervehicle-list/registervehicle-list.component';
import { DetailStationeryComponent } from './stationery-list/components/detail-stationery/detail-stationery.component';
import { StationeryListComponent } from './stationery-list/stationery-list.component';

const routes: Routes = [
  {
    path: '',
    component: AdministrationComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'delivery',
        component: DeliveryListComponent,
        data: { screenKey: 'DangKyChuyenPhatNhanh', action: 'Index' },
      },
      {
        path: 'parcel',
        component: ParcelListComponent,
        data: { screenKey: 'allow', action: 'Index' },
      },
      {
        path: 'importparcel',
        component: ImportParcelListComponent,
        data: { screenKey: 'allow', action: 'Index' },
      },
      {
        path: 'stationery',
        component: StationeryListComponent,
        data: { screenKey: 'HoSoVanPhongPham', action: 'Index' },
      },
      {
        path: 'stationery-detail/:hoSoId',
        component: DetailStationeryComponent,
        data: { screenKey: 'HoSoVanPhongPham', action: 'Index' },
      },
      {
        path: 'registervehicle',
        component: RegisterVehicleListComponent,
        data: { screenKey: 'XeDuaDon', action: 'Index' },
      },
      {
        path: 'registervehicle-detail/:hoSoId',
        component: DetailRegisterVehicleComponent,
        data: { screenKey: 'XeDuaDon', action: 'Index' },
      },
      {
        path: 'bussinesstrip',
        component: BusinessTripListComponent,
        data: { screenKey: 'DanhSachChuyenDi', action: 'Index' },
      },
      {
        path: 'bussinesstrip-create/:hoSoId',
        component: CreateBusinessTripComponent,
        data: { screenKey: 'DanhSachChuyenDi', action: 'Index' },
      },
      {
        path: 'bussinesstrip-detail/:id',
        component: DetailBusinessTripComponent,
        data: { screenKey: 'DanhSachChuyenDi', action: 'Index' },
      },
      {
        path: 'skip-lunch',
        component: RegisterCutRiceComponent,
        data: { screenKey: 'DangKyCatCom', action: 'Index' },
      },
      { path: '', redirectTo: 'administration', pathMatch: 'full' },
      { path: '**', redirectTo: 'administration', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
