
import { TranslateService } from '@ngx-translate/core';
import { ViewChild } from '@angular/core';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { RegisterVehicleModalComponent } from './components/form-registervehicle-modal/form-registervehicle-modal.component';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { DataTable, Columns } from 'src/app/_metronic/shared/shared/models/dataTable';

@Component({
  selector: 'app-registervehicle-list',
  templateUrl: './registervehicle-list.component.html',
  styleUrls: ['./registervehicle-list.component.scss']
})
export class RegisterVehicleListComponent implements OnInit {
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
    TrangThaiKey: '',
  };
  // Table
  public dataTable: DataTable<any> = {
    items: [],
    columns: [] as Columns[],
    selected: [],
  };

  @ViewChild('formRegisterVehicle', { static: false }) formRegisterVehicle: RegisterVehicleModalComponent;

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
        sortField: 'nguoiTaoHoTen',
        title: 'Người đề nghị',
        width: '150px',
      },
      {
        field: 'thoiGianDi',
        // sortField: 'thoiGianDi',
        title: 'Thời gian đi',
        width: '140px',
      },

      {
        field: 'thoiGianVe',
        // sortField: 'thoiGianVe',
        title: 'Thời gian về',
        width: '140px',
      },
      {
        field: 'ngayTao',
        // sortField: 'ngayTao',
        title: 'Ngày tạo',
        width: '150px',
      },
      {
        field: 'trangThaiDisplay',
        // sortField: 'trangThaiDisplay',
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

    this.api.get('/api/xeduadon-list', query).subscribe(res => {
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
    // this.api.get('/api/buupham-danhmuc/trang-thai')
    //   .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.trangThaiKey, label: m.trangThaiDisplay })))))
    //   .subscribe((res: any) => {
    //     if (res) {
    //       this.statusOptions = res;
    //     }
    //   })
  }
  

  /**
   * Delete
   * @param id 
   */
  public onDelete(id) {
    this.api.delete(`/api/xeduadon-delete/${id}`)
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

  public showDetail(item) {
    return this.router.navigate(['administration', 'registervehicle-detail', item.hoSoId])
  }
}