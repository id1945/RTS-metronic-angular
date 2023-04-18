import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { of, BehaviorSubject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { DataTable, Columns } from 'src/app/_metronic/shared/shared/models/dataTable';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { VienPhapLuatList } from './models/vien-phap-luat.model';

@Component({
  selector: 'app-librarylaw-list',
  templateUrl: './librarylaw-list.component.html',
  styleUrls: ['./librarylaw-list.component.scss']
})
export class LibraryLawListComponent implements OnInit {
  public isSearchAdvance = false;
  // Paginator
  public paginator = {
    pageSize: 20,
    page: 1,
    totalRecord: 0,
    sortField: 'ThuVienPhapLuatId',
    sortOrder: 'desc',
    // List
    SearchText: '',
    TenVanBan: '',
    MaVanBan: '',
    ChuTheBanHanh: '',
    NhomPhapLuatKey: '',
  };
  // Table
  public dataTable: DataTable<VienPhapLuatList> = {
    items: [],
    columns: [] as Columns[],
    selected: [],
  };
  
  public nhomPhapLuatOptions: Options[] = [];

  public search$ = new BehaviorSubject(null);
  public searchTenVanBan$ = new BehaviorSubject(null);
  public searchMaVanBan$ = new BehaviorSubject(null);
  public searchChuTheBanHanh$ = new BehaviorSubject(null);

  constructor(
    private api: ApiService,
    private router: Router,
    private cdf: ChangeDetectorRef,
    private translate: TranslateService,
  ) {

    // Table config title and field
    this.dataTable.columns = [
      {
        field: 'nhomPhapLuatDisplay',
        sortField: 'NhomPhapLuat',
        title: 'Nhóm pháp luật',
        width: '150px',
      },
      {
        field: 'tenVanBan',
        sortField: 'TenVanBan',
        title: 'Tên văn bản',
        width: '300px',
      },
      {
        field: 'maVanBan',
        sortField: 'MaVanBan',
        title: 'Mã văn bản',
        width: '140px',
      },
      {
        field: 'phamViApDungDisplays',
        title: 'Phạm vi áp dụng',
        width: '140px',
      },
      {
        field: 'chuTheBanHanh',
        sortField: 'ChuTheBanHanh',
        title: 'Chủ thể ban hành',
        width: '140px',
      },
      {
        field: 'ngayHieuLuc',
        sortField: 'NgayBanHanh',
        title: 'Ngày hiệu lực',
        width: '140px',
      },
      {
        field: 'thaoTac',
        width: '80px',
        align: 'center'
      }
    ];
  }


  ngOnInit(): void {
    this.getList();
    this.getNhomPhapLuatOptions();
    // Listen input search!
    this.search$.pipe(debounceTime(1000)).subscribe((res: string) => {
      if (res || res === '') {
        this.paginator.SearchText = res;
        this.getList();
      }
    });
    this.searchTenVanBan$.pipe(debounceTime(1000)).subscribe((res: string) => {
      if (res || res === '') {
        this.paginator.TenVanBan = res;
        this.getList();
      }
    });
    this.searchMaVanBan$.pipe(debounceTime(1000)).subscribe((res: string) => {
      if (res || res === '') {
        this.paginator.MaVanBan = res;
        this.getList();
      }
    });
    this.searchChuTheBanHanh$.pipe(debounceTime(1000)).subscribe((res: string) => {
      if (res || res === '') {
        this.paginator.ChuTheBanHanh = res;
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

    this.api.get('/api/thuvienphapluat-list', query).subscribe(res => {
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
  public getNhomPhapLuatOptions() {
    this.api.get('/api/thuvienphapluat-dm/nhom-phap-luat')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.nhomPhapLuatKey, label: m.nhomPhapLuatDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.nhomPhapLuatOptions = res;
        }
      })
  }

  /**
   * Delete
   * @param id 
   */
  public onDelete(id) {
    this.api.delete(`/api/thuvienphapluat-delete/${id}`).subscribe((res: any) => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: "Xoá thư viện pháp luật thành công!",
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.getList();
          });
        } else {
          this.api.errorMessage('Xoá thư viện pháp luật không thành công!');
        }
      }, err => this.api.errorMessage(err));
  }

  public showDetail(item: any) {
    this.router.navigate(['documents', 'librarylaw-detail', item?.thuVienPhapLuatId]);
  }

}
