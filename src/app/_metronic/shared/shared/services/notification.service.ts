import { AuthService } from 'src/app/modules/auth';
import { BehaviorSubject } from 'rxjs';
import { Injectable, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Router } from '@angular/router';
import { ApiService } from '../../http/api.service';

interface Notification {
  action: string;
  anhDaiDienResize: string;
  idCongViec: number;
  isDaXem: true
  kieuCongViec: number;
  ngayTao: number;
  noiDung: string;
  thongBaoId: number;
  tieuDe: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnInit {

  private hubConnection: HubConnection;
  public count$ = new BehaviorSubject(0);
  public list$ = new BehaviorSubject(null);

  constructor(
    private router: Router,
    private api: ApiService,
    private auth: AuthService,
  ) { }

  ngOnInit(): void {
    this.connect();
    this.register();
    this.on();
  }

  private connect(): void {
    this.hubConnection = new HubConnectionBuilder().withUrl('/notification/hub').build();
    this.hubConnection.start();
  }

  private register() {
    setTimeout(() => {
      localStorage.setItem('signalrConnectionId', JSON.stringify(this.hubConnection?.connectionId))
      const options = { headers: { connectionId: this.hubConnection?.connectionId?.toString() } };
      this.api.postOffLoading('/api/notification-create/register', null, options).subscribe(res => {
        this.getCount();
      })
    }, 2000);
  }

  private on() {
    // Listen!
    this.hubConnection?.on('OnNewNotification', () => {
      this.getCount();
    });
  }

  private getCount() {
    this.api.getOffLoading('/api/notification-list/thongbao-moi-count', null).subscribe(res => {
      this.count$.next(res) // Emit notification number.
    })
  }

  public getList() {
    const query = {
      Page: 1,
      ItemsPerPage: 50
    }
    this.api.getOffLoading('/api/notification-list', query).subscribe(res => {
      if (res) {
        this.list$.next(res?.items);
      }
    })
  }

  public onSee(item: Notification) {
    this.api.putOffLoading('/api/notification-update/da-xem/' + item?.thongBaoId, null).subscribe(res => {
      if (res != null) {
        this.getList();
        // 34002 redirect to Detail YCMH
        if (item?.kieuCongViec === 34002) {
          this.router.navigate(['/purchase', 'detail', item?.idCongViec, item?.action]);
        }
        if (item?.kieuCongViec === 34003) {
          this.router.navigate(['/purchase/supplier-selection', 'detail', item?.idCongViec]);
        }
        if (item?.kieuCongViec === 34004) {
          this.router.navigate(['/purchase/contract', 'detail', item?.idCongViec]);
        }
        // 14 Tờ trình
        if (item?.kieuCongViec === 14) {
          this.router.navigate(['/submissions', 'detail', item?.idCongViec]);
        }
        // 8 Xe đưa đón/
        if (item?.kieuCongViec === 8) {
          this.router.navigate(['/administration', 'registervehicle-detail', item?.idCongViec]);
        }
        // 8 chuyến xe đưa đón/
        if (item?.kieuCongViec === 69001) {
          this.router.navigate(['/administration', 'bussinesstrip-detail', item?.idCongViec]);
        }
        // 8 Kế hoạch công tác/
        if (item?.kieuCongViec === 11) {
          this.router.navigate(['/personnel/month-plan', 'detail', item?.idCongViec]);
        }
        // 8 Kế hoạch công tác/
        if (item?.kieuCongViec === 12) {
          this.router.navigate(['/personnel/mission', 'detail', item?.idCongViec]);
        }
        // 5 chuyển phát nhanh
        if (item?.kieuCongViec === 5) {
          this.router.navigate(['/administration', 'delivery']);
        }
        // "24;25;26;27;28;29;30;35;36;42;43;31;37;34;33;32;38;39;40;41" Yêu cầu mua sắm
        if ([24, 25, 26, 27, 28, 29, 30, 35, 36, 42, 43, 31, 37, 34, 33, 32, 38, 39, 40, 41].includes(item?.kieuCongViec)) {
          this.router.navigate(['/submissions', 'payment-detail', item?.idCongViec]);
        }
        // 46,48 Danh sách KPI Quý
        if ([46, 48].includes(item?.kieuCongViec)) {
          this.router.navigate(['/KPI', 'kpi']);
        }
        // 47 Danh Sách Mục Tiêu - KHCV - KPI Bộ Phận
        if ([47].includes(item?.kieuCongViec)) {
          this.router.navigate(['/KPI', 'target-kpi-parts']);
        }
        // 34000 Survey
        if (item?.kieuCongViec === 34000) {
          this.redirectToSurvey(item);
        }
        // 69000 Bưu phẩm của tôi
        if (item?.kieuCongViec === 69000) {
          this.router.navigate(['/administration', 'parcel']);
        }
      }
    })
  }

  private redirectToSurvey(item: Notification) {
    const headers = new Headers();
    headers.append("Authorization", "Bearer AKBSYSALBASKYGDSKBSLSDSF(SD^&*%SDGSJDI^SDSDTIGSD^%FISDYFTSD^IFSDIUFYSGIDUF^SDTY");
    headers.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email: this.auth.currentUserValue.email,
      survey_id: item?.idCongViec
    });

    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: raw,
    };

    fetch('https://irm.tcmotor.vn/tcm_survey/start_survey', requestOptions)
      .then(response => response.json())
      .then(result => window.open(result?.result?.survey_url, '_blank'))
      .catch(error => console.log('tcm_survey/start_survey:', error));
  }

  public onOpen() {
    this.api.putOffLoading('/api/notification-update/thongbao-moi', null).subscribe(res => {
      this.getCount();
    });
  }

}
