import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/_metronic/shared/http/auth.guard';
import { ItRequestComponent } from './it-request.component';
import { RequestListComponent } from './request-list/request-list.component';

const routes: Routes = [{
  path: '',
  component: ItRequestComponent,
  canActivateChild: [AuthGuard],
  children: [
    {
      path: 'list',
      component: RequestListComponent,
      data: { screenKey: 'allow', action: 'Index' },
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItRequestRoutingModule { }
