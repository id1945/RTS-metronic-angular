import { ApiService } from 'src/app/_metronic/shared/http/api.service'
import { Component, OnInit } from '@angular/core'
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SearchCalendarParams } from '../rest-overtime/shared/register-rest.model';

const HEADER_ACCEPT = { headers: { 'Accept': 'application/json' } };
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss']
})
export class TimesheetComponent implements OnInit {

  // CalendarView
  public calendarView = CalendarView;
  public view: CalendarView = CalendarView.Month;
  public events: CalendarEvent[] = [];
  public viewDate: Date = new Date();
  public refresh: Subject<any> = new Subject();

  public formGroup: FormGroup;

  public paginator = {
    FromDate: new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 20),
    ToDate: new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 10),
    Status: '-1',
    Page: 1,
    PageSize: 50
  }

  constructor(
    private api: ApiService,
    private datepipe: DatePipe,
    public translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      FROMDATE: new FormControl(this.paginator.FromDate),
      TODATE: new FormControl(this.paginator.ToDate),
    });

    // Init fetch
    this.fetchCalendar({
      ...this.paginator,
      FromDate: this.datepipe.transform(this.paginator.FromDate, 'yyyy-MM-dd'),
      ToDate: this.datepipe.transform(this.paginator.ToDate, 'yyyy-MM-dd')
    });
  }

  get f() { return this.formGroup.controls; }

  /**
   * STATUS
   * 0 Đăng ký
   * 1 Chờ phê duyệt
   * 2 Đã phê duyệt
   * 3 Từ chối
   * @param body
   */
  public async fetchCalendar(body: SearchCalendarParams): Promise<void> {
    if (body?.Status && body?.FromDate) {
      this.events = [];

      // API xin nghỉ
      const PUSH_HOLIDAY = (res) => {
        const HO = res?.Items?.filter(f => f?.STATUS == 0 || f?.STATUS == 1);
        const holidayEvents = HO?.map(m => {
          return {
            id: m?.ID,
            note: m?.NOTE,
            cssClass: m?.STATUS == 0 ? 'status-holiday' : 'status-pendding',
            meta: m,
            title: m?.TYPELEAVE,
            start: new Date(m?.LEAVEFROM),
            end: new Date(m?.LEAVETO)
          };
        }) ?? [];
        this.events = [...this.events, ...holidayEvents];
      }

      // API xin nghỉ không lương dưới nửa ngày
      const PUSH_WLEO = (res) => {
        const WL = res?.Items?.filter(f => f?.STATUS == 0 || f?.STATUS == 1);
        const wleoEvents = WL?.map(m => {
          return {
            id: m?.ID,
            note: m?.NOTE,
            cssClass: m?.STATUS == 0 ? 'status-wleo' : 'status-pendding',
            meta: m,
            title: m?.REGTYPE,
            start: new Date(m?.FROMDATE),
            end: new Date(m?.TODATE)
          };
        }) ?? [];
        this.events = [...this.events, ...wleoEvents];
      }

      // API giải trình công
      const PUSH_EXPLAIN = (res) => {
        const EX = res?.Items?.filter(f => f?.STATUS_ID == 0 || f?.STATUS_ID == 1 || f?.STATUS_ID == 2);
        const overtimeEvents = EX?.map(m => {
          return {
            id: m?.ID,
            note: m?.STATUS_ID == 0 ? m?.TYPE_ERROR : `${m?.REASON_TYPE ?? ''} ${m?.NOTE ?? ''}`,
            cssClass: m?.STATUS_ID == 0 ? 'status-unexplained' : m?.STATUS_ID == 1 ? 'status-pendding' : 'status-explain',
            meta: m,
            title: `${m?.MANUAL_CODE ? m?.MANUAL_CODE + ':' : ''} ${m?.TYPE_ERROR ?? ''}`,
            start: new Date(m?.WORKINGDAY)
          };
        }) ?? [];
        this.events = [...this.events, ...overtimeEvents];
      }

      // On loading 
      this.api.loadingCustomOn();

      const HOLIDAY = await this.api.post('/API/Mobile/SearchRegisterLeave', body, HEADER_ACCEPT).toPromise();
      const WLEO = await this.api.post('/API/Mobile/SearchRegisterWLEO', body, HEADER_ACCEPT).toPromise();
      const EXPLAN = await this.api.post('/API/Mobile/SearchTimeExplain', body, HEADER_ACCEPT).toPromise();

      // Off loading
      this.api.loadingCustomOff();

      // Xin nghỉ
      PUSH_HOLIDAY(HOLIDAY);

      // Xin nghỉ theo giờ
      PUSH_WLEO(WLEO);

      // Chấm công không hợp lệ / Chấm công hợp lệ
      PUSH_EXPLAIN(EXPLAN);

      // Detector calendar
      this.refresh.next();
    }
  }

  public viewDateChange(e) {
    const date = new Date(e);
    this.fetchCalendar({
      ...this.paginator,
      FromDate: this.datepipe.transform(new Date(date.getFullYear(), date.getMonth() - 1, 20), 'yyyy-MM-dd'),
      ToDate: this.datepipe.transform(new Date(date.getFullYear(), date.getMonth() + 1, 10), 'yyyy-MM-dd'),
    })
  }
}
