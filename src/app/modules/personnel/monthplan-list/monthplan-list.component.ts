import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core'
import { Router } from '@angular/router';
import { MonthPlanFormModalComponent } from './components/monthplan-form-modal/monthplan-form-modal.component';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import swal from 'sweetalert';
import { DataTable, Columns } from 'src/app/_metronic/shared/shared/models/dataTable';

@Component({
  selector: 'app-monthplan-list',
  templateUrl: './monthplan-list.component.html',
  styleUrls: ['./monthplan-list.component.scss']
})
export class MonthPlanListComponent implements OnInit {
  public isSearchAdvance = false;
  // Paginator
  public paginator = {
    pageSize: 20,
    page: 1,
    totalRecord: 0,
    SortField: 'hoSoId',
    SortOrder: 'desc',
    // List
    NgayTaoTu: null,
    NgayTaoDen: null,
    SearchText: '',
    TrangThaiKey: '',
    TinhTrangKey: '',
  };
  // Table
  public dataTable: DataTable<any> = {
    items: [],
    columns: [] as Columns[],
    selected: [],
  };
  public statusOptions: any[] = [];
  public selectStatusOptions: any;
  public tinhTrangOptions: any[] = [];
  public selectTinhTrangOptions: any;

  @ViewChild('purchaseForm', { static: false }) purchaseForm: MonthPlanFormModalComponent;

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
        field: 'STT',
        sortField: 'STT',
        title: 'Số TT',
        width: '50px',
      },
      {
        field: 'tieuDe',
        sortField: 'TieuDe',
        title: 'Tiêu đề',
        width: '300px',
      },
      {
        field: 'tenNguoiTao',
        sortField: 'NguoiTao',
        title: this.translate.instant('PURCHASE.DETAIL.table.detail.proponentLabel'),
        width: '150px',
      },
      {
        field: 'tenPhongBan',
        sortField: 'PhongBan',
        title: 'Bộ phận',
        width: '180px',
      },
      {
        field: 'ngayTao',
        sortField: 'NgayTao',
        title: this.translate.instant('PURCHASE.DETAIL.table.detail.requestDateLabel'),
        width: '120px',
      },
      {
        field: 'tinhTrangDisplay',
        sortField: 'TrangThai',
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

  public onChangeDateRange(e) {
    this.paginator.NgayTaoTu = ~~(new Date(e?.[0]).getTime()/1000);
    this.paginator.NgayTaoDen = ~~(new Date(e?.[1]).getTime()/1000);
    this.getList();
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

    this.api.get('/api/kehoach-congtac-list', query).subscribe(res => {
      if (res) {
        this.dataTable = { ...this.dataTable, ...res }
        this.paginator = { ...this.paginator, totalRecord: res?.paging?.toTalRecord }
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
    this.api.get('/api/kehoach-congtac-dm/trang-thai')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.trangThaiKey, label: m.trangThaiDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.statusOptions = res;
        }
      })
  }

  public getTinhTrangOptions() {
    this.api.get('/api/kehoach-congtac-dm/tinh-trang')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.tinhTrangKey, label: m.tinhTrangDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.tinhTrangOptions = res;
        }
      })
  }

  /**
   * Delete
   * @param id 
   */
  public onDelete(id) {
    this.api.delete(`/api/kehoach-congtac-delete/${id}`)
      .subscribe((res: any) => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: "Xoá kế hoạch công tác thành công!",
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.getList();
          });
        } else {
          this.api.errorMessage("Xoá kế hoạch công tác không thành công!");
        }
      }, err => {
        this.api.errorMessage(err);
      });
  }

  public showDetail(item) {
    return this.router.navigate(['/personnel', 'month-plan', 'detail', item?.hoSoId])
  }
}
