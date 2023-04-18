import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './_layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      // {
      //   path: 'builder',
      //   loadChildren: () =>
      //     import('./builder/builder.module').then((m) => m.BuilderModule),
      // },
      {
        path: 'user-profile',
        loadChildren: () =>
          import('../modules/user-profile/user-profile.module').then(
            (m) => m.UserProfileModule
          ),
      },
      {
        path: 'documents',
        loadChildren: () =>
          import('../modules/documents/documents.module').then(
            (m) => m.DocumentsModule
          ),
      },
      {
        path: 'contacts',
        loadChildren: () =>
          import('../modules/contacts/contacts.module').then(
            (m) => m.ContactsModule
          ),
      },
      {
        path: 'meeting',
        loadChildren: () =>
          import('../modules/meeting-schedule/meeting-schedule.module').then(
            (m) => m.MeetingScheduleModule
          ),
      },
      {
        path: 'submissions',
        loadChildren: () =>
          import('../modules/submissions/submissions.module').then(
            (m) => m.SubmissionsModule
          ),
      },
      {
        path: 'administration',
        loadChildren: () =>
          import('../modules/administration/administration.module').then(
            (m) => m.AdministrationModule
          ),
      },
      {
        path: 'purchase',
        loadChildren: () =>
          import('../modules/purchase/purchase.module').then(
            (m) => m.PurchaseModule
          ),
      },
      {
        path: 'KPI',
        loadChildren: () =>
          import('../modules/KPI/KPI.module').then(
            (m) => m.KPIModule
          ),
      },
      {
        path: 'management',
        loadChildren: () =>
          import('../modules/management/management.module').then(
            (m) => m.ManagementModule
          ),
      },
      {
        path: 'category',
        loadChildren: () =>
          import('../modules/category/category.module').then(
            (m) => m.CategoryModule
          ),
      },
      {
        path: 'personnel',
        loadChildren: () =>
          import('../modules/personnel/personnel.module').then(
            (m) => m.PersonnelModule
          ),
      },
      {
        path: 'health',
        loadChildren: () =>
          import('../modules/health/health.module').then(
            (m) => m.HealthModule
          ),
      },
      {
        path: 'it-request',
        loadChildren: () =>
          import('../modules/it-request/it-request.module').then(
            (m) => m.ItRequestModule
          ),
      },
      {
        path: '',
        loadChildren: () =>
          import('../modules/home/home.module').then(
            (m) => m.HomeModule
          ),
      },
      {
        path: '**',
        redirectTo: 'error/404',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
