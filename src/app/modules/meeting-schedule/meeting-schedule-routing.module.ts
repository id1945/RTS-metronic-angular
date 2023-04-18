import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/_metronic/shared/http/auth.guard';
import { MeetingCalendarComponent } from './meeting-calendar/meeting-calendar.component';
import { MeetingScheduleComponent } from './meeting-schedule.component';

const routes: Routes = [
  {
    path: '',
    component: MeetingScheduleComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'schedule',
        component: MeetingCalendarComponent,
        data: { screenKey: 'allow', action: 'Index' },
      },
      { path: '', redirectTo: 'meeting', pathMatch: 'full' },
      { path: '**', redirectTo: 'meeting', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeetingScheduleRoutingModule { }
