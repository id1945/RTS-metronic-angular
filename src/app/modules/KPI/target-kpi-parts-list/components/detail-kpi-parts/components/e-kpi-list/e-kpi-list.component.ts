import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { ConfirmInputBasicComponent } from 'src/app/_metronic/shared/shared/components/confirm-input-basic/confirm-input-basic.component';
import { Columns, DataTable } from 'src/app/_metronic/shared/shared/models/dataTable';
import { Permission } from '../../detail-kpi-parts.component';
import swal from 'sweetalert';
import { EKpiList } from './models/e-kpi.model';
@Component({
  selector: 'app-e-kpi-list',
  templateUrl: './e-kpi-list.component.html',
  styleUrls: ['./e-kpi-list.component.scss'],
  exportAs: 'kpi'
})
export class EKpiListComponent implements OnInit {

  @ViewChild('confirmAccept') confirmAccept: ConfirmInputBasicComponent;
  @ViewChild('confirmReject') confirmReject: ConfirmInputBasicComponent;

  // Paginator
  public paginator = {
    pageSize: 20,
    page: 1,
    totalRecord: 0,
    SortField: 'id',
    SortOrder: 'desc',
    // List
    NamKey: '',
    PhongBanKey: '',
    TrangThaiKey: '',
    HieuLucKey: '',
  };
  // Table
  public dataTable: DataTable<EKpiList> = {
    items: [],
    columns: [] as Columns[],
    columns2: [] as Columns[],
    isActive: true,
    isAllowThemMoi: false
  };

  @Input() id: string;
  @Input() permission: Permission;

  public showHideColumnChiTieuKeHoach = true;

  constructor(
    private api: ApiService,
    private translate: TranslateService
  ) {
    // Table config title and field
    this.dataTable.columns = [
      {
        field: 'stt',
        title: 'STT',
        rowspan: "2",
        colspan: "1",
        isActive: true,
        align: 'center',
        width: '50px',
        stickyL: true,
      },
      {
        field: 'mucTieu',
        title: 'Mục tiêu bộ phận',
        rowspan: "2",
        colspan: "1",
        isActive: true,
        width: '250px',
        stickyL: true,
      },
      {
        field: 'keHoachCongViecs',
        title: 'STT KHCV',
        rowspan: "2",
        colspan: "1",
        isActive: true,
        width: '120px',
      },
      {
        field: 'tenKPI',
        title: 'Tên KPI',
        rowspan: "2",
        colspan: "1",
        isActive: true,
        width: '300px',
      },
      {
        field: 'noiDungCongThuc',
        title: 'Công thức tính KPI',
        rowspan: "2",
        colspan: "1",
        isActive: true,
        width: '220px',
      },
      {
        field: 'donViTinhDisplay',
        title: 'Đơn vị tính',
        rowspan: "2",
        colspan: "1",
        isActive: true,
        align: 'center',
        width: '80px',
      },
      {
        field: 'loaiKPIDisplay',
        title: 'Loại KPI',
        rowspan: "2",
        colspan: "1",
        isActive: true,
        width: '150px',
      },
      {
        field: 'trongSo',
        title: 'Tỷ trọng',
        rowspan: "2",
        colspan: "1",
        isActive: true,
        align: 'center',
        width: '80px',
      },
      {
        field: 'tanSuatTheoDoiDisplay',
        title: 'Tần suất theo dõi',
        rowspan: "2",
        colspan: "1",
        isActive: true,
        align: 'center',
        width: '130px',
      },
      {
        field: 'thanhPhanDisplays',
        title: 'Thành phần',
        rowspan: "2",
        colspan: "1",
        isActive: true,
        width: '250px',
      },
      {
        field: 'chiTieuKeHoach',
        title: 'Chỉ tiêu kế hoạch',
        rowspan: "1",
        colspan: "5",
        isActive: true,
        align: 'center',
        width: '150px',
      },
      {
        field: 'nhanSuChiuTrachNhiemDisplays',
        title: 'Người thực hiện',
        rowspan: "2",
        colspan: "1",
        isActive: true,
        width: '200px',
      },
      {
        field: 'ghiChu',
        title: 'Ghi chú',
        rowspan: "2",
        colspan: "1",
        isActive: true,
        align: 'center',
        width: '50px',
      },
      {
        field: 'raSoat',
        title: 'Rà soát',
        rowspan: "2",
        colspan: "1",
        isActive: true,
        align: 'center',
        width: '80px',
      },
      {
        field: 'yKienNguoiPheDuyet',
        title: 'Ý kiến người phê duyệt',
        rowspan: "2",
        colspan: "1",
        isActive: true,
        width: '200px',
      },
      {
        field: 'thaoTac',
        title: 'Thao tác',
        rowspan: "2",
        colspan: "1",
        isActive: true,
        stickyR: true,
        align: 'center',
        width: '80px',
      },
    ];

    this.dataTable.columns2 = [
      {
        field: 'tienDoCaNam',
        title: 'Cả năm',
        rowspan: "1",
        colspan: "0",
        className: 'bg-note',
        align: 'center',
        isActive: true,
        width: '100px',
      },
      {
        field: 'quy1',
        title: 'Quý I',
        rowspan: "1",
        colspan: "0",
        className: 'bg-note',
        align: 'center',
        isActive: true,
        width: '80px',
      },
      {
        field: 'quy2',
        title: 'Quý II',
        rowspan: "1",
        colspan: "0",
        className: 'bg-note',
        align: 'center',
        isActive: true,
        width: '80px',
      },
      {
        field: 'quy3',
        title: 'Quý III',
        rowspan: "1",
        colspan: "0",
        className: 'bg-note',
        align: 'center',
        isActive: true,
        width: '80px',
      },
      {
        field: 'quy4',
        title: 'Quý IV',
        rowspan: "1",
        colspan: "0",
        className: 'bg-note',
        align: 'center',
        isActive: true,
        width: '80px',
      },
    ];
  }

