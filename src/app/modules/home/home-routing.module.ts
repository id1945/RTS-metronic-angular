import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/_metronic/shared/http/auth.guard';
import { NewsDetailComponent } from './components/news-detail/news-detail.component';
import { NewsComponent } from './components/news/news.component';
import { OverviewComponent } from './components/overview/overview.component';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        component: OverviewComponent,
        data: { screenKey: 'allow', action: 'Index' },
      }, {
        path: 'news',
        component: NewsComponent,
        data: { screenKey: 'allow', action: 'Index' },
      }, {
        path: 'detail/:id',
        component: NewsDetailComponent,
        data: { screenKey: 'allow', action: 'Index' },
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
