import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonnelRoutingModule } from './personnel-routing.module';
import { PersonnelComponent } from '../personnel/personnel.component';
import { RegisterRestOvertimeComponent } from './rest-overtime/register-rest-overtime/register-rest-overtime.component';
import { SearchRegisterRestOvertimeComponent } from './rest-overtime/register-rest-overtime/components/search-register-rest-overtime/search-register-rest-overtime.component';
import { CalendarRegisterRestOvertimeComponent } from './rest-overtime/register-rest-overtime/components/calendar-register-rest-overtime/calendar-register-rest-overtime.component';
import { SharedModule } from 'src/app/_metronic/shared/shared/shared.module';
import { AngularCalendarModule } from 'src/app/_metronic/shared/angular-calendar/angular-calendar.module';
import { NgZorroAntdModule } from 'src/app/_metronic/shared/ng-zorro-antd/ng-zorro-antd.module';
import { HandoverRecipientModalComponent } from './rest-overtime/register-rest-overtime/components/search-register-rest-overtime/handover-recipient-modal/handover-recipient-modal.component';
import { TranslationModule } from 'src/app/_metronic/shared/i18n/translation.module';
import { ApproveRestOvertimeComponent } from './rest-overtime/approve-rest-overtime/approve-rest-overtime.component';
import { TableApproveRestOvertimeComponent } from './rest-overtime/approve-rest-overtime/components/table-approve-rest-overtime/table-approve-rest-overtime.component';
import { SearchApproveRestOvertimeComponent } from './rest-overtime/approve-rest-overtime/components/search-approve-rest-overtime/search-approve-rest-overtime.component';
import { RegisterRestService } from './rest-overtime/shared/register-rest.service';
import { ExplanationComponent } from './rest-overtime/explanation/explanation.component';
import { FormExplanationModalComponent } from './rest-overtime/explanation/components/form-explanation-modal/form-explanation-modal.component';
import { SalaryComponent } from './salary/salary.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { MonthPlanListComponent } from './monthplan-list/monthplan-list.component';
import { MonthPlanFormModalComponent } from './monthplan-list/components/monthplan-form-modal/monthplan-form-modal.component';
import { MonthPlanDetailComponent } from './monthplan-list/components/monthplan-detail/monthplan-detail.component';
import { ApproveMonthPlanModalComponent } from './monthplan-list/components/monthplan-detail/approve-monthplan-modal/approve-monthplan-modal.component';
import { NgxSummernoteModule } from 'ngx-summernote';
import { MissionListComponent } from './mission-list/mission-list.component';
import { MissionDetailComponent } from './mission-list/components/mission-detail/mission-detail.component';
import { MissionFormModalComponent } from './mission-list/components/mission-form-modal/mission-form-modal.component';
import { ApproveMissionModalComponent } from './mission-list/components/mission-detail/approve-mission-modal/approve-mission-modal.component';
import { TicketsMissionModalComponent } from './mission-list/components/mission-detail/tickets-mission-modal/tickets-mission-modal.component';
import { AdditionalMissionModalComponent } from './mission-list/components/mission-detail/additional-mission-modal/additional-mission-modal.component';


@NgModule({
  declarations: [
    PersonnelComponent,
    RegisterRestOvertimeComponent,
    SearchRegisterRestOvertimeComponent,
    CalendarRegisterRestOvertimeComponent,
    HandoverRecipientModalComponent,
    ApproveRestOvertimeComponent,
    TableApproveRestOvertimeComponent,
    SearchApproveRestOvertimeComponent,
    ExplanationComponent,
    FormExplanationModalComponent,
    SalaryComponent,
    TimesheetComponent,
    MonthPlanListComponent,
    MonthPlanFormModalComponent,
    MonthPlanDetailComponent,
    ApproveMonthPlanModalComponent,
    MissionListComponent,
    MissionDetailComponent,
    MissionFormModalComponent,
    ApproveMissionModalComponent,
    TicketsMissionModalComponent,
    AdditionalMissionModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PersonnelRoutingModule,
    SharedModule,
    NgZorroAntdModule,
    TranslationModule,
    AngularCalendarModule,
    NgxSummernoteModule,
  ],
  providers: [
    RegisterRestService
  ]
})
export class PersonnelModule { }