  ngOnInit(): void {
    this.getList();
    this.onResizeStickyMobile();
  }

  public getList() {
    this.api.get('/api/kpimuctieu-nam-bophan-detail/list-kpi', { KPIMucTieuNamBoPhanId: this.id }).subscribe(res => {
      if (res) {
        this.dataTable.items = res?.items;
        this.dataTable.isAllowThemMoi = res?.isAllowThemMoi;
      }
    }, err => {
      this.api.loadingCustomOff();
    })
  }

  public onSubmitAccept(e) {
    const params = {
      kpiMucTieuId: e?.meta?.kpiMucTieuId,
      noiDung: e?.content
    }
    this.api.post('/api/kpimuctieu-nam-bophan-create/ra-soat-kpi-phe-duyet', params).subscribe(res => {
      if (res?.isSuccess) {
        // Message ok
        swal({
          icon: 'success',
          title: 'Duyệt KPI bộ phận thành công!',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.confirmAccept.isVisible = false;
          this.getList();
        });
      } else {
        this.api.errorMessage('Duyệt KPI bộ phận không thành công!');
      }
    }, err => this.api.errorMessage(err));
  }

  public onSubmitReject(e) {
    const params = {
      kpiMucTieuId: e?.meta?.kpiMucTieuId,
      noiDung: e?.content
    }
    this.api.post('/api/kpimuctieu-nam-bophan-create/ra-soat-kpi-tu-choi', params).subscribe(res => {
      if (res?.isSuccess) {
        // Message ok
        swal({
          icon: 'success',
          title: 'Báo cáo lại KPI bộ phận thành công!',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.confirmReject.isVisible = false;
          this.getList();
        });
      } else {
        this.api.errorMessage('Báo cáo lại KPI bộ phận không thành công!');
      }
    }, err => this.api.errorMessage(err));
  }

  public onDelete(kpiMucTieuId): void {
    kpiMucTieuId && this.api.delete(`/api/kpimuctieu-nam-bophan-delete/kpi?KPIMucTieuId=${kpiMucTieuId}`)
      .subscribe((res: any) => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: "Xoá KPI bộ phận thành công!",
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.getList();
          });
        } else {
          this.api.errorMessage("Xoá KPI bộ phận không thành công!");
        }
      }, err => {
        this.api.errorMessage(err);
      });
  }

  public onAddLibrary(kpiMucTieuId): void {
    kpiMucTieuId && this.api.post(`/api/kpimuctieu-nam-bophan-create/them-vao-thu-vien-kpi`, { kpiMucTieuId: kpiMucTieuId }).subscribe((res: any) => {
      if (res?.isSuccess) {
        swal({
          icon: "success",
          title: "Thêm bản ghi vào thư viện KPI thành công!",
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        });
      } else {
        this.api.errorMessage("Thêm bản ghi vào thư viện KPI không thành công!");
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }

  public onChangeShowHideColumn(item: Columns) {
    // Xoá cột chiTieuKeHoach && tất cả các cột nhỏ
    if (item.field === 'chiTieuKeHoach') {
      this.showHideColumnChiTieuKeHoach = item.isActive;
    }
  }

  /**
   * active/inactive
   * Sticky table column
   */
  public onResizeStickyMobile() {
    const offsetWidth = document.getElementById("kt_header")?.offsetWidth;
    this.dataTable.columns = this.dataTable.columns.map(m => {
      // sticky left
      if (m?.stickyL === true || m?.stickyL === false) {
        return { ...m, stickyL: offsetWidth > 1200 };
      }
      // sticky right
      if (m?.stickyR === true || m?.stickyR === false) {
        return { ...m, stickyR: offsetWidth > 1000 };
      }
      return m;
    });
  }

  /**
   * Lock/Unlock
   * @param item 
   */
  public onLockUnlock(item): void {
    const params = {
      kpiMucTieuId: item?.kpiMucTieuId,
      isLock: !item?.isLock, // false: mở khoá, true: khoá
    };
    this.api.post('/api/kpimuctieu-nam-bophan-update/kpi-lock-unlock', params).subscribe((res: any) => {
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
