
import { TranslateService } from '@ngx-translate/core';
import { ViewChild } from '@angular/core';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { of, BehaviorSubject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { StationeryModalComponent } from './components/form-stationery-modal/form-stationery-modal.component';
import { ApproveStationeryModalComponent } from './components/detail-stationery/approve-stationery-modal/approve-stationery-modal.component';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { DataTable, Columns } from 'src/app/_metronic/shared/shared/models/dataTable';
@Component({
  selector: 'app-stationery-list',
  templateUrl: './stationery-list.component.html',
  styleUrls: ['./stationery-list.component.scss']
})
export class StationeryListComponent implements OnInit {
  public isSearchAdvance = false;
  public statusOptions: any[] = [];
  // Paginator
  public paginator = {
    pageSize: 20,
    page: 1,
    totalRecord: 0,
    sortField: 'hoSoId',
    sortOrder: 'desc',
    // List
    SearchText: '',
    NgayTao: '',
    TrangThaiKey: '',
    TinhTrangKey: '',
  };
  // Table
  public dataTable: DataTable<any> = {
    items: [],
    columns: [] as Columns[],
    selected: [],
  };

  @ViewChild('formStationery', { static: false }) formStationery: StationeryModalComponent;
  @ViewChild('approveStationery') approveStationery: ApproveStationeryModalComponent;

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
        field: 'nguoiTaoHoTen',
        sortField: 'NguoiTaoHoTen',
        title: 'Người đề nghị',
        width: '200px',
      },
      {
        field: 'tenPhongBan',
        sortField: 'TenPhongBan',
        title: 'Bộ phận',
        width: '150px',
      },
      {
        field: 'ngayTao',
        sortField: 'NgayTao',
        title: 'Ngày tạo',
        width: '150px',
        align: 'center'
      },
      // {
      //   field: 'tongSoLuong',
      //   sortField: 'TongSoLuong',
      //   title: 'Số lượng',
      //   width: '120px',
      //   align: 'right'
      // },
      {
        field: 'tongThanhTien',
        sortField: 'TongThanhTien',
        title: 'Tổng tiền',
        width: '120px',
        align: 'right'
      },
      {
        field: 'trangThaiDisplay',
        sortField: 'TrangThai',
        title: 'Trạng thái',
        width: '120px',
        align: 'center'
      },
      {
        title: 'Thao tác',
        width: '100px',
        align: 'center'
      }
    ];
  }

  ngOnInit(): void {
    this.getList();
    this.getTrangThaiOptions();
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

    this.api.get('/api/hoso-vanphongpham-list', query).subscribe(res => {
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
    this.api.get('/api/hoso-vanphongpham-dm/trang-thai')
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
    this.api.delete(`/api/hoso-vanphongpham-delete/${id}`)
      .subscribe((res: any) => {
        if (res) {
          swal({
            icon: "success",
            title: "Xoá đơn đăng ký Văn phòng phẩm thành công!",
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

  public showDetail(hoSoId) {
    this.router.navigate(['/administration', 'stationery-detail', hoSoId]);
  }

}
