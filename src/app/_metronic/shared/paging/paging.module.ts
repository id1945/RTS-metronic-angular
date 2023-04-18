import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { PaginatorComponent } from './paginator.component';
import { NgPagination } from './ng-pagination/ng-pagination.component';
@NgModule({
  declarations: [
    PaginatorComponent,
    NgPagination
  ],
  imports: [
    CommonModule,
    FormsModule,
    InlineSVGModule
  ],
  exports: [
    PaginatorComponent,
    NgPagination
  ],
})
export class PagingModule { }
