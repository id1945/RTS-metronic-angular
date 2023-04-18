import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core'
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import swal from 'sweetalert';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { DataTable, Columns } from 'src/app/_metronic/shared/shared/models/dataTable';

@Component({
  selector: 'app-kpi-list',
  templateUrl: './kpi-list.component.html',
  styleUrls: ['./kpi-list.component.scss']
})
export class KpiListComponent implements OnInit {
  // Paginator
  public paginator = {
    pageSize: 20,
    page: 1,
    totalRecord: 0,
    SortField: 'id',
    SortOrder: 'desc',
    // List
    NamKey: '',
    QuyKey: '',
    PhongBanKey: '',
    TrangThaiKey: ''
  };
  // Table
  public dataTable: DataTable<any> = {
    items: [],
    columns: [] as Columns[],
  };

  public namOptions: Options[] = [];
  public quyOptions: Options[] = [];
  public phongBanOptions: Options[] = [];
  public trangThaiOptions: Options[] = [];

  constructor(
    private api: ApiService,
    private translate: TranslateService,
  ) {
    // Table config title and field
    this.dataTable.columns = [
      {
        field: 'namDisplay',
        sortField: 'Nam',
        title: 'Năm',
        width: '50px',
      },
      {
        field: 'phongBanDisplay',
        sortField: 'PhongBan',
        title: 'Bộ phận',
        width: '120px',
      },
      {
        field: 'quyDisplay',
        sortField: 'Quy',
        title: 'Quý',
        width: '50px',
      },
      {
        field: 'nguoiPhuTrachDisplay',
        sortField: 'NguoiPhuTrach',
        title: 'Người phụ trách',
        width: '120px',
      },
      {
        field: 'trangThaiDisplay',
        sortField: 'TrangThai',
        title: 'Trạng thái',
        width: '80px',
        align: 'center'
      },
      {
        field: 'quyTrinhDuyetDisplay',
        sortField: 'LoaiTrinhDuyet',
        title: 'Loại quy trình duyệt',
        width: '120px',
      },
      {
        field: 'thaoTac',
        title: 'Thao tác',
        width: '50px',
        align: 'center'
      },
    ];
  }

  ngOnInit(): void {
    // Load datatable
    this.getList();
    this.getNamOptions();
    this.getQuyOptions();
    this.getPhongBanOptions();
    this.getTrangThaiOptions();
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

    this.api.get('/api/kpiquy-list', query).subscribe(res => {
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
    this.api.get('/api/kpiquy-dm/nam')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.namKey, label: m.namDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.namOptions = res;
        }
      })
  }

  public getQuyOptions() {
    this.api.get('/api/kpiquy-dm/quy')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.quyKey, label: m.quyDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.quyOptions = res;
        }
      })
  }

  public getPhongBanOptions() {
    this.api.get('/api/kpiquy-dm/phong-ban')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.phongBanKey, label: m.phongBanDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.phongBanOptions = res;
        }
      })
  }

  public getTrangThaiOptions() {
    this.api.get('/api/kpiquy-dm/trang-thai')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.trangThaiKey, label: m.trangThaiDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.trangThaiOptions = res;
        }
      })
  }

  /**
   * Delete
   * @param id 
   */
  public onDelete(id) {
    this.api.delete(`/api/kpiquy-delete?KpiquyId=${id}`)
      .subscribe((res: any) => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: "Xoá KPI quý thành công!",
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.getList();
          });
        } else {
          this.api.errorMessage("Xoá KPI quý không thành công!");
        }
      }, err => {
        this.api.errorMessage(err);
      });
  }
}
