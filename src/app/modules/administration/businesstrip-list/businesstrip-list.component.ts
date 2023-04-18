
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { BussinesstripModalComponent } from './components/form-bussinesstrip-modal/form-bussinesstrip-modal.component';
import { DataTable, Columns } from 'src/app/_metronic/shared/shared/models/dataTable';

@Component({
  selector: 'app-businesstrip-list',
  templateUrl: './businesstrip-list.component.html',
  styleUrls: ['./businesstrip-list.component.scss']
})
export class BusinessTripListComponent implements OnInit {
  public isSearchAdvance = false;
  public statusOptions: any[] = [];
  // Paginator
  public paginator = {
    pageSize: 20,
    page: 1,
    totalRecord: 0,
    sortField: 'hoSoId',
    sortOrder: 'desc',
    NgayTaoTu: null,
    NgayTaoDen: null,
    // List
    SearchText: '',
    TrangThaiKey: '',
  };
  // Table
  public dataTable: DataTable<any> = {
    items: [],
    columns: [] as Columns[],
    selected: [],
  };

  public search$ = new BehaviorSubject(null);

  @ViewChild('formBussinesstrip', { static: false }) formBussinesstrip: BussinesstripModalComponent;

  constructor(
    private api: ApiService,
    private router: Router,
    private cdf: ChangeDetectorRef,
  ) {

    // Table config title and field
    this.dataTable.columns = [
      {
        field: 'maChuyenDi',
        sortField: 'maChuyenDi',
        title: 'Mã chuyến đi',
        width: '150px',
      },
      {
        field: 'nguoiDatHoTen',
        sortField: 'nguoiDatHoTen',
        title: 'Cán bộ tạo',
        width: '150px',
      },
      {
        field: 'diaChiDon',
        sortField: 'diaChiDon',
        title: 'Điểm đón',
        width: '140px',
      },
      {
        field: 'thoiGianDon',
        sortField: 'thoiGianDon',
        title: 'Thời gian đón',
        width: '140px',
      },
      {
        field: 'taiXeHoTen',
        sortField: 'taiXeHoTen',
        title: 'Tài xế',
        width: '150px',
      },
      {
        field: 'taiXeSoDT',
        sortField: 'taiXeSoDT',
        title: 'Điện thoại',
        width: '140px',
      },
      {
        field: 'xeDonBienSo',
        sortField: 'xeDonBienSo',
        title: 'Biển số xe',
        width: '140px',
      },
      {
        field: 'trangThaiDisplay',
        sortField: 'trangThaiDisplay',
        title: 'Trạng thái',
        width: '140px',
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

    this.api.get('/api/danhsachchuyendi-list', query).subscribe(res => {
      if (res) {
        this.dataTable = { ...this.dataTable, ...res }
        this.paginator = { ...this.paginator, totalRecord: res?.paging?.toTalRecord }
        this.cdf.detectChanges();
      }
      this.api.loadingCustomOff();
    }, err => this.api.loadingCustomOff())
  }

  public exportExcel() {
    const bodyParams = {
      searchText: this.paginator.SearchText,
      ngayTaoTu: this.paginator.NgayTaoTu,
      ngayTaoDen: this.paginator.NgayTaoDen
    }
    const header = {
      observe: 'response',
      responseType: 'blob' as 'json',
    };
    this.api.get('/api/danhsachchuyendi-list/export-excel', bodyParams, header).subscribe(res => {
      if (res) {
        this.api.downloadFileFromBlob(res);
      }
    }, err => {
      // Message error
      this.api.errorMessage(err);
    });
  }

  public onChangeDateRange(e) {
    this.paginator.NgayTaoTu = ~~(new Date(e?.[0]).getTime()/1000);
    this.paginator.NgayTaoDen = ~~(new Date(e?.[1]).getTime()/1000);
    this.getList();
  }

  public exportExcelChuyenDi() {
    const bodyParams = {
    }
    const header = {
      observe: 'response',
      responseType: 'blob' as 'json',
    };
    this.api.get('/api/danhgia-chuyendi-list/export-excel', bodyParams, header).subscribe(res => {
      if (res) {
        this.api.downloadFileFromBlob(res);
      }
    }, err => {
      // Message error
      this.api.errorMessage(err);
    });
  }

  public showDetail(item) {
    return this.router.navigate(['administration', 'bussinesstrip-detail', item.id])
  }
}
