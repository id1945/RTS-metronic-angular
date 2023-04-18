import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { of, BehaviorSubject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { NumberdocsFormModalComponent } from './components/numberdocs-form-modal/numberdocs-form-modal.component';
import { DataTable, Columns } from 'src/app/_metronic/shared/shared/models/dataTable';

@Component({
  selector: 'app-numberdocs-list',
  templateUrl: './numberdocs-list.component.html',
  styleUrls: ['./numberdocs-list.component.scss']
})
export class NumberdocsListComponent implements OnInit {
  public isSearchAdvance = false;

  public CanExport = false;
  public statusOptions: any[] = [];
  // Paginator
  public paginator = {
    pageSize: 20,
    page: 1,
    totalRecord: 0,
    sortField: '',
    sortOrder: '',
    // List
    SearchText: '',
    NgayTaoTu: null,
    NgayTaoDen: null,
    TrangThaiKey: '',
  };
  // Table
  public dataTable: DataTable<any> = {
    items: [],
    columns: [] as Columns[],
    selected: [],
  };

  @ViewChild('numberdocsForm', { static: false }) numberdocsForm: NumberdocsFormModalComponent;

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
        field: 'tenVanBan',
        title: 'Tên văn bản',

        width: '400px',
      },
      {
        field: 'soVanBan',
        title: 'Số văn bản',
        width: '140px',
      },
      {
        field: 'donViNhan',
        title: 'Đơn vị nhận',
        width: '140px',
      },
      {
        field: 'tenNguoiTao',
        title: 'Tên người tạo',
        width: '140px',
      },
      {
        field: 'ngayTao',
        title: 'Ngày tạo',
        width: '140px',
      },
      {
        field: 'trangThaiDisplay',
        title: 'Trạng thái',
        width: '140px',
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
    //  this.getTrangThaiOptions();
    // Listen input search!
    this.search$.pipe(debounceTime(1000)).subscribe((res: string) => {
      if (res || res === '') {
        this.paginator.SearchText = res;
        this.getList();
      }
    })
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

  public onChangeDateRange(e) {
    this.paginator.NgayTaoTu = ~~(new Date(e?.[0]).getTime()/1000);
    this.paginator.NgayTaoDen = ~~(new Date(e?.[1]).getTime()/1000);
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

    this.api.get('/api/lay-so-vanban-list', query).subscribe(res => {
      if (res) {
        this.CanExport = res.canExport;
        this.dataTable = { ...this.dataTable, ...res }
        this.paginator = { ...this.paginator, totalRecord: res?.paging?.toTalRecord }
        this.cdf.detectChanges();
      }
      this.api.loadingCustomOff();
    }, () => this.api.loadingCustomOn())
  }

  /**
   * Get danh muc options
   */
  public getTrangThaiOptions() {
    this.api.get('/api/vanban-dinhche-danhmuc/trang-thai')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.trangThaiKey, label: m.trangThaiDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.statusOptions = res;
        }
      })
  }

  /**
   * Delete
   * @param id 
   */
  public onDelete(id) {
    this.api.delete(`/api/vanban-dinhche-delete/${id}`)
      .subscribe((res: any) => {
        if (res) {
          swal({
            icon: "success",
            title: "Xoá văn bản định chế thành công!",
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.getList();
          });
        }
      }, err => {
        this.api.errorMessage(err);
      });
  }

  /**
   * Download file zip
   * @param id 
   */
  public zipFile(id) {
    const query = { vanBanDinhCheId: id };
    const header = {
      observe: 'response',
      responseType: 'blob' as 'json',
    };
    this.api.get('/api/vanban-dinhche-misc/zip-all-files', query, header).subscribe(res => {
      /* Get blob */
      const blob = new Blob([res.body], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const fileName = `[vanban_dinhche]_${new Date().getTime()}.zip`;
      /* Download */
      this.api.downloadURI(url, fileName);
    }, err => {
      this.api.errorMessage(err);
    });
  }

  public exportExcel() {
    const query = {
      searchText: this.paginator.SearchText,
      ngayTaoTu: this.paginator.NgayTaoTu,
      ngayTaoDen: this.paginator.NgayTaoDen
    }
    const header = {
      observe: 'response',
      responseType: 'blob' as 'json',
    };
    this.api.get('/api/lay-so-vanban-list/export-excel', query, header).subscribe(res => {
      if (res) {
        this.api.downloadFileFromBlob(res);
      }
    }, err => this.api.errorMessage(err));
  }


  public showDetail(item) {
    this.router.navigate(['documents', 'numberdocs-detail', item?.laySoVanBanId]);
  }
}
