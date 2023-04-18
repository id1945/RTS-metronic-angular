import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarMonthViewDay, CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs';
import { SearchCalendarParams } from '../../personnel/rest-overtime/shared/register-rest.model';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-register-cut-rice',
  templateUrl: './register-cut-rice.component.html',
  styleUrls: ['./register-cut-rice.component.scss']
})
export class RegisterCutRiceComponent implements OnInit {

  public isCollapsedGuide = true;
  public view: CalendarView = CalendarView.Month;
  public viewDate: Date = new Date();
  public events: CalendarEvent[] = [];
  public refresh: Subject<any> = new Subject();
  public dateSelected: Date[] = [];

  constructor(
    public api: ApiService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.onFetchCalendar();
  }

  public dayClicked(day: CalendarMonthViewDay): void {
    // Validate
    if (day['date'] < new Date()) {
      this.api.errorMessage('Đã quá thời gian đăng ký');
    } else if (this.dateSelected.includes(day['date'])) {
      // Remove
      this.dateSelected = this.dateSelected.filter(f => f !== day['date']);
      day.cssClass = '';
    } else if (!this.dateSelected.includes(day['date'])) {
      // Add
      this.dateSelected.push(day['date']);
      day.cssClass = 'cal-day-selected';
    }
  }

  public onUnselect() {
    this.refresh.next();
  }

  public onFetchCalendar(body?: SearchCalendarParams) {

    const firstDay = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 2);
    const lastDay = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);

    const params = {
      NgayThucHienTu: Math.floor(new Date(firstDay).getTime() / 1000),
      NgayThucHienDen: Math.floor(new Date(lastDay).getTime() / 1000),
      IsDoToiTao: true,
      ItemsPerPage: 200
    }
    this.api.get('/api/dangky-catcom-list', params).subscribe(res => {
      if (res) {
        this.events = res?.items?.map(m => {
          if (m) {
            return {
              meta: m,
              id: m?.hoSoId,
              title: m?.lyDo,
              note: m?.tinhTrangDisplay,
              cssClass: m?.tinhTrangKey == 'DaPheDuyet' ? 'status-success' : 'status-warning',
              start: new Date(m?.ngayThucHien * 1000),
              end: new Date(m?.ngayThucHien * 1000)
            }
          }
        })
        this.refresh.next();
        this.dateSelected = [];
      }
    }, err => this.api.errorMessage(err));
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
        // REQUEST DELETE
        this.api.delete(`/api/dangky-catcom-delete?HoSoId=${events[0]?.id}`).subscribe(res => {
          if (res?.isSuccess) {
            swal({
              icon: 'success',
              title: 'Xoá thành công!',
              buttons: {
                ok: this.translate.instant('COMMON.btn.close'),
              },
            } as any).then(() => {
              this.onFetchCalendar();
            });
          } else if (res?.length) {
            this.api.errorMessage('Xoá không thành công!');
          }
        }, err => this.api.errorMessage(err));
      }
    });
  }
}
