import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/_metronic/shared/http/auth.guard';
import { ContactsListComponent } from './contacts-list/contacts-list.component';
import { ContactsComponent } from './contacts.component';
import { IntroGalleryComponent } from './intro/components/intro-gallery/intro-gallery.component';
import { IntroComponent } from './intro/intro.component';
import { PersonalInformationComponent } from './personal-information/personal-information.component';

const routes: Routes = [
  {
    path: '',
    component: ContactsComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'intro',
        component: IntroComponent,
        data: { screenKey: 'Introduction', action: 'Index' },
      },
      {
        path: 'intro/gallery/:id',
        component: IntroGalleryComponent,
        data: { screenKey: 'Introduction', action: 'Index' },
      },
      {
        path: 'list',
        component: ContactsListComponent,
        data: { screenKey: 'DanhBaHTC', action: 'Index' },
      },
      {
        path: 'personal-information/:id',
        component: PersonalInformationComponent,
        data: { screenKey: 'DanhBaHTC', action: 'Index' },
      },
      { path: '', redirectTo: 'contacts', pathMatch: 'full' },
      { path: '**', redirectTo: 'contacts', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactsRoutingModule { }
