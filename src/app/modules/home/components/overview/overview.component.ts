import { OnDestroy } from '@angular/core';
// tslint:disable:no-string-literal
import { ChangeDetectorRef, Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { DatePipe } from '@angular/common';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { DynamicAsideMenuService, MyJob } from 'src/app/_metronic/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  // CalendarView
  public calendarView = CalendarView;
  public view: CalendarView = CalendarView.Month;
  public events: CalendarEvent[] = [];
  public viewDate: Date = new Date();
  public refresh: Subject<any> = new Subject();

  public ListVanBan: any[] = [];
  public ListTinTuc: any[] = [];
  public ListSinhNhatThang: any[] = [];
  public ListNhanVienMoi: any[] = [];
  public choToiPheDuyet: any;

  private subscription: Subscription[] = [];

  constructor(
    private router: Router,
    public api: ApiService,
    private datepipe: DatePipe,
    private cdf: ChangeDetectorRef,
    public translate: TranslateService,
    public asideMenu: DynamicAsideMenuService,
  ) { }

  ngOnInit(): void {
    this.getListVanBan();
    this.getListTinTuc();
    this.getListSinhNhat();
    this.getListNhanVienMoi();
    this.fetchCalendar();
    // Count
    this.subscription.push(this.asideMenu.choToiPheDuyet$.subscribe((res: MyJob) => {
      if (res) {
        this.choToiPheDuyet = res;
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscription.forEach(res => res.unsubscribe());
  }

  public getListVanBan() {
    this.api.get('/api/trangchu/van-ban')
      .subscribe((res: any) => {
        if (res) {
          this.ListVanBan = res?.items;
          this.cdf.detectChanges();
        }
      })
  }

  public getListTinTuc() {
    this.api.get('/api/trangchu/tin-tuc')
      .subscribe((res: any) => {
        if (res) {
          this.ListTinTuc = res?.items;
          this.cdf.detectChanges();
        }
      })
  }

  public getListSinhNhat() {
    this.api.get('/api/trangchu/sinh-nhat-thang')
      .subscribe((res: any) => {
        if (res) {
          this.ListSinhNhatThang = res?.items;
          this.cdf.detectChanges();
        }
      })
  }

  public getListNhanVienMoi() {
    this.api.get('/api/trangchu/nhan-vien-moi')
      .subscribe((res: any) => {
        if (res) {
          this.ListNhanVienMoi = res?.items;
          this.cdf.detectChanges();
        }
      })
  }

  public showNewsDetail(Id) {
    this.router.navigateByUrl(`/detail/${Id}`);
  }

  public showChiTietVanBanDinhChe(Id) {
    this.router.navigateByUrl(`/documents/regime-detail/${Id}`);
  }

  public fetchCalendar(date = this.viewDate) {

    const firstDay = new Date(date.getFullYear(), date.getMonth(), 2);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);

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
