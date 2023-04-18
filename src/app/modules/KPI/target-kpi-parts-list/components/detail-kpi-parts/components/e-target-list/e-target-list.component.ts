import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { ConfirmInputBasicComponent } from 'src/app/_metronic/shared/shared/components/confirm-input-basic/confirm-input-basic.component';
import { Columns, DataTable } from 'src/app/_metronic/shared/shared/models/dataTable';
import { Permission } from './../../detail-kpi-parts.component';
import swal from 'sweetalert';
import { MucTieuBoPhan } from './models/e-target-list.model';
@Component({
  selector: 'app-e-target-list',
  templateUrl: './e-target-list.component.html',
  styleUrls: ['./e-target-list.component.scss'],
  exportAs: 'target'
})
export class ETargetListComponent implements OnInit {

  @ViewChild('confirmAccept') confirmAccept: ConfirmInputBasicComponent;
  @ViewChild('confirmReject') confirmReject: ConfirmInputBasicComponent;

  @Input() id: string;
  @Input() permission: Permission;

  // Table
  public dataTable: DataTable<MucTieuBoPhan> = {
    items: [],
    columns: [] as Columns[],
    isActive: true
  };

  constructor(
    private api: ApiService,
    private translate: TranslateService
  ) {
    // Table config title and field
    this.dataTable.columns = [
      {
        field: 'stt',
        title: 'STT',
        width: '30px',
        align: 'center',
        isActive: true
      },
      {
        field: 'mucTieu',
        title: 'Mục tiêu',
        width: '250px',
        isActive: true,
        isRequired: true
      },
      {
        field: 'ghiChu',
        title: 'Ghi chú',
        width: '150px',
        isActive: true
      },
      {
        field: 'isAllowRaSoat',
        title: 'Rà soát',
        width: '100px',
        align: 'center',
        isActive: true
      },
      {
        field: 'yKienNguoiPheDuyet',
        title: 'Ý kiến người phê duyệt',
        width: '100px',
        align: 'center',
        isActive: true
      },
      {
        field: 'thaoTac',
        title: 'Thao tác',
        width: '100px',
        align: 'center',
        isActive: true
      },
    ];
  }

  ngOnInit(): void {
    this.getList();
  }

  public getList() {
    this.api.get('/api/kpimuctieu-nam-bophan-detail/list-muc-tieu-bo-phan', { KPIMucTieuNamBoPhanId: this.id }).subscribe(res => {
      if (res) {
        this.dataTable.items = res?.items?.length ? res?.items : [{ kpiMucTieuNamBoPhanId: 0, ghiChu: '', mucTieu: '' }];
      }
    }, err => {
      this.api.loadingCustomOff();
    })
  }

  public onSubmitAccept(e) {
    const params = {
      kpiNhomTieuChiId: e?.meta?.kpiNhomTieuChiId,
      noiDung: e?.content
    }
    this.api.post('/api/kpimuctieu-nam-bophan-create/ra-soat-muc-tieu-bo-phan-phe-duyet', params).subscribe(res => {
      if (res?.isSuccess) {
        // Message ok
        swal({
          icon: 'success',
          title: 'Duyệt thành công!',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.confirmAccept.isVisible = false;
          this.getList();
        });
      } else {
        this.api.errorMessage('Duyệt không thành công!');
      }
    }, err => this.api.errorMessage(err));
  }

  public onSubmitReject(e) {
    const params = {
      kpiNhomTieuChiId: e?.meta?.kpiNhomTieuChiId,
      noiDung: e?.content
    }
    this.api.post('/api/kpimuctieu-nam-bophan-create/ra-soat-muc-tieu-bo-phan-tu-choi', params).subscribe(res => {
      if (res?.isSuccess) {
        // Message ok
        swal({
          icon: 'success',
          title: 'Báo cáo lại Mục tiêu - KHCV - KPI thành công!',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.confirmReject.isVisible = false;
          this.getList();
        });
      } else {
        this.api.errorMessage('Báo cáo lại Mục tiêu - KHCV - KPI không thành công!');
      }
    }, err => this.api.errorMessage(err));
  }

  public onAdd(idx): void {
    this.dataTable.items.splice(idx + 1, 0, {
      kpiMucTieuNamBoPhanId: 0,
      mucTieu: '',
      ghiChu: '',
    });
  }

  public onSave(item): void {
    if (item?.mucTieu !== '') {
      let url, params, msgOK, msgErr;
      if (item?.kpiNhomTieuChiId) {
        // Edit
        params = {
          kpiNhomTieuChiId: item?.kpiNhomTieuChiId,
          mucTieu: item?.mucTieu,
          ghiChu: item?.ghiChu
        };
        url = '/api/kpimuctieu-nam-bophan-update/muc-tieu-bo-phan';
        msgOK = 'Cập nhật mục tiêu thành công!';
        msgErr = 'Cập nhật mục tiêu không thành công!';
      } else {
        // Create
        params = {
          kpiMucTieuNamBoPhanId: this.permission?.kpiMucTieuNamBoPhanId,
          mucTieu: item?.mucTieu,
          ghiChu: item?.ghiChu
        };
        url = '/api/kpimuctieu-nam-bophan-create/muc-tieu-bo-phan';
        msgOK = 'Thêm mục tiêu thành công!';
        msgErr = 'Thêm mục tiêu không thành công!';
      }
      this.api.post(url, params).subscribe(res => {
        if (res?.isSuccess) {
          // Message ok
          swal({
            icon: 'success',
            title: msgOK,
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.getList();
          });
        } else {
          this.api.errorMessage(msgErr);
        }
      }, err => this.api.errorMessage(err));
    } else {
      this.api.errorMessage('Mục tiêu là bắt buộc!');
    }
  }

  public onDelete(idx, item): void {
    if (item?.kpiMucTieuNamBoPhanId == 0) {
      this.dataTable.items = this.dataTable.items.filter((f, i) => i !== idx);
    } else {
      this.api.delete(`/api/kpimuctieu-nam-bophan-delete/muc-tieu-bo-phan?KPINhomTieuChiId=${item?.kpiNhomTieuChiId}`)
        .subscribe((res: any) => {
          if (res?.isSuccess) {
            swal({
              icon: "success",
              title: "Xoá mục tiêu thành công!",
              buttons: {
                ok: this.translate.instant('COMMON.btn.close'),
              },
            } as any).then(() => {
              this.getList();
            });
          } else {
            this.api.errorMessage("Xoá mục tiêu không thành công!");
          }
        }, err => {
          this.api.errorMessage(err);
        });
    }
  }

  /**
   * Lock/Unlock
   * @param item 
   */
  public onLockUnlock(item): void {
    const params = {
      kpiNhomTieuChiId: item?.kpiNhomTieuChiId,
      isLock: !item?.isLock, // false: mở khoá, true: khoá
    };
    this.api.post('/api/kpimuctieu-nam-bophan-update/muc-tieu-bo-phan-lock-unlock', params).subscribe((res: any) => {
      if (res?.isSuccess) {
        swal({
          icon: "success",
          title: item?.isLock ? 'Mở khoá bản ghi thành công!' : 'Khoá bản ghi thành công!',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.getList();
        });
      } else {
        this.api.errorMessage(item?.isLock ? 'Mở khoá bản ghi không thành công!' : 'Khoá bản ghi không thành công!');
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }
}
