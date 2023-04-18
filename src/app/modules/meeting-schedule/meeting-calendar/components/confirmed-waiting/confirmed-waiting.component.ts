import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import swal from 'sweetalert';
@Component({
  selector: 'app-confirmed-waiting',
  templateUrl: './confirmed-waiting.component.html',
  styleUrls: ['./confirmed-waiting.component.scss'],
  exportAs: 'confirmed-waiting'
})
export class ConfirmedWaitingComponent implements OnInit {

  @Output() loadList = new EventEmitter();
  @Output() detail = new EventEmitter();
  public lichHopChoXacNhan: any[] = [];

  constructor(
    private api: ApiService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.getList();
  }

  public getList(date = new Date()) {

    const firstDay = new Date(date.getFullYear() - 5, date.getMonth(),  2);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    const params = {
      SearchText: '',
      ThoiGianBatDauTu: firstDay.toISOString(),
      ThoiGianBatDauDen: lastDay.toISOString(),
      Page: '1',
      ItemsPerPage: '30',
    };

    this.api.get('/api/lich-lam-viec-list/lich-hop-cho-xac-nhan', params).subscribe(res => {
      if (res) {
        this.lichHopChoXacNhan = res?.items
      }
    })
  }

  public onDongY(item: any) {
    this.api.post('/api/lich-lam-viec-create/dong-y-lich-hop', { congViecId: item?.congViecId }).subscribe(res => {
      if (res?.isSuccess) {
        swal({
          icon: 'success',
          title: 'Đồng ý lịch họp thành công!',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.loadList.emit();
        });
      } else {
        this.api.errorMessage('Đồng ý lịch họp không thành công!');
      }
    }, err => this.api.errorMessage(err));
  }

  public onDelete(item: any) {
    this.api.post('/api/lich-lam-viec-create/tu-choi-lich-hop', { congViecId: item?.congViecId }).subscribe(res => {
      if (res?.isSuccess) {
        swal({
          icon: 'success',
          title: 'Huỷ lịch họp thành công!',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.loadList.emit();
        });
      } else {
        this.api.errorMessage('Huỷ lịch họp không thành công!');
      }
    }, err => this.api.errorMessage(err));
  }
}