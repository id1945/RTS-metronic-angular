import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, Subject, Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Params } from '@angular/router';
import { CalendarEvent, CalendarMonthViewDay, CalendarView } from 'angular-calendar';
import { DatePipe } from '@angular/common';
import swal from 'sweetalert';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { RegisterRestService } from 'src/app/modules/personnel/rest-overtime/shared/register-rest.service';
import { SearchCalendarParams } from 'src/app/modules/personnel/rest-overtime/shared/register-rest.model';
import { PER_SCREEN } from '../../../shared/constant';
const HEADER_ACCEPT = { headers: { 'Accept': 'application/json' } };

@Component({
  selector: 'app-calendar-register-rest-overtime',
  templateUrl: './calendar-register-rest-overtime.component.html',
  styleUrls: ['./calendar-register-rest-overtime.component.scss']
})
export class CalendarRegisterRestOvertimeComponent implements OnInit, OnChanges {

  @Input() params: Params;
  @Input() formGroup1: FormGroup;
  @Input() formGroup2: FormGroup;
  @Input() formGroup3: FormGroup;

  public view: CalendarView = CalendarView.Month;
  public viewDate: Date = new Date();
  public events: CalendarEvent[] = [];
  public refresh: Subject<any> = new Subject();
  private sb: Subscription[] = [];

  public PER_SCREEN = PER_SCREEN;

  // Select range
  public searchParams: any;

  constructor(
    private api: ApiService,
    private datepipe: DatePipe,
    private registerRest: RegisterRestService,
    public translate: TranslateService // Get translate.currentLang for calendar
  ) {
  }

  ngOnInit(): void {
    this.sb.push(this.registerRest.searchParams$.subscribe(res => {
      this.searchParams = res;
      this.fetchCalendar(res);
    }));
    // FormGroup handle => Higlight calendar
    [1, 2, 3].forEach(idx => this[`formGroup${idx}`].valueChanges.subscribe(res => res && this.refresh.next()));
  }

  ngOnChanges(): void {
    this.fetchCalendar(this.searchParams);
    // FormGroup handle => Higlight calendar
    [1, 2, 3].forEach(idx => this[`formGroup${idx}`].valueChanges.subscribe(res => res && this.refresh.next()));
  }

