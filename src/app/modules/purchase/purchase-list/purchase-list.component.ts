import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core'
import { Router } from '@angular/router';
import { PurchaseFormModalComponent } from './components/purchase-form-modal/purchase-form-modal.component';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { DataTable, Columns } from 'src/app/_metronic/shared/shared/models/dataTable';


@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.scss']
})
export class PurchaseListComponent implements OnInit {
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
    TrangThaiKey: '',
    TinhTrangKey: '',
  };
  // Table
  public dataTable: DataTable<any> = {
    items: [],
    columns: [] as Columns[],
  };
  public statusOptions: any[] = [];
  public tinhTrangOptions: any[] = [];

  @ViewChild('purchaseForm', { static: false }) purchaseForm: PurchaseFormModalComponent;

  public search$ = new BehaviorSubject(null);

  constructor(
    private api: ApiService,
    private cdf: ChangeDetectorRef,
    private router: Router,
    private translate: TranslateService,
  ) {
    // Table config title and field
    this.dataTable.columns = [
      {
        field: 'maThamChieu',
        sortField: 'maThamChieu',
        title: this.translate.instant('PURCHASE.DETAIL.table.detail.referenceCodeLabel'),
        width: '150px',
      },
      {
        field: 'nguoiDeNghi',
        sortField: 'nguoiDeNghi',
        title: this.translate.instant('PURCHASE.DETAIL.table.detail.proponentLabel'),
        width: '150px',
      },
      {
        field: 'boPhan',
        sortField: 'boPhan',
        title: this.translate.instant('PURCHASE.DETAIL.table.detail.departmentLabel'),
        width: '180px',
      },
      {
        field: 'noiDung',
        sortField: 'noiDung',
        title: this.translate.instant('PURCHASE.DETAIL.table.detail.contentLabel'),
        width: '180px',
      },
      {
        field: 'tongTien',
        sortField: 'tongTien',
        title: this.translate.instant('PURCHASE.DETAIL.table.detail.totalAmountLabel'),
        width: '150px',
        align: 'right'
      },
      {
        field: 'ngayTao',
        sortField: 'ngayTao',
        title: this.translate.instant('PURCHASE.DETAIL.table.detail.requestDateLabel'),
        width: '120px',
      },
      {
        field: 'trangThai',
        sortField: 'trangThai',
        title: this.translate.instant('PURCHASE.DETAIL.table.detail.statusLabel'),
        width: '150px',
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
    // Load datatable
    this.getList();
    this.getStatusOptions();
    this.getTinhTrangOptions();
    // Listen input search!
    this.search$.pipe(debounceTime(1000)).subscribe((res: string) => {
      if (res || res === '') {
        this.paginator.SearchText = res;
        this.getList();
      }
    })
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

    this.api.get('/api/purchase-product-list', query).subscribe(res => {
      if (res) {
        this.dataTable = { ...this.dataTable, ...res };
        this.paginator = { ...this.paginator, totalRecord: res.totalRecord };
        this.cdf.detectChanges();
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

  public getStatusOptions() {
    this.api.get('/api/purchase-danh-muc/trang-thai')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.trangThaiKey, label: m.trangThaiDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.statusOptions = res;
        }
      })
  }

  public getTinhTrangOptions() {
    this.api.get('/api/purchase-danh-muc/tinh-trang')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.tinhTrangKey, label: m.tinhTrangDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.tinhTrangOptions = res;
        }
      })
  }

  public showDetail(item) {
    return this.router.navigate(['purchase', 'detail', item.id, item.maThamChieu])
  }
}
