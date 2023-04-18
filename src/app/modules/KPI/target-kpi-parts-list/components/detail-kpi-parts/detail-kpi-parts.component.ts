import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { Columns, DataTable } from 'src/app/_metronic/shared/shared/models/dataTable';
import swal from 'sweetalert';

export interface Permission {
  kpiMucTieuNamBoPhanId?: number,
  mucTieuDoiChieu?: {
    kpiMucTieuNamBoPhanId?: number;
  },
  isAllowEdit?: boolean;
  isAllowRaSoat?: boolean;
  isAllowBinhLuan?: boolean;
  isAllowTacVuLock?: boolean;
  isAllowApCongThuc?: boolean;
  isAllowThemVaoThuVien?: boolean;
  isAllowDeXuat?: boolean;
  isAllowPheDuyet?: boolean;
  isAllowViewKHCV?: boolean;
  lichSuPheDuyet?: {
    items?: {
      nguoiDuyet?: string;
      hoTenNguoiDuyet?: string;
      userNameNguoiDuyet?: string;
      tenBuocThucHien?: string;
      tenTrangThai?: string;
      tinhTrangKey?: string;
      tinhTrang?: string;
      ngayDuyet?: string;
      noiDung?: string;
    }[]
  }
}

@Component({
  selector: 'app-detail-kpi-parts',
  templateUrl: './detail-kpi-parts.component.html',
  styleUrls: ['./detail-kpi-parts.component.scss']
})
export class DetailKpiPartsComponent implements OnInit {

  public tabIdx = 0;

  // Table
  public dataTable: DataTable<any> = {
    items: [],
    columns: [] as Columns[],
  };

  public permission: Permission;

  public params: Params;
  public statusFinal: any;

  constructor(
    private router: Router,
    private api: ApiService,
    private aRoute: ActivatedRoute,
    private translate: TranslateService,
  ) {
    // Table config title and field
    this.dataTable.columns = [
      {
        field: 'stt',
        title: 'STT',
        width: '50px',
      },
      {
        field: 'nguoiDuyet',
        title: 'Người duyệt',
        width: '150px',
      },
      {
        field: 'tenTrangThai',
        title: 'Tên trạng thái',
        width: '150px',
      },
      {
        field: 'tinhTrang',
        title: 'Tình trạng',
        width: '100px'
      },
      {
        field: 'ngayDuyet',
        title: 'Ngày duyệt',
        width: '100px',
        pipe: 'dd/MM/yyyy HH:ss',
        align: 'center'
      },
      {
        field: 'file',
        title: 'File đính kèm',
        width: '100px',
        align: 'center'
      }
    ];

    this.aRoute.params.subscribe(res => {
      if (res) {
        this.params = res;
        this.getPermission();
      }
    });
  }

  ngOnInit(): void {
  }

  public getPermission() {
    this.api.loadingCustomOn();
    this.api.get('/api/kpimuctieu-nam-bophan-detail', { KPIMucTieuNamBoPhanId: this.params?.kpiMucTieuNamBoPhanId }).subscribe(res => {
      if (res) {
        this.permission = res;
        this.dataTable.items = res?.lichSuPheDuyet?.items;
        this.statusFinal = res?.lichSuPheDuyet?.items?.slice(-1)?.[0];
      }
      this.api.loadingCustomOff();
    }, err => {
      this.api.loadingCustomOff();
    })
  }

  public openTargetNewWindows() {
    window.open(`/KPI/target-kpi-parts/detail/${this.permission?.mucTieuDoiChieu?.kpiMucTieuNamBoPhanId}`, 'E_Danh sách mục tiêu bộ phận - KHCV - KPI', 'modal=yes');
  }

  public onDeXuat() {
    const params = { kpiMucTieuNamBoPhanId: this.params?.kpiMucTieuNamBoPhanId };
    params?.kpiMucTieuNamBoPhanId && this.api.post('/api/kpimuctieu-nam-bophan-create/de-xuat', params).subscribe(res => {
      if (res?.isSuccess) {
        swal({
          icon: "success",
          title: "Đề xuất mục tiêu năm bộ phận thành công!",
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        }).then(() => {
          this.router.navigate(['/', 'KPI', 'target-kpi-parts']);
        });
      } else {
        this.api.errorMessage("Đề xuất mục tiêu năm bộ phận không thành công!");
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }
}
