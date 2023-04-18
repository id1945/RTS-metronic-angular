import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TruncatePipe } from './pipes/truncate.pipe';
import { PagingModule } from '../paging/paging.module';
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { TimeLineApproveComponent } from './components/time-line-approve/time-line-approve.component';
import { ImportFileTemplateComponent } from './components/import-file-template/import-file-template.component';
import { LinkFileComponent } from './components/link-file/link-file.component';
import { TranslationModule } from '../i18n/translation.module';
import { NgZorroAntdModule } from '../ng-zorro-antd/ng-zorro-antd.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SettingColumnModalComponent } from './components/setting-column-modal/setting-column-modal.component';
import { SelectFileComponent } from './components/select-file/select-file.component';
import { SafePipe } from './pipes/safe.pipe';
import { SelectTagsButtonComponent } from './components/select-tags-button/select-tags-button.component';
import { ConfirmInputBasicComponent } from './components/confirm-input-basic/confirm-input-basic.component';
import { BasicContentModalComponent } from './components/basic-content-modal/basic-content-modal.component';
import { TableComponent } from './components/table/table.component';
import { ConfirmInputFileComponent } from './components/confirm-input-file/confirm-input-file.component';
import { CanAccessDirective } from './directives/can-access.directive';


@NgModule({
  declarations: [
    NumbersOnlyDirective,
    TruncatePipe,
    SafePipe,
    LinkFileComponent,
    TimeLineApproveComponent,
    ImportFileTemplateComponent,
    SettingColumnModalComponent,
    SelectFileComponent,
    SelectTagsButtonComponent,
    ConfirmInputBasicComponent,
    BasicContentModalComponent,
    TableComponent,
    ConfirmInputFileComponent,
    CanAccessDirective,
  ],
  imports: [
    CommonModule,
    PagingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    TranslationModule,
    NgZorroAntdModule
  ],
  exports: [
    NumbersOnlyDirective,
    TruncatePipe,
    SafePipe,
    PagingModule,
    LinkFileComponent,
    TimeLineApproveComponent,
    ImportFileTemplateComponent,
    SettingColumnModalComponent,
    SelectFileComponent,
    SelectTagsButtonComponent,
    ConfirmInputBasicComponent,
    BasicContentModalComponent,
    TableComponent,
    ConfirmInputFileComponent,
    CanAccessDirective
  ],
  providers: []
})
export class SharedModule { }
