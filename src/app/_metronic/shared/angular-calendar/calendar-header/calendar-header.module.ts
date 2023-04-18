import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'angular-calendar';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

import { CalendarHeaderComponent } from '../calendar-header/calendar-header.component';
import { CalendarHeaderDatePickerComponent } from './calendar-header-date-picker.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    NzDatePickerModule
  ],
  declarations: [
    CalendarHeaderComponent,
    CalendarHeaderDatePickerComponent
  ],
  exports: [
    CalendarHeaderComponent,
    CalendarHeaderDatePickerComponent
  ],
})
export class CalendarHeaderModule { }
