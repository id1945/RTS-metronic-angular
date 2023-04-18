import { SharedModule } from './../../_metronic/shared/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MeetingScheduleRoutingModule } from './meeting-schedule-routing.module';
import { MeetingScheduleComponent } from './meeting-schedule.component';
import { MeetingCalendarComponent } from './meeting-calendar/meeting-calendar.component';

import { AngularCalendarModule } from 'src/app/_metronic/shared/angular-calendar/angular-calendar.module';
import { ConfirmedWaitingComponent } from './meeting-calendar/components/confirmed-waiting/confirmed-waiting.component';
import { MeetingScheduleCreatedComponent } from './meeting-calendar/components/meeting-schedule-created/meeting-schedule-created.component';
import { TranslationModule } from 'src/app/_metronic/shared/i18n/translation.module';
import { NgZorroAntdModule } from 'src/app/_metronic/shared/ng-zorro-antd/ng-zorro-antd.module';

import { FormScheduleModalComponent } from './meeting-calendar/components/form-schedule-modal/form-schedule-modal.component';
import { ParticipantsModalComponent } from './meeting-calendar/components/form-schedule-modal/components/participants-modal/participants-modal.component';
import { MeetingRoomModalComponent } from './meeting-calendar/components/form-schedule-modal/components/meeting-room-modal/meeting-room-modal.component';
import { FormWorkModalComponent } from './meeting-calendar/components/form-work-modal/form-work-modal.component';
import { TransitionModalComponent } from './meeting-calendar/components/confirmed-waiting/components/transition-modal/transition-modal.component';
import { AreaRoomModalComponent } from './meeting-calendar/components/form-schedule-modal/components/area-room-modal/area-room-modal.component';
import { RejectModalComponent } from './meeting-calendar/components/meeting-schedule-created/components/reject-modal/reject-modal.component';
@NgModule({
  declarations: [
    MeetingScheduleComponent,
    MeetingCalendarComponent,
    ConfirmedWaitingComponent,
    MeetingScheduleCreatedComponent,
    ParticipantsModalComponent,
    MeetingRoomModalComponent,
    FormScheduleModalComponent,
    FormWorkModalComponent,
    TransitionModalComponent,
    RejectModalComponent,
    AreaRoomModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TranslationModule,
    NgZorroAntdModule,
    MeetingScheduleRoutingModule,
    AngularCalendarModule
  ]
})
export class MeetingScheduleModule { }
