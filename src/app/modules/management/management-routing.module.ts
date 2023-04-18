import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/_metronic/shared/http/auth.guard';
import { DocumentsListComponent } from './documents-list/documents-list.component';
import { FlowsListComponent } from './flows-list/flows-list.component';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { ManagementComponent } from './management.component';
import { PhotoLibraryListComponent } from './photo-library-list/photo-library-list.component';
import { PopupListComponent } from './popup-list/popup-list.component';
import { PostsListComponent } from './posts-list/posts-list.component';
import { UsersListComponent } from './users-list/users-list.component';
import { VibersListComponent } from './vibers-list/vibers-list.component';
import { VideoLibraryListComponent } from './video-library-list/video-library-list.component';

const routes: Routes = [
  {
    path: '',
    component: ManagementComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'posts',
        component: PostsListComponent,
        data: { screenKey: 'BaiViet', action: 'Index' },
      },
      {
        path: 'post-library',
        component: PhotoLibraryListComponent,
        data: { screenKey: 'ThuVienAnhCongTy', action: 'Index' },
      },
      {
        path: 'documents',
        component: DocumentsListComponent,
        data: { screenKey: 'TaiLieu', action: 'Index' },
      },
      {
        path: 'users',
        component: UsersListComponent,
        data: { screenKey: 'NguoiDung', action: 'Index' },
      },
      {
        path: 'groups',
        component: GroupsListComponent,
        data: { screenKey: 'NhomNguoiDung', action: 'Index' },
      },
      {
        path: 'flows',
        component: FlowsListComponent,
        data: { screenKey: 'QuyTrinh', action: 'Index' },
      },
      {
        path: 'vibers',
        component: VibersListComponent,
        data: { screenKey: 'ViberMessage', action: 'Index' },
      },
      {
        path: 'popup',
        component: PopupListComponent,
        data: { screenKey: 'Popup', action: 'Index' },
      },
      {
        path: 'video-library',
        component: VideoLibraryListComponent,
        data: { screenKey: 'ThuVienVideoCongTy', action: 'Index' },
      },
      { path: '', redirectTo: 'management', pathMatch: 'full' },
      { path: '**', redirectTo: 'management', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }
