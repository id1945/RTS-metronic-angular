import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import serialize from '@octetstream/object-to-form-data';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { Columns, DataTable } from 'src/app/_metronic/shared/shared/models/dataTable';
import { SelectedFiles } from 'src/app/_metronic/shared/shared/services/files.service';
import swal from 'sweetalert';

enum screen {
  eTarget,
  ePlan,
  eKpi
}

declare type screenType = screen.eTarget | screen.ePlan | screen.eKpi;

@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.scss'],
  exportAs: 'comment'

})
export class CommentModalComponent implements OnInit {

  public isVisible: boolean;
  public rowData: any;
  public dinhKems: SelectedFiles[] = [];
  public noiDung: string;

  @Input() KPIMucTieuId: string;
  @Input() screenKey: screenType;

  // Table
  public dataTable: DataTable<any> = {
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
        width: '50px',
      },
      {
        field: 'hoTenNguoiTao',
        title: 'Người tạo',
        width: '150px',
      },
      {
        field: 'phongBanNguoiTao',
        title: 'Phòng ban',
        width: '150px',
      },
      {
        field: 'noiDung',
        title: 'Nội dung',
        width: '100px'
      },
      {
        field: 'ngayTao',
        title: 'Ngày tạo',
        width: '100px',
        pipe: 'dd/MM/yyyy',
        align: 'center'
      },
      {
        field: 'dinhKems',
        title: 'File đính kèm',
        width: '100px',
        align: 'center'
      },
      {
        field: 'thaoTac',
        title: 'Thao tác',
        width: '100px',
        align: 'center'
      }
    ];
  }

  ngOnInit(): void {
  }

  public showModal(rowData: any) {
    this.isVisible = true;
    this.rowData = rowData;
    this.getList();
  }

  public getList() {
    let url;
    switch (this.screenKey) {
      case screen.eTarget:
        url = '/api/kpimuctieu-nam-bophan-detail/list-binh-luan-muc-tieu-bo-phan';
        break;
      case screen.ePlan:
        url = '/api/kpimuctieu-nam-bophan-detail/list-binh-luan-ke-hoach-cong-viec-chi-tiet';
        break;
      case screen.eKpi:
        url = '/api/kpimuctieu-nam-bophan-detail​/list-binh-luan-kpi';
        break;
      default:
        break;
    }
    this.api.get(url, { KPINhomTieuChiId: this.rowData?.kpiNhomTieuChiId }).subscribe(res => {
      if (res) {
        this.dataTable.items = res?.items;
      }
    }, err => {
      this.api.loadingCustomOff();
    })
  }

  public onSubmit() {
    let url;
    switch (this.screenKey) {
      case screen.eTarget:
        url = '/api/kpimuctieu-nam-bophan-create/muc-tieu-bo-phan-binh-luan';
        break;
      case screen.ePlan:
        url = '/api/kpimuctieu-nam-bophan-create/ke-hoach-cong-viec-chi-tiet-binh-luan';
        break;
      case screen.eKpi:
        url = '/api/kpimuctieu-nam-bophan-create/kpi-binh-luan';
        break;
      default:
        break;
    }

    const params = serialize({
      KPIMucTieuId: this.KPIMucTieuId,
      NoiDung: this.noiDung ?? '',
      DinhKems: this.dinhKems?.map(m => (m?.file))
    });

    this.api.post(url, params).subscribe(res => {
      if (res?.isSuccess) {
        swal({
          icon: "success",
          title: "Tạo mới bình luận thành công!",
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.isVisible = false;
          this.getList();
        });
      } else {
        this.api.errorMessage("Tạo mới bình luận không thành công!");
      }
    }, err => {
      this.api.errorMessage(err);
    })
  }

  public onDelete(id) {
    this.api.delete(`/api/kpimuctieu-nam-bophan-delete/kpi-binh-luan?KPIBinhLuanId=${id}`)
      .subscribe((res: any) => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: "Xoá bình luận thành công!",
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.getList();
          });
        } else {
          this.api.errorMessage("Xoá bình luận không thành công!");
        }
      }, err => {
        this.api.errorMessage(err);
      });
  }

  public onDownloadFile(id, fileName) {
    const header = {
      observe: 'response',
      responseType: 'blob' as 'json',
    };
    this.api.get(`/api/kpimuctieu-nam-bophan-misc/tai-lieu-goc-binh-luan`, { KPIBinhLuanId: id, TenFile: fileName }, header).subscribe((res: any) => {
      if (res) {
        this.api.downloadFileFromBlob(res);
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }
}
