import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/_metronic/shared/http/auth.guard';
import { MissionDetailComponent } from './mission-list/components/mission-detail/mission-detail.component';
import { MissionListComponent } from './mission-list/mission-list.component';
import { MonthPlanDetailComponent } from './monthplan-list/components/monthplan-detail/monthplan-detail.component';
import { MonthPlanListComponent } from './monthplan-list/monthplan-list.component';
import { PersonnelComponent } from './personnel.component';
import { ApproveRestOvertimeComponent } from './rest-overtime/approve-rest-overtime/approve-rest-overtime.component';
import { ExplanationComponent } from './rest-overtime/explanation/explanation.component';
import { RegisterRestOvertimeComponent } from './rest-overtime/register-rest-overtime/register-rest-overtime.component';
import { SalaryComponent } from './salary/salary.component';
import { TimesheetComponent } from './timesheet/timesheet.component';

const routes: Routes = [
  {
    path: '',
    component: PersonnelComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'register/:screen',
        component: RegisterRestOvertimeComponent,
        data: { screenKey: 'allow', action: 'Index' },
      },
      {
        path: 'approve/:screen',
        component: ApproveRestOvertimeComponent,
        data: { screenKey: 'allow', action: 'Index' },
      },
      //==============================
      {
        path: 'register/holiday',
        redirectTo: 'register/:screen',
        data: { screenKey: 'allow', action: 'Index' },
      },
      {
        path: 'register/overtime',
        redirectTo: 'register/:screen',
        data: { screenKey: 'allow', action: 'Index' },
      },
      {
        path: 'register/wleo',
        redirectTo: 'register/:screen',
        data: { screenKey: 'allow', action: 'Index' },
      },
      //===============================
      {
        path: 'approve/holiday',
        redirectTo: 'approve/:screen',
        data: { screenKey: 'allow', action: 'Index' },
      },
      {
        path: 'approve/overtime',
        redirectTo: 'approve/:screen',
        data: { screenKey: 'allow', action: 'Index' },
      },
      {
        path: 'approve/wleo',
        redirectTo: 'approve/:screen',
        data: { screenKey: 'allow', action: 'Index' },
      },
      //===============================
      {
        path: 'explanation',
        component: ExplanationComponent,
        data: { screenKey: 'allow', action: 'Index' },
      },
      {
        path: 'salary',
        component: SalaryComponent,
        data: { screenKey: 'allow', action: 'Index' },
      },
      {
        path: 'timesheet',
        component: TimesheetComponent,
        data: { screenKey: 'allow', action: 'Index' },
      },
      {
        path: 'month-plan',
        component: MonthPlanListComponent,
        data: { screenKey: 'allow', action: 'Index' },
      },
      {
        path: 'month-plan/detail/:hoSoId',
        component: MonthPlanDetailComponent,
        data: { screenKey: 'allow', action: 'Index' },
      },
      {
        path: 'mission',
        component: MissionListComponent,
        data: { screenKey: 'DieuDongCongTac', action: 'Index' },
      },
      {
        path: 'mission/detail/:hoSoId',
        component: MissionDetailComponent,
        data: { screenKey: 'DieuDongCongTac', action: 'Index' },
      },
      { path: '**', redirectTo: 'personnel', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonnelRoutingModule { }
