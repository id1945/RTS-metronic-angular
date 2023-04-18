import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { DataTable, Columns } from 'src/app/_metronic/shared/shared/models/dataTable';

@Component({
  selector: 'app-submissions-list',
  templateUrl: './submissions-list.component.html',
  styleUrls: ['./submissions-list.component.scss']
})
export class SubmissionsListComponent implements OnInit {
  public isSearchAdvance = false;
  // Paginator
  public paginator = {
    pageSize: 20,
    page: 1,
    totalRecord: 0,
    SortField: 'NgayTao',
    SortOrder: 'desc',
    // List
    SearchText: '',
    TrangThaiKey: '',
    TinhTrangKey: ''
  };
  // Table
  public dataTable: DataTable<any> = {
    items: [],
    columns: [] as Columns[],
    selected: [],
  };
  public SearchText$ = new BehaviorSubject(null);

  public statusOptions: any[] = [];
  public tinhTrangOptions: any[] = [];

  constructor(
    private router: Router,
    private api: ApiService,
    private cdf: ChangeDetectorRef,
  ) {
    // Table config title and field
    this.dataTable.columns = [
      {
        field: 'tenToTrinh',
        sortField: 'TenToTrinh',
        title: 'Tên tờ trình',
        width: '250px',
      },
      {
        field: 'maToTrinh',
        sortField: 'MaToTrinh',
        title: 'Mã tờ trình',
        width: '120px',
      },
      {
        field: 'tenNguoiTao',
        sortField: 'NguoiTao',
        title: 'Người tạo',
        width: '120px',
      },
      {
        field: 'attachment',
        title: 'File đính kèm',
        width: '100px',
        align: 'left'
      },
      {
        field: 'ngayTao',
        sortField: 'ngayTao',
        title: 'Ngày tạo',
        width: '100px',
      },
      {
        field: 'tenTrangThai',
        // sortField: 'tenTrangThai',
        title: 'Trạng thái',
        width: '130px',
      },
      {
        field: 'isAllowBanHanh',
        title: 'Ban hành',
        width: '50px',
      }
    ];
  }


  ngOnInit(): void {
    this.getList();
    this.getStatusOptions();
    this.getTinhTrangOptions();
    // Listen input search!
    this.SearchText$.pipe(debounceTime(1000)).subscribe((res: string) => {
      if (res || res === '') {
        this.paginator.SearchText = res;
        this.getList();
      }
    });
  }

  getList() {
    this.api.loadingCustomOn();

    const query = {
      ...this.paginator,
      Page: this.paginator.page,
      ItemsPerPage: this.paginator?.pageSize,
      SortOrder: this.paginator?.SortOrder?.replace('end', '')
    };

    delete query.page;
    delete query.pageSize;
    delete query.totalRecord;

    this.api.get('/api/totrinh-duyetchi-list', query).subscribe(res => {
      if (res) {
        this.dataTable = { ...this.dataTable, ...res };
        this.paginator = { ...this.paginator, totalRecord: res?.paging?.toTalRecord };
        this.dataTable.items = this.dataTable?.items?.map(m => ({ ...m, expand: false }));
        this.cdf.detectChanges();
      }
      this.api.loadingCustomOff();
    }, err => {
      this.api.loadingCustomOff();
    })
  }

  sortOrderChange(e, field: string) {
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

  public getStatusOptions() {
    this.api.get('/api/totrinh-duyetchi-danhmuc/trang-thai')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.trangThaiKey, label: m.trangThaiDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.statusOptions = res;
        }
      })
  }

  public getTinhTrangOptions() {
    this.api.get('/api/totrinh-duyetchi-danhmuc/tinh-trang')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.tinhTrangKey, label: m.tinhTrangDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.tinhTrangOptions = res;
        }
      })
  }

  public showDetail(item) {
    this.router.navigate(['submissions', 'detail', item?.hoSoId]);
  }

  /**
   * DOWNLOAD
   * @param itemParent
   * @param itemChild
   */
  public donwloadById(itemParent: any, itemChild: any) {
    const header = {
      observe: 'response',
      responseType: 'blob' as 'json',
    };
    this.api.get('/api/totrinh-duyetchi-misc/tai-lieu-goc', { hoSoGiayToId: itemChild?.hoSoGiayToId }, header).subscribe(res => {
      if (res) {
        this.api.downloadFileFromBlob(res);
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }

  public donwloadAllById(item: any) {
    const header = {
      observe: 'response',
      responseType: 'blob' as 'json',
    };
    this.api.get('/api/totrinh-duyetchi-misc/download-all', { hoSoId: item?.hoSoId }, header).subscribe(res => {
      if (res) {
        this.api.downloadFileFromBlob(res);
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }
}
