import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { DataTable, Columns } from 'src/app/_metronic/shared/shared/models/dataTable';
import { Options } from 'src/app/_metronic/shared/shared/models/options';

@Component({
  selector: 'app-supplier-selection-list',
  templateUrl: './supplier-selection-list.component.html',
  styleUrls: ['./supplier-selection-list.component.scss']
})
export class SupplierSelectionListComponent implements OnInit {
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
    selected: [],
  };

  public statusOptions: Options[] = [];
  public selectStatusOptions: any;
  public nhaCungOptions: Options[] = [];
  public boPhanYeuCauOptions: Options[] = [];

  constructor(
    private api: ApiService,
    private cdf: ChangeDetectorRef,
    private router: Router,
    private translate: TranslateService,
  ) {
    // Table config title and field
    this.dataTable.columns = [
      {
        field: 'soDeXuat',
        sortField: 'soDeXuat',
        title: this.translate.instant('SUPPLIER.DETAIL.table.detail.referenceCodeLabel'),
        width: '180px',
      },
      {
        field: 'ycmh',
        sortField: 'ycmh',
        title: this.translate.instant('SUPPLIER.DETAIL.table.detail.purchaseNumberLabel'),
        width: '130px',
      },
      {
        field: 'tenNguoiYCMH',
        sortField: 'tenNguoiYCMH',
        title: this.translate.instant('SUPPLIER.DETAIL.table.detail.proponentLabel'),
        width: '130px',
      },
      {
        field: 'tenBoPhanYCMH',
        sortField: 'tenBoPhanYCMH',
        title: this.translate.instant('SUPPLIER.DETAIL.table.detail.departmentLabel'),
        width: '150px',
      },
      {
        field: 'noiDung',
        sortField: 'noiDung',
        title: this.translate.instant('SUPPLIER.DETAIL.table.detail.contentLabel'),
        width: '150px',
      },
      {
        field: 'tenNhaCungCaps',
        sortField: 'tenNhaCungCaps',
        title: this.translate.instant('SUPPLIER.DETAIL.table.detail.supplierLabel'),
        width: '150px',
      },
      {
        field: 'tenTrangThai',
        sortField: 'tenTrangThai',
        title: this.translate.instant('SUPPLIER.DETAIL.table.detail.statusLabel'),
        width: '150px',
      },
    ];
  }


  ngOnInit(): void {
    this.getStatusOptions();
    this.getNCCOptions();
    this.getList();
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

    this.api.get('/api/purchase-requisition-list', query).subscribe(res => {
      if (res) {
        const items = res?.items?.map(m => {
          if (m?.ycmh) return { ...m, ycmh: m?.ycmh?.items?.map(m1 => m1?.maYCMH) }
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
    })
  }

  public getStatusOptions() {
    this.api.get('/api/purchase-requisition-dm/trang-thai')
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

  public showDetail(item) {
    return this.router.navigate(['purchase/supplier-selection', 'detail', item.idDeXuat])
  }

  public onChangeDate(e) {
    this.paginator.NgayTaoTu = ~~(new Date(e?.[0]).getTime()/1000);
    this.paginator.NgayTaoDen = ~~(new Date(e?.[1]).getTime()/1000);
    this.getList();
  }
}