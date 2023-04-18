import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InlineSVGModule } from 'ng-inline-svg';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NgbDatepickerModule, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { ContactsRoutingModule } from './contacts-routing.module';
import { SliderModule } from 'src/app/_metronic/shared/slider/slider.module';
import { SharedModule } from 'src/app/_metronic/shared/shared/shared.module';
import { TranslationModule } from 'src/app/_metronic/shared/i18n/translation.module';
import { NgZorroAntdModule } from 'src/app/_metronic/shared/ng-zorro-antd/ng-zorro-antd.module';
import { DropdownMenusModule } from 'src/app/_metronic/partials/content/dropdown-menus/dropdown-menus.module';

import { IntroComponent } from './intro/intro.component';
import { ContactsComponent } from './contacts.component';
import { ContactsListComponent } from './contacts-list/contacts-list.component';
import { IntroGalleryComponent } from './intro/components/intro-gallery/intro-gallery.component';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { EditContactModalComponent } from './contacts-list/components/edit-contact-modal/edit-contact-modal.component';
import { DeleteContactModalComponent } from './contacts-list/components/delete-contact-modal/delete-contact-modal.component';

@NgModule({
  declarations: [
    ContactsComponent,
    ContactsListComponent,
    PersonalInformationComponent,
    EditContactModalComponent,
    DeleteContactModalComponent,
    IntroComponent,
    IntroGalleryComponent,
  ],
  imports: [
    CommonModule,
    ContactsRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    InlineSVGModule,
    NgbModalModule,
    DropdownMenusModule,
    NgbTooltipModule,
    NgbDatepickerModule,
    NgbModule,
    NgxExtendedPdfViewerModule,
    TranslationModule,
    SharedModule,
    SliderModule
  ]
})
export class ContactsModule { }
