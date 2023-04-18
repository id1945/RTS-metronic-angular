import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CalendarView } from 'angular-calendar';

@Component({
  selector: 'mwl-utils-calendar-header-date-picker',
  template: `
    <div class="row text-center">
      <div class="col-md-4 d-flex align-items-center justify-content-center">
        <nz-date-picker 
          [nzFormat]="'dd-MM-yyyy'"
          [(ngModel)]="viewDate" 
          (ngModelChange)="viewDateChange.emit($event)" 
          class="form-control input_42 w_200"></nz-date-picker>
      </div>
      <div class="col-md-4 d-flex align-items-center justify-content-center">
        <h3 class="m-0">{{ viewDate | calendarDate: view + 'ViewTitle':locale }}</h3>
      </div>
      <div class="col-md-4 d-flex align-items-center justify-content-center">
        <div class="btn-group">
          <div
            class="btn btn-primary"
            mwlCalendarPreviousView
            [view]="view"
            [(viewDate)]="viewDate"
            (viewDateChange)="viewDateChange.next(viewDate)"
          >
          Trước
          </div>
          <div
            class="btn btn-outline-secondary px-3"
            mwlCalendarToday
            [(viewDate)]="viewDate"
            (viewDateChange)="viewDateChange.next(viewDate)"
          >
          Hôm nay
          </div>
          <div
            class="btn btn-primary"
            mwlCalendarNextView
            [view]="view"
            [(viewDate)]="viewDate"
            (viewDateChange)="viewDateChange.next(viewDate)"
          >
            Kế tiếp
          </div>
        </div>
      </div>
    </div>
    <br />
  `,
})
export class CalendarHeaderDatePickerComponent {

  @Input() view: CalendarView;

  @Input() viewDate: Date;

  @Input() locale: string = 'vi';

  @Output() viewDateChange = new EventEmitter<Date>();
}
