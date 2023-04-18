import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/_metronic/shared/http/auth.guard';
import { ProfileOverviewComponent } from './profile-overview/profile-overview.component';
import { UserProfileComponent } from './user-profile.component';

const routes: Routes = [
  {
    path: '',
    component: UserProfileComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'profile-overview',
        component: ProfileOverviewComponent,
        data: { screenKey: 'allow', action: 'Index' },
      },
      { path: '', redirectTo: 'profile-overview', pathMatch: 'full' },
      { path: '**', redirectTo: 'profile-overview', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserProfileRoutingModule { }
