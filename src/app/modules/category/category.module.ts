import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostsListComponent } from './posts-list/posts-list.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/_metronic/shared/shared/shared.module';
import { FormPostsModalComponent } from './posts-list/components/form-posts-modal/form-posts-modal.component';
import { NgxSummernoteModule } from 'ngx-summernote';
import { TranslationModule } from 'src/app/_metronic/shared/i18n/translation.module';
import { NgZorroAntdModule } from 'src/app/_metronic/shared/ng-zorro-antd/ng-zorro-antd.module';
import { CategoryComponent } from './category.component';
import { CategoryRoutingModule } from './category-routing.module';
import { PositionListComponent } from './position-list/position-list.component';
import { FormPositionModalComponent } from './position-list/components/form-position-modal/form-position-modal.component';
import { FormUnitModalComponent } from './unit-list/components/form-unit-modal/form-unit-modal.component';
import { UnitListComponent } from './unit-list/unit-list.component';
import { FormBussinesstypeModalComponent } from './bussinesstype-list/components/form-bussinesstype-modal/form-bussinesstype-modal.component';
import { BussinesstypeListComponent } from './bussinesstype-list/bussinesstype-list.component';
import { FormProductypeModalComponent } from './productype-list/components/form-productype-modal/form-productype-modal.component';
import { ProductypeListComponent } from './productype-list/productype-list.component';
import { FormNewstypeModalComponent } from './newstype-list/components/form-newstype-modal/form-newstype-modal.component';
import { NewstypeListComponent } from './newstype-list/newstype-list.component';
import { DepartmentListComponent } from './department-list/department-list.component';
import { FormDepartmentModalComponent } from './department-list/components/form-department-modal/form-department-modal.component';
import { MeetingroomListComponent } from './meetingroom-list/meetingroom-list.component';
import { FormMeetingroomModalComponent } from './meetingroom-list/components/form-meetingroom-modal/form-meetingroom-modal.component';
import { DistrictListComponent } from './district-list/district-list.component';
import { FormDistrictModalComponent } from './district-list/components/form-district-modal/form-district-modal.component';
import { FormProvinceModalComponent } from './province-list/components/form-province-modal/form-province-modal.component';
import { ProvinceListComponent } from './province-list/province-list.component';
import { FormVehicleModalComponent } from './vehicle-list/components/form-vehicle-modal/form-vehicle-modal.component';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { DriverListComponent } from './driver-list/driver-list.component';
import { FormDriverModalComponent } from './driver-list/components/form-driver-modal/form-driver-modal.component';


@NgModule({
  declarations: [
    CategoryComponent, 
    PostsListComponent, 
    FormPostsModalComponent,
    PositionListComponent,
    FormPositionModalComponent,
    UnitListComponent,
    FormUnitModalComponent,
    BussinesstypeListComponent,
    FormBussinesstypeModalComponent,
    ProductypeListComponent,
    FormProductypeModalComponent,
    NewstypeListComponent,
    FormNewstypeModalComponent,
    DepartmentListComponent,
    FormDepartmentModalComponent,
    MeetingroomListComponent,
    FormMeetingroomModalComponent,
    DistrictListComponent,
    FormDistrictModalComponent,
    ProvinceListComponent,
    FormProvinceModalComponent,
    VehicleListComponent,
    FormVehicleModalComponent,
    DriverListComponent,
    FormDriverModalComponent
  ],
  imports: [
    CategoryRoutingModule,
    CommonModule,
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
export class CategoryModule { }
