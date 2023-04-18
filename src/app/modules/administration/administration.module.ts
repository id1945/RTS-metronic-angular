import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPrintElementModule } from 'ngx-print-element';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbDatepickerModule, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationComponent } from './administration.component';
import { DropdownMenusModule } from 'src/app/_metronic/partials/content/dropdown-menus/dropdown-menus.module';
import { DeliveryListComponent } from './delivery-list/delivery-list.component';
import { NewDocumentsComponent } from './delivery-list/components/new-documents/new-documents.component';
import { ExpiredDocumentsComponent } from './delivery-list/components/expired-documents/expired-documents.component';
import { SharedModule } from 'src/app/_metronic/shared/shared/shared.module';
import { ParcelListComponent } from './parcel-list/parcel-list.component';
import { ImportParcelListComponent } from './importparcel-list/importparcel-list.component';
import { ExportParcelModalComponent } from './importparcel-list/components/export-parcel-modal/export-parcel-modal.component';
import { FormExpressDeliveryModalComponent } from './delivery-list/components/form-express-delivery-modal/form-express-delivery-modal.component';
import { FormParcelModalComponent } from './importparcel-list/components/form-parcel-modal/form-parcel-modal.component';
import { DetailParcelModalComponent as DetailImportParcel } from './importparcel-list/components/detail-parcel-modal/detail-parcel-modal.component';
import { DetailParcelModalComponent as DetailParcel } from './parcel-list/components/detail-parcel-modal/detail-parcel-modal.component';
import { DetailExpressDeliveryModalComponent } from './delivery-list/components/detail-express-delivery-modal/detail-express-delivery-modal.component';
import { StationeryListComponent } from './stationery-list/stationery-list.component';
import { StationeryModalComponent } from './stationery-list/components/form-stationery-modal/form-stationery-modal.component';
import { RegisterVehicleListComponent } from './registervehicle-list/registervehicle-list.component';
import { RegisterVehicleModalComponent } from './registervehicle-list/components/form-registervehicle-modal/form-registervehicle-modal.component';
import { DetailStationeryComponent } from './stationery-list/components/detail-stationery/detail-stationery.component';
import { ApproveStationeryModalComponent } from './stationery-list/components/detail-stationery/approve-stationery-modal/approve-stationery-modal.component';
import { DetailRegisterVehicleComponent } from './registervehicle-list/components/detail-registervehicle/detail-registervehicle.component';
import { ApproveRegisterVehicleModalComponent } from './registervehicle-list/components/detail-registervehicle/approve-registervehicle-modal/approve-registervehicle-modal.component';
import { ApproveExpressDeliveryModalComponent } from './delivery-list/components/detail-express-delivery-modal/approve-express-delivery-modal/approve-express-delivery-modal.component';
import { BusinessTripListComponent } from './businesstrip-list/businesstrip-list.component';
import { DetailBusinessTripComponent } from './businesstrip-list/components/detail-businesstrip/detail-businesstrip.component';
import { CreateBusinessTripComponent } from './businesstrip-list/components/create-businesstrip/create-businesstrip.component';
import { TransportExpressDeliveryModalComponent } from './delivery-list/components/transport-express-delivery/transport-express-delivery-modal.component';
import { RejectBussinessTripModalComponent } from './businesstrip-list/components/detail-businesstrip/reject-bussinesstrip-modal/reject-bussinesstrip-modal.component';
import { RunningBussinessTripModalComponent } from './businesstrip-list/components/detail-businesstrip/running-bussinesstrip-modal/running-bussinesstrip-modal.component';
import { FinishBussinessTripModalComponent } from './businesstrip-list/components/detail-businesstrip/finish-bussinesstrip-modal/finish-bussinesstrip-modal.component';
import { TimeLineTripComponent } from './businesstrip-list/components/detail-businesstrip/time-line-trip/time-line-trip.component';
import { TranslationModule } from 'src/app/_metronic/shared/i18n/translation.module';
import { NgZorroAntdModule } from 'src/app/_metronic/shared/ng-zorro-antd/ng-zorro-antd.module';
import { ApproveParcelModalComponent } from './importparcel-list/components/detail-parcel-modal/approve-parcel-modal/approve-parcel-modal.component';
import { RegisterCutRiceComponent } from './register-cut-rice/register-cut-rice.component';
import { RegisterModalComponent } from './register-cut-rice/components/register-modal/register-modal.component';
import { AngularCalendarModule } from 'src/app/_metronic/shared/angular-calendar/angular-calendar.module';
import { BussinesstripModalComponent } from './businesstrip-list/components/form-bussinesstrip-modal/form-bussinesstrip-modal.component';
import { FormEvaluateModalComponent } from './businesstrip-list/components/form-evaluate-modal/form-evaluate-modal.component';


@NgModule({
  declarations: [
    AdministrationComponent,
    DeliveryListComponent,
    NewDocumentsComponent,
    ExpiredDocumentsComponent,
    ParcelListComponent,
    ImportParcelListComponent,
    ExportParcelModalComponent,
    FormExpressDeliveryModalComponent,
    TransportExpressDeliveryModalComponent,
    FormParcelModalComponent,
    DetailImportParcel,
    DetailParcel,
    DetailExpressDeliveryModalComponent,
    StationeryListComponent,
    StationeryModalComponent,
    RegisterVehicleListComponent,
    RegisterVehicleModalComponent,
    DetailStationeryComponent,
    ApproveStationeryModalComponent,
    DetailRegisterVehicleComponent,
    ApproveRegisterVehicleModalComponent,
    ApproveExpressDeliveryModalComponent,
    BusinessTripListComponent,
    DetailBusinessTripComponent,
    CreateBusinessTripComponent,
    RejectBussinessTripModalComponent,
    RunningBussinessTripModalComponent,
    FinishBussinessTripModalComponent,
    TimeLineTripComponent,
    ApproveParcelModalComponent,
    RegisterCutRiceComponent,
    RegisterModalComponent,
    BussinesstripModalComponent,
    FormEvaluateModalComponent
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    InlineSVGModule,
    NgbModalModule,
    DropdownMenusModule,
    NgbTooltipModule,
    NgbDatepickerModule,
    NgbModule,
    NgxExtendedPdfViewerModule,
    TranslationModule,
    AngularCalendarModule,
    NgxPrintElementModule,
    SharedModule,
  ]
})
export class AdministrationModule { }
