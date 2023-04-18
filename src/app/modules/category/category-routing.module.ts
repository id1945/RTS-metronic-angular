import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/_metronic/shared/http/auth.guard';
import { BussinesstypeListComponent } from './bussinesstype-list/bussinesstype-list.component';
import { CategoryComponent } from './category.component';
import { DepartmentListComponent } from './department-list/department-list.component';
import { DistrictListComponent } from './district-list/district-list.component';
import { DriverListComponent } from './driver-list/driver-list.component';
import { MeetingroomListComponent } from './meetingroom-list/meetingroom-list.component';
import { NewstypeListComponent } from './newstype-list/newstype-list.component';
import { PositionListComponent } from './position-list/position-list.component';
import { PostsListComponent } from './posts-list/posts-list.component';
import { ProductypeListComponent } from './productype-list/productype-list.component';
import { ProvinceListComponent } from './province-list/province-list.component';
import { UnitListComponent } from './unit-list/unit-list.component';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';

const routes: Routes = [
  {
    path: '',
    component: CategoryComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'posts',
        component: PostsListComponent,
        data: { screenKey: 'allow', action: 'Index' },
      },
      {
        path: 'positions',
        component: PositionListComponent,
        data: { screenKey: 'ChucVu', action: 'Index' },
      },
      {
        path: 'units',
        component: UnitListComponent,
        data: { screenKey: 'DonViTinh', action: 'Index' },
      },
      {
        path: 'bussinesstypes',
        component: BussinesstypeListComponent,
        data: { screenKey: 'LoaiNghiepVu', action: 'Index' },
      },
      {
        path: 'producttypes',
        component: ProductypeListComponent,
        data: { screenKey: 'NhomSanPham', action: 'Index' },
      },
      {
        path: 'newstypes',
        component: NewstypeListComponent,
        data: { screenKey: 'NhomBaiViet', action: 'Index' },
      },
      {
        path: 'departments',
        component: DepartmentListComponent,
        data: { screenKey: 'PhongBan', action: 'Index' },
      },
      {
        path: 'meetingrooms',
        component: MeetingroomListComponent,
        data: { screenKey: 'PhongHop', action: 'Index' },
      },
      {
        path: 'districts',
        component: DistrictListComponent,
        data: { screenKey: 'QuanHuyen', action: 'Index' },
      },
      {
        path: 'provinces',
        component: ProvinceListComponent,
        data: { screenKey: 'TinhThanh', action: 'Index' },
      },
      {
        path: 'vehicles',
        component: VehicleListComponent,
        data: { screenKey: 'DanhSachXes', action: 'Index' },
      },
      {
        path: 'drivers',
        component: DriverListComponent,
        data: { screenKey: 'DanhSachTaiXes', action: 'Index' },
      },
      { path: '', redirectTo: 'category', pathMatch: 'full' },
      { path: '**', redirectTo: 'category', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
