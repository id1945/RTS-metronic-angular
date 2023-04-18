import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { TranslationModule } from 'src/app/_metronic/shared/i18n/translation.module';
import { AngularCalendarModule } from 'src/app/_metronic/shared/angular-calendar/angular-calendar.module';
import { CropImageModule } from 'src/app/_metronic/shared/crop-image/crop-image.module';

import { UserProfileComponent } from './user-profile.component';
import { ProfileOverviewComponent } from './profile-overview/profile-overview.component';
import { SharedModule } from 'src/app/_metronic/shared/shared/shared.module';
import { UserInfoComponent } from './profile-overview/components/user-info/user-info.component';
import { ImageSignatureComponent } from './profile-overview/components/image-signature/image-signature.component';
import { NgZorroAntdModule } from 'src/app/_metronic/shared/ng-zorro-antd/ng-zorro-antd.module';
import { ChangePasswordComponent } from './profile-overview/components/change-password/change-password.component';
@NgModule({
  declarations: [
    UserProfileComponent,
    ProfileOverviewComponent,
    UserInfoComponent,
    ImageSignatureComponent,
    ChangePasswordComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    UserProfileRoutingModule,
    NgbDropdownModule,
    NgbTooltipModule,
    TranslationModule,
    AngularCalendarModule,
    CropImageModule,
    SharedModule,
    NgZorroAntdModule
  ]
})
export class UserProfileModule { }
