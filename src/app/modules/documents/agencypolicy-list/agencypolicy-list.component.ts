import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { DataTable, Columns } from 'src/app/_metronic/shared/shared/models/dataTable';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { ChinhSachDaiLyList } from './models/chinh-sach-dai-ly.model';

@Component({
  selector: 'app-agencypolicy-list',
  templateUrl: './agencypolicy-list.component.html',
  styleUrls: ['./agencypolicy-list.component.scss']
})
export class AgencyPolicyListComponent implements OnInit {
  public isSearchAdvance = false;
  // Paginator
  public paginator = {
    pageSize: 20,
    page: 1,
    totalRecord: 0,
    sortField: 'ChinhSachDaiLyId',
    sortOrder: 'desc',
    // List
    SearchText: '',
    PhongBanKey: '',
    TrangThaiKey: '',
    NgayBanHanhTu: null,
    NgayBanHanhDen: null,
  };
  // Table
  public dataTable: DataTable<ChinhSachDaiLyList> = {
    items: [],
    columns: [] as Columns[],
    selected: [],
  };

  public phongBanOptions: Options[] = [];
  public trangThaiOptions: Options[] = [];

  public search$ = new BehaviorSubject(null);

  constructor(
    private api: ApiService,
    private router: Router,
    private cdf: ChangeDetectorRef,
    private translate: TranslateService,
  ) {

    // Table config title and field
    this.dataTable.columns = [
      {
        field: 'tenChinhSach',
        sortField: 'TenChinhSach',
        title: 'Tiêu đề',
        width: '300px',
      },
      {
        field: 'phongBanDisplay',
        title: 'Bộ phận',
        width: '150px',
      },
      {
        field: 'ngayBanHanh',
        sortField: 'NgayBanHanh',
        title: 'Ngày ban hành',
        width: '150px',
      },
      {
        field: 'trangThaiDisplay',
        sortField: 'TrangThai',
        title: 'Trạng thái',
        width: '150px',
      },
      {
        field: 'thaoTac',
        title: 'Thao tác',
        width: '80px',
        align: 'center'
      }
    ];
  }


  ngOnInit(): void {
    this.getList();
    this.getPhongBanOptions();
    this.getTrangThaiOptions();
    // Listen input search!
    this.search$.pipe(debounceTime(1000)).subscribe((res: string) => {
      if (res || res === '') {
        this.paginator.SearchText = res;
        this.getList();
      }
    });
  }

  public onChangeDate(e) {
    this.paginator.NgayBanHanhTu = ~~(new Date(e?.[0]).getTime()/1000);
    this.paginator.NgayBanHanhDen = ~~(new Date(e?.[1]).getTime()/1000);
    this.getList();
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
    this.dataTable.columns = this.dataTable.columns.map(m => (field == m.field ? { ...m, sortOrder: e } : { ...m, sortOrder: null }))
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

    this.api.get('/api/chinhsach-daily-list', query).subscribe(res => {
      if (res) {
        this.dataTable = { ...this.dataTable, ...res }
        this.paginator = { ...this.paginator, totalRecord: res?.paging?.toTalRecord }
        this.cdf.detectChanges();
      }
      this.api.loadingCustomOff();
    }, () => this.api.loadingCustomOff())
  }

  /**
   * Get danh muc options
   */
  public getPhongBanOptions() {
    this.api.get('/api/chinhsach-daily-dm/phong-ban')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.phongBanKey, label: m.phongBanDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.phongBanOptions = res;
        }
      })
  }

  /**
   * Get danh muc options
   */
  public getTrangThaiOptions() {
    this.api.get('/api/chinhsach-daily-dm/trang-thai')
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
    this.api.delete(`/api/chinhsach-daily-delete?ChinhSachDaiLyId=${id}`)
      .subscribe((res: any) => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: "Xoá chính sách thành công!",
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.getList();
          });
        } else {
          this.api.errorMessage('Xoá chính sách không thành công!');
        }
      }, err => this.api.errorMessage(err));
  }

  /**
   * Download file zip
   * @param id 
   */
  public zipFile(id) {
    const query = { chinhSachDaiLyId: id };
    const header = {
      observe: 'response',
      responseType: 'blob' as 'json',
    };
    this.api.get('/api/chinhsach-daily-misc/download-all', query, header).subscribe(res => {
      /* Get blob */
      const blob = new Blob([res.body], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const fileName = `[Chinhsach]_${new Date().getTime()}.zip`;
      /* Download */
      this.api.downloadURI(url, fileName);
    }, err => this.api.errorMessage(err));
  }

  public showDetail(item) {
    this.router.navigate(['documents', 'agencypolicy-detail', item?.chinhSachDaiLyId]);
  }

}
