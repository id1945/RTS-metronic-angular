import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/_metronic/shared/http/auth.guard';
import { DeclarationComponent } from './declaration/declaration.component';
import { HealthComponent } from './health.component';

const routes: Routes = [
  {
    path: '',
    component: HealthComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'declaration',
        component: DeclarationComponent,
        data: { screenKey: 'allow', action: 'Index' },
      },
      { path: '', redirectTo: 'declaration', pathMatch: 'full' },
      { path: '**', redirectTo: 'declaration', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HealthRoutingModule { }
