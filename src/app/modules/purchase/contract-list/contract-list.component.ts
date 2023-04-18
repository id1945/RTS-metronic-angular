import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { DataTable, Columns } from 'src/app/_metronic/shared/shared/models/dataTable';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss']
})
export class ContractListComponent implements OnInit {
  public isSearchAdvance = false;
  // Paginator
  public paginator = {
    pageSize: 20,
    page: 1,
    totalRecord: 0,
    SortField: '',
    SortOrder: '',
    // List
    SearchText: '',
    NgayTaoTu: null,
    NgayTaoDen: null,
    BoPhanYeuCauKey: '',
    NhaCungCapKey: '',
    TrangThaiKey: '',
  };
  public search$ = new BehaviorSubject(null);
  // Table
  public dataTable: DataTable<any> = {
    items: [],
    columns: [] as Columns[],
  };

  public statusOptions: Options[] = [];
  public nhaCungOptions: Options[] = [];

  constructor(
    private api: ApiService,
    private cdf: ChangeDetectorRef,
    private router: Router,
    private translate: TranslateService,
  ) {
    // Table config title and field
    this.dataTable.columns = [
      {
        field: 'soHopDong',
        sortField: 'soHopDong',
        title: this.translate.instant('CONTRACT.DETAIL.table.detail.referenceCodeLabel'),
        width: '130px',
      },
      {
        field: 'ycmHs',
        sortField: 'ycmHs',
        title: this.translate.instant('CONTRACT.DETAIL.table.detail.purchaseNumberLabel'),
        width: '120px',
      },
      {
        field: 'tenNguoiTao',
        sortField: 'tenNguoiTao',
        title: this.translate.instant('CONTRACT.DETAIL.table.detail.proponentLabel'),
        width: '120px',
      },
      {
        field: 'tenBoPhanYCMHs',
        sortField: 'tenBoPhanYCMHs',
        title: this.translate.instant('CONTRACT.DETAIL.table.detail.departmentLabel'),
        width: '120px',
      },
      {
        field: 'noiDungHD',
        sortField: 'noiDungHD',
        title: this.translate.instant('CONTRACT.DETAIL.table.detail.contentLabel'),
        width: '150px',
      },
      {
        field: 'ngayTao',
        sortField: 'ngayTao',
        title: this.translate.instant('CONTRACT.DETAIL.table.detail.requestDateLabel'),
        width: '80px',
      },
      {
        field: 'tenNhaCungCap',
        sortField: 'tenNhaCungCap',
        title: this.translate.instant('CONTRACT.DETAIL.table.detail.supplierLabel'),
        width: '150px',
      },
      {
        field: 'tenTrangThai',
        sortField: 'tenTrangThai',
        title: this.translate.instant('CONTRACT.DETAIL.table.detail.statusLabel'),
        width: '150px',
      },
    ];
  }


  ngOnInit(): void {
    this.getList();
    this.getStatusOptions();
    this.getNCCOptions();
    // Listen input search!
    this.search$.pipe(debounceTime(1000)).subscribe((res: string) => {
      if (res || res === '') {
        this.paginator.SearchText = res;
        this.getList();
      }
    })
  }

  ngOnDestroy() {
  }

  public getList() {
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

    this.api.get('/api/purchase-contract-list', query).subscribe(res => {
      if (res) {
        const items = res?.items?.map(m => {
          if (m?.ycmHs) return { ...m, ycmHs: m?.ycmHs?.map(m1 => m1?.maYCMH) }
          return m;
        });
        this.dataTable = {
          ...this.dataTable,
          items: items
        };
        this.paginator = { ...this.paginator, totalRecord: res?.paging?.toTalRecord };
        this.cdf.detectChanges();
      }
      this.api.loadingCustomOff();
    }, err => {
      this.api.loadingCustomOff();
    });
  }

  public getStatusOptions() {
    this.api.get('/api/purchase-contract-dm/trang-thai')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.trangThaiKey, label: m.trangThaiDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.statusOptions = res;
        }
      })
  }

  public getNCCOptions() {
    this.api.get('/api/purchase-danh-muc/nha-cung-cap')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.nhaCungCapKey, label: m.nhaCungCapDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.nhaCungOptions = res;
        }
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

  public showDetail(item) {
    return this.router.navigate(['purchase/contract', 'detail', item.idDeNghi])
  }

  public onChangeDate(e) {
    this.paginator.NgayTaoTu = ~~(new Date(e?.[0]).getTime()/1000);
    this.paginator.NgayTaoDen = ~~(new Date(e?.[1]).getTime()/1000);
    this.getList();
  }
}
