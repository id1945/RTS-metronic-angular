import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { Columns, DataTable } from 'src/app/_metronic/shared/shared/models/dataTable';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import swal from 'sweetalert';

@Component({
  selector: 'app-target-kpi-parts-list',
  templateUrl: './target-kpi-parts-list.component.html',
  styleUrls: ['./target-kpi-parts-list.component.scss']
})
export class TargetKpiPartsListComponent implements OnInit {

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
    HieuLucKey: true,
  };
  // Table
  public dataTable: DataTable<any> = {
    items: [],
    columns: [] as Columns[],
  };

  public namOptions: Options[] = [];
  public boPhanOptions: Options[] = [];
  public trangThaiOptions: Options[] = [];
  public hieuLucOptions: Options[] = [];

  constructor(
    private api: ApiService,
    private translate: TranslateService,
  ) {
    // Table config title and field
    this.dataTable.columns = [
      {
        field: 'tenMucTieu',
        sortField: 'TenMucTieu',
        title: 'Tên mục tiêu - KHCV - KPI năm',
        width: '250px',
      },
      {
        field: 'phongBanDisplay',
        sortField: 'PhongBan',
        title: 'Bộ phận',
        width: '150px',
      },
      {
        field: 'nguoiPhuTrachs',
        title: 'Người phụ trách',
        width: '150px',
      },
      {
        field: 'trangThaiDisplay',
        sortField: 'TrangThai',
        title: 'Trạng thái',
        width: '100px'
      },
      {
        field: 'ngayHieuLuc',
        sortField: 'NgayHieuLuc',
        title: 'Ngày hiêu lực',
        width: '100px',
        pipe: 'dd/MM/yyyy',
        align: 'center'
      },
      {
        field: 'loaiDangKyDisplay',
        sortField: 'LoaiDangKy',
        title: 'Loại KPI',
        width: '100px',
        align: 'center'
      },
      {
        field: 'thaoTac',
        title: 'Thao tác',
        width: '100px',
        align: 'center'
      },
    ];
  }

  ngOnInit(): void {
    this.getList();
    this.getNamOptions();
    this.getBoPhanOptions();
    this.getTrangThaiOptions();
    this.getHieuLucOptions();
  }

  public getList() {
    this.api.loadingCustomOn();

    const query = {
      ...this.paginator,
      Page: this.paginator.page,
      ItemsPerPage: this.paginator?.pageSize,
      SortOrder: this.paginator?.SortOrder?.replace('end', ''),
    };

    delete query.page;
    delete query.pageSize;
    delete query.totalRecord;

    this.api.get('/api/kpimuctieu-nam-bophan-list', query).subscribe(res => {
      if (res) {
        this.dataTable = { ...this.dataTable, ...res }
        this.paginator = { ...this.paginator, totalRecord: res?.paging?.toTalRecord }
      }
      this.api.loadingCustomOff();
    }, err => {
      this.api.loadingCustomOff();
    })
  }

  public sortOrderChange(e, field: string) {
    if (e != null) {
      this.paginator.SortField = field;
      this.paginator.SortOrder = e;
    } else {
      delete this.paginator.SortField;
      delete this.paginator.SortOrder;
    }
    this.dataTable.columns = this.dataTable.columns.map(m => (field == m.sortField ? { ...m, sortOrder: e } : { ...m, sortOrder: null }))
    this.getList();
  }

  public getNamOptions() {
    this.api.get('/api/kpimuctieu-nam-bophan-dm/nam')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.namKey, label: m.namDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.namOptions = res;
        }
      })
  }

  public getBoPhanOptions() {
    this.api.get('/api/kpimuctieu-nam-bophan-dm/phong-ban')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.phongBanKey, label: m.phongBanDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.boPhanOptions = res;
        }
      })
  }

  public getTrangThaiOptions() {
    this.api.get('/api/kpimuctieu-nam-bophan-dm/trang-thai')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.trangThaiKey, label: m.trangThaiDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.trangThaiOptions = res;
        }
      })
  }

  public getHieuLucOptions() {
    this.api.get('/api/kpimuctieu-nam-bophan-dm/hieu-luc')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.hieuLucKey, label: m.hieuLucDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.hieuLucOptions = res;
        }
      })
  }

  public onTaiDangKy(id) {
    this.api.post('/api/kpimuctieu-nam-bophan-create/tai-dang-ky', { kpiMucTieuNamBoPhanId: id }).subscribe((res: any) => {
      if (res?.isSuccess) {
        swal({
          icon: "success",
          title: "Tái đăng ký thành công!",
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.getList();
        });
      } else {
        this.api.errorMessage("Tái đăng ký không thành công!");
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }

  /**
   * Delete
   * @param id 
   */
  public onDelete(id) {
    this.api.delete(`/api/kpimuctieu-nam-bophan-delete?KPIMucTieuNamBoPhanId=${id}`)
      .subscribe((res: any) => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: "Xoá KPI mục tiêu năm thành công!",
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.getList();
          });
        } else {
          this.api.errorMessage("Xoá KPI mục tiêu năm không thành công!");
        }
      }, err => {
        this.api.errorMessage(err);
      });
  }
}
