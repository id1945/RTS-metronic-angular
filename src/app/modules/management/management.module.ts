import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagementRoutingModule } from './management-routing.module';
import { ManagementComponent } from './management.component';
import { PostsListComponent } from './posts-list/posts-list.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/_metronic/shared/shared/shared.module';
import { FormPostsModalComponent } from './posts-list/components/form-posts-modal/form-posts-modal.component';
import { NgxSummernoteModule } from 'ngx-summernote';
import { TranslationModule } from 'src/app/_metronic/shared/i18n/translation.module';
import { NgZorroAntdModule } from 'src/app/_metronic/shared/ng-zorro-antd/ng-zorro-antd.module';
import { PhotoLibraryListComponent } from './photo-library-list/photo-library-list.component';
import { FormPhotoLibraryModalComponent } from './photo-library-list/components/form-photo-library-modal/form-photo-library-modal.component';
import { DocumentsListComponent } from './documents-list/documents-list.component';
import { FormDocumentsModalComponent } from './documents-list/components/form-documents-modal/form-documents-modal.component';
import { UsersListComponent } from './users-list/users-list.component';
import { FormUsersModalComponent } from './users-list/components/form-users-modal/form-users-modal.component';
import { PopupListComponent } from './popup-list/popup-list.component';
import { FormPopupModalComponent } from './popup-list/components/form-popup-modal/form-popup-modal.component';
import { VibersListComponent } from './vibers-list/vibers-list.component';
import { FormVibersModalComponent } from './vibers-list/components/form-vibers-modal/form-vibers-modal.component';
import { VideoLibraryListComponent } from './video-library-list/video-library-list.component';
import { FormVideoLibraryModalComponent } from './video-library-list/components/form-video-library-modal/form-video-library-modal.component';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { FormGroupsModalComponent } from './groups-list/components/form-groups-modal/form-groups-modal.component';
import { FlowsListComponent } from './flows-list/flows-list.component';
import { FormFlowsModalComponent } from './flows-list/components/form-flows-modal/form-flows-modal.component';


@NgModule({
  declarations: [
    ManagementComponent,
    PostsListComponent,
    FormPostsModalComponent,
    FormPhotoLibraryModalComponent,
    PhotoLibraryListComponent,
    DocumentsListComponent,
    FormDocumentsModalComponent,
    UsersListComponent,
    FormUsersModalComponent,
    PopupListComponent,
    FormPopupModalComponent,
    VibersListComponent,
    FormVibersModalComponent,
    VideoLibraryListComponent,
    FormVideoLibraryModalComponent,
    GroupsListComponent,
    FormGroupsModalComponent,
    FlowsListComponent,
    FormFlowsModalComponent
  ],
  imports: [
    CommonModule,
    ManagementRoutingModule,
    // import lib
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    NgbModalModule,
    TranslationModule,
    NgxSummernoteModule,
    SharedModule,
  ]
})
export class ManagementModule { }
