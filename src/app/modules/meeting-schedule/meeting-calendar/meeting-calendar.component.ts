import { TranslateService } from '@ngx-translate/core';
import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { DatePipe } from '@angular/common';
import { MeetingScheduleCreatedComponent } from './components/meeting-schedule-created/meeting-schedule-created.component';
import { ConfirmedWaitingComponent } from './components/confirmed-waiting/confirmed-waiting.component';

@Component({
  selector: 'app-meeting-calendar',
  templateUrl: './meeting-calendar.component.html',
  styleUrls: ['./meeting-calendar.component.scss']
})
export class MeetingCalendarComponent implements OnInit {

  @ViewChild('meetingSchedule') meetingSchedule: MeetingScheduleCreatedComponent;
  @ViewChild('confirmedWaiting') confirmedWaiting: ConfirmedWaitingComponent;

  // CalendarView
  public calendarView = CalendarView;
  public view: CalendarView = CalendarView.Week; // Init show
  public events: CalendarEvent[] = [];
  public viewDate: Date = new Date();
  public refresh: Subject<any> = new Subject();

  constructor(
    public api: ApiService,
    private datepipe: DatePipe,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.fetchCalendar();
  }

  public fetchCalendar(date = this.viewDate) {

    const firstDay = new Date(date.getFullYear(), date.getMonth(), 2);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    // Không chạy khi lần đầu vào page
    this.meetingSchedule?.getList(date);
    this.confirmedWaiting?.getList(date);

    const params = {
      ThoiGianBatDauTu: Math.floor(new Date(firstDay).getTime() / 1000),
      ThoiGianBatDauDen: Math.floor(new Date(lastDay).getTime() / 1000),
    }

    this.api.get('/api/lich-lam-viec-list', params).subscribe(res => {
      if (res) {
        this.events = res?.items?.map(m => {
          const startTime = m?.thoiGianBatDau ? this.datepipe.transform(m.thoiGianBatDau * 1000, 'HH:mm') : '';
          const endTime = m?.thoiGianKetThuc ? this.datepipe.transform(m.thoiGianKetThuc * 1000, 'HH:mm') : '';
          const title = m?.kieuCongViec == 1 ?
            `<p class="mb-0"><b>${startTime} - ${endTime}</b></p>
            <p class="mb-0">${m?.tieuDe ?? ''}</p>
            <p class="mb-0">${m?.tenPhongHop ?? '(Họp trực tuyến)'}</p>` :
            `<p class="mb-0"><b>${startTime} - ${endTime}</b></p>
            <p class="mb-0">${m?.tieuDe ?? ''}</p>`;
          return {
            id: m?.congViecId,
            cssClass: m?.tenPhongHop ? 'status-phonghop' : 'status-congviec',
            title: title,
            start: new Date(m?.thoiGianBatDau * 1000),
            end: new Date(m?.thoiGianKetThuc * 1000),
            meta: { isPhongHop: m?.tenPhongHop ? true : false, ...m },
          }
        })
        this.refresh.next();
      }
    });
  }
}