  /**
   * Select range
   * @param param
   */
  public beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    let start = null, end = null;
    // Update start end date
    switch (this.params?.screen) {
      case PER_SCREEN.HOLIDAY:
        start = new Date(this.formGroup1.controls.FROMDATE.value).setHours(0, 0, 0, 0);
        end = new Date(this.formGroup1.controls.TODATE.value).setHours(0, 0, 0, 0);
        break;
      case PER_SCREEN.OVERTIME:
        start = new Date(this.formGroup2.controls.FromHour.value).setHours(0, 0, 0, 0);
        end = new Date(this.formGroup2.controls.ToHour.value).setHours(0, 0, 0, 0);
        break;
      case PER_SCREEN.WLEO:
        start = new Date(this.formGroup3.controls.FROMHOUR.value).setHours(0, 0, 0, 0);
        end = new Date(this.formGroup3.controls.TOHOUR.value).setHours(0, 0, 0, 0);
        break;
    }
    // Higlight select
    body.forEach((day) => {
      day.cssClass = (start <= day.date && day.date <= end) ? 'cal-day-selected' : '';
    });
  }

  // Emit FromDate
  public viewDateChange(e) {
    const date = new Date(e);
    this.registerRest.searchParams$.next({
      ...this.registerRest.searchParams$.value,
      FromDate: this.datepipe.transform(new Date(date.getFullYear(), date.getMonth() - 1, 20), 'yyyy-MM-dd'),
      ToDate: this.datepipe.transform(new Date(date.getFullYear(), date.getMonth() + 1, 10), 'yyyy-MM-dd'),
    })
  }

  /**
   * ///////////////////////////////////
   * /////////ACTION ON CALENDAR////////
   * ///////////////////////////////////
   */

  /**
   * Gửi duyệt
   * @param events 
   * @returns 
   */
  public onRequestApprove(events: any) {
    if (events?.length === 0) {
      return false;
    }

    // UPDATE BODY PARAMS
    const requestArray = [];
    events.forEach(ev => {
      // 0: Đăng ký
      if (ev?.meta?.STATUS === 0) {
        let url = null;
        let bodyParams = null;
        switch (this.params?.screen) {
          case PER_SCREEN.HOLIDAY:
            url = '/API/Mobile/SendApproveLeave';
            bodyParams = {
              RegisterID: ev.id,
              Process: "LEAVE"
            }
            break;
          case PER_SCREEN.OVERTIME:
            url = '/API/Mobile/SendApprove';
            bodyParams = {
              RegisterID: ev.id,
              Process: "OVERTIME"
            }
            break;
          case PER_SCREEN.WLEO:
            url = '/API/Mobile/SendApprove';
            bodyParams = {
              RegisterID: ev.id,
              Process: "WLEO"
            }
            break;
        }
        // Add request
        requestArray.push(url && this.api.post(url, bodyParams, HEADER_ACCEPT))
      } else if (ev?.meta?.STATUS === 1) {
        // 1: Chờ phê duyệt
        this.api.errorMessage('Đăng ký đang được chờ phê duyệt.');
      } else if (ev?.meta?.STATUS === 2) {
        // 2: Phê duyệt
        this.api.errorMessage('Đăng ký đã được phê duyệt.');
      } else if (ev?.meta?.STATUS === 3) {
        // 3: Từ chối
        this.api.errorMessage('Đăng ký đã bị từ chối.');
      }
    });

    // Loading on
    this.api.loadingCustomOn();
    // REQUEST
    forkJoin(requestArray).subscribe(res => {
      if (res?.length && res[0]['ResponseStatus'] === 1) {
        swal({
          icon: 'success',
          title: 'Gửi duyệt thành công!',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.fetchCalendar(this.searchParams);
          this.refresh.next();
        });
      } else if (res?.length) {
        this.api.errorMessage(res[0]['Message']);
      }
      // Loading off
      this.api.loadingCustomOff();
    }, err => {
      this.api.errorMessage(err);
      // Loading off
      this.api.loadingCustomOff();
    });
  }

  /**
   * Xoá
   * @param events 
   * @returns 
   */
  public onDeleteEvent(events: CalendarEvent[] = []) {
    if (events?.length === 0) {
      return false;
    }
    swal({
      icon: 'warning',
      title: this.translate.instant('COMMON.btn.are_you_sure_delete'),
      buttons: {
        confirm: this.translate.instant('COMMON.btn.ok'),
        cancel: this.translate.instant('COMMON.btn.cancel')
      },
    } as any).then((confirm) => {
      if (confirm) {
        // UPDATE BODY PARAMS
        const requestArray = [];
        events.forEach(ev => {
          if (ev?.meta?.STATUS === 0 || ev?.meta?.STATUS === 1) {
            // Được phép xoá các status còn lại
            let url = null;
            switch (this.params?.screen) {
              case PER_SCREEN.HOLIDAY:
                url = '/API/Mobile/DeleteRegister';
                break;
              case PER_SCREEN.OVERTIME:
                url = '/API/Mobile/DeleteRegister';
                break;
              case PER_SCREEN.WLEO:
                url = '/API/Mobile/DeleteRegister';
                break;
            }
            requestArray.push(url && this.api.post(url, { RegisterID: ev.id }, HEADER_ACCEPT))
          } else if (ev?.meta?.STATUS === 2) {
            // 2: Đã phê duyệt!
            this.api.errorMessage(`Không thể xoá những đăng ký đã phê duyệt!`);
          } else if (ev?.meta?.STATUS === 3) {
            // 3: Từ chối
            this.api.errorMessage('Không thể xoá những đăng ký đã bị từ chối!');
          }
        });

        // REQUEST DELETE
        forkJoin(requestArray).subscribe(res => {
          if (res?.length && res[0]['ResponseStatus'] === 1) {
            swal({
              icon: 'success',
              title: 'Xoá thành công!',
              buttons: {
                ok: this.translate.instant('COMMON.btn.close'),
              },
            } as any).then(() => {
              this.fetchCalendar(this.searchParams);
              this.refresh.next();
            });
          } else if (res?.length) {
            this.api.errorMessage(res[0]['Message']);
          }
        }, err => this.api.errorMessage(err));
      }
    });
  }

  /**
   * ///////////////////////////////////
   * /////////LOAD DATA CALENDAR////////
   * ///////////////////////////////////
   */
  public fetchCalendar(body: SearchCalendarParams): void {
    if (body?.Status && body?.FromDate) {

      let url = null;
      switch (this.params?.screen) {
        case PER_SCREEN.HOLIDAY:
          url = '/API/Mobile/SearchRegisterLeave';
          break;
        case PER_SCREEN.OVERTIME:
          url = '/API/Mobile/SearchRegisterOT';
          break;
        case PER_SCREEN.WLEO:
          url = '/API/Mobile/SearchRegisterWLEO';
          break;
        default:
          break;
      }

      url && this.api.post(url, body, HEADER_ACCEPT).subscribe(res => {
        if (res) {
          this.events = res?.Items?.map(m => {
            if (m) {
              let dataByScreen = {
                id: m?.ID,
                note: m?.NOTE,
                cssClass: m?.STATUS == 0 ? 'status-success' : m?.STATUS == 1 ? 'status-warning' : m?.STATUS == 2 ? 'status-primary' : 'status-danger',
                meta: m
              }
              switch (this.params?.screen) {
                case PER_SCREEN.HOLIDAY:
                  return {
                    ...dataByScreen,
                    title: m?.TYPELEAVE,
                    start: new Date(m?.LEAVEFROM),
                    end: new Date(m?.LEAVETO)
                  }
                case PER_SCREEN.OVERTIME:
                  return {
                    ...dataByScreen,
                    title: `<p class="mb-0">Từ ${this.datepipe.transform(new Date(m?.FROMHOUR), 'HH:mm')}</p><p class="mb-0">Đến ${this.datepipe.transform(new Date(m?.TOHOUR), 'HH:mm')}</p>`,
                    start: new Date(m?.OTDATE)
                  }
                case PER_SCREEN.WLEO:
                  return {
                    ...dataByScreen,
                    title: m?.REGTYPE,
                    start: new Date(m?.FROMDATE),
                    end: new Date(m?.TODATE)
                  }
              }
              return
            }
          })
          this.refresh.next();
        }
      });
    }
  }

  // unsubscribe
  ngOnDestroy(): void {
    this.sb.forEach(res => res.unsubscribe());
  }
}
