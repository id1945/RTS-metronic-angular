import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { Columns, DataTable } from 'src/app/_metronic/shared/shared/models/dataTable';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import swal from 'sweetalert';

@Component({
  selector: 'app-library-kpi-list',
  templateUrl: './library-kpi-list.component.html',
  styleUrls: ['./library-kpi-list.component.scss']
})
export class LibraryKpiListComponent implements OnInit {

  public boPhanOptions: Options[] = [];
  // Paginator
  public paginator = {
    pageSize: 20,
    page: 1,
    totalRecord: 0,
    SortField: 'kpiMucTieuId',
    SortOrder: 'desc',
    // List
    SearchText: '',
    PhongBanKey: ''
  };
  // Table
  public dataTable: DataTable<any> = {
    items: [],
    columns: [] as Columns[],
  };

  public search$ = new BehaviorSubject(null);

  constructor(
    private api: ApiService,
    private translate: TranslateService,
  ) {
    // Table config title and field
    this.dataTable.columns = [
      {
        field: 'phongBanDisplay',
        title: 'Bộ phận',
        width: '150px',
      },
      {
        field: 'keHoachCongViec',
        title: 'Mã mục tiêu',
        width: '100px',
      },
      {
        field: 'mucTieu',
        title: 'Mục tiêu đo lường',
        width: '300px',
      },
      {
        field: 'maKPI',
        title: 'Mã KPI',
        width: '150px',
      },
      {
        field: 'tenKPI',
        title: 'Tên KPI',
        width: '300px',
      },
      {
        field: 'congThucTinhToan',
        title: 'Công thức tính toán',
        width: '200px',
      },
      {
        field: 'donViTinhDisplay',
        title: 'Đơn vị đo lường',
        width: '100px',
        align: 'center'
      },
      {
        field: 'tanSuatTheoDoiDisplay',
        title: 'Tần suất đo lường',
        width: '150px',
      },
      {
        field: 'loaiKPIDisplay',
        title: 'Loại KPI',
        width: '150px',
      },
      {
        field: 'nguoiDeXuatDisplays',
        title: 'Đề xuất bởi',
        width: '200px',
      },
      {
        field: 'ngayTao',
        title: 'Ngày tạo',
        width: '150px',
      },
      {
        field: 'ghiChu',
        title: 'Ghi chú',
        width: '150px',
      },
      {
        field: 'thaoTac',
        title: 'Thao tác',
        width: '100px',
        align: 'center'
      },
    ];
    // Listen input search!
    this.search$.pipe(debounceTime(1000)).subscribe((res: string) => {
      if (res || res === '') {
        this.paginator.SearchText = res;
        this.getList();
      }
    });
  }

  ngOnInit(): void {
    // Load datatable
    this.getList();
    this.getBoPhanOptions();
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

    this.api.get('/api/danhsachthuvienkpibophan-list', query).subscribe(res => {
      if (res) {
        this.dataTable = { ...this.dataTable, ...res }
        this.paginator = { ...this.paginator, totalRecord: res?.paging?.toTalRecord }
      }
      this.api.loadingCustomOff();
    }, err => {
      this.api.loadingCustomOff();
    })
  }

  public getBoPhanOptions() {
    this.api.get('/api/danhsachthuvienkpibophan-dm/phong-ban')
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
    this.api.delete(`/api/danhsachthuvienkpibophan-delete?KPIMucTieuId=${id}`)
      .subscribe((res: any) => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: "Xoá thư viện KPI thành công!",
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.getList();
          });
        } else {
          this.api.errorMessage("Xoá thư viện KPI không thành công!");
        }
      }, err => {
        this.api.errorMessage(err);
      });
  }
}
