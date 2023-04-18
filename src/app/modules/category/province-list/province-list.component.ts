import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { TranslateService } from '@ngx-translate/core';
import { ViewChild } from '@angular/core';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { of, BehaviorSubject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { FormProvinceModalComponent } from './components/form-province-modal/form-province-modal.component';
import { DataTable, Columns } from 'src/app/_metronic/shared/shared/models/dataTable';


@Component({
  selector: 'app-province-list',
  templateUrl: './province-list.component.html',
  styleUrls: ['./province-list.component.scss']
})
export class ProvinceListComponent implements OnInit {
  public isSearchAdvance = false;
  public statusOptions: Options[] = [];
  // Paginator
  public paginator = {
    pageSize: 20,
    page: 1,
    totalRecord: 0,
    sortField: 'tinhThanhId',
    sortOrder: 'desc',
    // List
    SearchText: '',
    LoaiDonKey: '',
    TrangThaiKey: '',
  };
  // Table
  public dataTable: DataTable<any> = {
    items: [],
    columns: [] as Columns[],
    selected: [],
  };

  @ViewChild('formExpressDelivery', { static: false }) formExpressDelivery: FormProvinceModalComponent;

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
        field: 'tenTinhThanh',
        sortField: 'tenTinhThanh',
        title: 'Tên tỉnh thành',
        width: '200px',
      },
      {
        field: 'maTinhThanh',
        sortField: 'maTinhThanh',
        title: 'Mã tỉnh thành',
        width: '200px',
      },
      {
        field: 'ghiChu',
        sortField: 'ghiChu',
        title: 'Ghi chú',
        width: '200px',
      },
      {
        field: 'ngayCapNhatString',
        sortField: 'ngayCapNhatString',
        title: 'Ngày cập nhật',
        width: '250px',
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

    this.api.get('/api/tinh-thanh-list', query).subscribe(res => {
      if (res) {
        this.dataTable = { ...this.dataTable, ...res }
        this.paginator = { ...this.paginator, totalRecord: res?.paging?.toTalRecord }
        this.cdf.detectChanges();
      }
      this.api.loadingCustomOff();
    }, err => this.api.loadingCustomOff())
  }

  /**
   * Get danh muc options
   */
  public getTrangThaiOptions() {
    this.api.get('/api/dangky-chuyephatnhanh-danhmuc/trang-thai')
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
   public onDelete(Id) {
    this.api.delete(`/api/tinh-thanh-delete?TinhThanh=${Id }`)
      .subscribe((res: any) => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: "Xoá thành công!",
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.getList();
          });
        } else {
          this.api.errorMessage("Xoá  không thành công!");
        }
      }, err => {
        this.api.errorMessage(err);
      });
  }

}
