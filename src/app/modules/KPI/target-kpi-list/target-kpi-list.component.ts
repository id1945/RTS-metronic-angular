import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { TranslateService } from '@ngx-translate/core';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { of, BehaviorSubject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import swal from 'sweetalert';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { DataTable, Columns } from 'src/app/_metronic/shared/shared/models/dataTable';

@Component({
  selector: 'app-target-kpi-list',
  templateUrl: './target-kpi-list.component.html',
  styleUrls: ['./target-kpi-list.component.scss']
})
export class TargetKPIListComponent implements OnInit {
  // Paginator
  public paginator = {
    pageSize: 20,
    page: 1,
    totalRecord: 0,
    sortField: 'KPIMucTieuId',
    sortOrder: 'desc',
    // List
    SearchText: '',
    PhongBanKey: '',
  };
  // Table
  public dataTable: DataTable<any> = {
    items: [],
    columns: [] as Columns[],
  };

  public search$ = new BehaviorSubject(null);
  public boPhanOptions: Options[] = [];

  constructor(
    private api: ApiService,
    private cdf: ChangeDetectorRef,
    private translate: TranslateService,
  ) {
    // Table config title and field
    this.dataTable.columns = [
      {
        field: 'mucTieuDisplay',
        sortField: 'MucTieu',
        title: 'Mục tiêu',
        width: '200px',
      },
      {
        field: 'tenKPI',
        sortField: 'TenKPI',
        title: 'Tên KPI',
        width: '200px',
      },
      {
        field: 'noiDungCongThuc',
        sortField: 'NoiDungCongThuc',
        title: 'Công thức tính toán',
        width: '200px',
      },
      {
        field: 'nhanSuChiuTrachNhiemDisplay',
        sortField: 'NhanSuChiuTrachNhiem',
        title: 'Nhân sự CTN',
        width: '150px',
      },
      {
        field: 'donViTinhDisplay',
        sortField: 'DonViTinh',
        title: 'Đ.V tính',
        width: '80px',
        align: 'center'
      },
      {
        field: 'loaiKPIDisplay',
        sortField: 'LoaiKPI',
        title: 'Loại KPI',
        width: '130px',
      },
      {
        field: 'tanSuatTheoDoiDisplay',
        sortField: 'TanSuatTheoDoi',
        title: 'Tần suất theo dõi',
        width: '150px',
        align: 'center'
      },
      {
        field: 'phongBanDisplay',
        sortField: 'PhongBan',
        title: 'Phòng ban',
        width: '200px',
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
    this.getList();
    this.getBoPhanOptions();
    // Listen input search!
    this.search$.pipe(debounceTime(1000)).subscribe((res: string) => {
      if (res || res === '') {
        this.paginator.SearchText = res;
        this.getList();
      }
    });
  }

  /**
   * Sort
   * @param e 
   * @param field 
   */
  public sortOrderChange(e, field: string) {
    if (e != null) {
      this.paginator.sortField = field;
      this.paginator.sortOrder = e;
    } else {
      delete this.paginator.sortField;
      delete this.paginator.sortOrder;
    }
    this.dataTable.columns = this.dataTable.columns.map(m => (field == m.sortField ? { ...m, sortOrder: e } : { ...m, sortOrder: null }))
    this.getList();
  }

  /**
   * Get dataTable
   */
  public getList() {
    this.api.loadingCustomOn();

    const query = {
      ...this.paginator,
      page: this.paginator.page,
      ItemsPerPage: this.paginator?.pageSize,
      sortOrder: this.paginator?.sortOrder?.replace('end', '')
    };

    delete query.pageSize;
    delete query.totalRecord;

    this.api.get('/api/danhsachkpi-list', query).subscribe(res => {
      if (res) {
        this.dataTable = { ...this.dataTable, ...res }
        this.paginator = { ...this.paginator, totalRecord: res?.paging?.toTalRecord }
        this.cdf.detectChanges();
      }
      this.api.loadingCustomOff();
    }, err => this.api.loadingCustomOff())
  }

  /**
   * Get options
   */
  public getBoPhanOptions() {
    this.api.get('/api/danhsachkpi-dm/phong-ban')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.phongBanKey, label: m.phongBanDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.boPhanOptions = res;
        }
      })
  }

  /**
   * Delete
   * @param id 
   */
  public onDelete(id) {
    this.api.delete(`/api/danhsachkpi-delete?=KPIMucTieuId${id}`)
      .subscribe((res: any) => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: "Xoá KPI mục tiêu thành công!",
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.getList();
          });
        } else {
          this.api.errorMessage("Xoá KPI mục tiêu không thành công!");
        }
      }, err => {
        this.api.errorMessage(err);
      });
  }
}