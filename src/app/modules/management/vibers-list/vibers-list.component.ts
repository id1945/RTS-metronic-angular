import { TranslateService } from '@ngx-translate/core';
import { ViewChild } from '@angular/core';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { of, BehaviorSubject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { FormVibersModalComponent } from './components/form-vibers-modal/form-vibers-modal.component';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { DataTable, Columns } from 'src/app/_metronic/shared/shared/models/dataTable';

@Component({
  selector: 'app-vibers-list',
  templateUrl: './vibers-list.component.html',
  styleUrls: ['./vibers-list.component.scss']
})
export class VibersListComponent implements OnInit {
  public isSearchAdvance = false;
  public ngonNguOptions: Options[] = [];
  public loaiTaiLieuOptions: Options[] = [];
  // Paginator
  public paginator = {
    pageSize: 20,
    page: 1,
    totalRecord: 0,
    sortField: '',
    sortOrder: '',
    // List
    SearchText: '',
    NgonNguKey: '',
    LoaiTaiLieuKey: '',
  };
  // Table
  public dataTable: DataTable<any> = {
    items: [],
    columns: [] as Columns[],
    selected: [],
  };

  @ViewChild('formExpressDelivery', { static: false }) formExpressDelivery: FormVibersModalComponent;

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
        field: 'tieuDe',
        sortField: 'tieuDe',
        title: 'Tiêu đề',
        width: '150px',
      },
      {
        field: 'loaiTinNhan',
        sortField: 'loaiTinNhan',
        title: 'Loại tin nhắn',
        width: '150px',
      },
      {
        field: 'nguoiCapNhap',
        sortField: 'nguoiCapNhap',
        title: 'Người cập nhật',
        width: '150px',
      },
      {
        field: 'ngayCapNhat',
        sortField: 'ngayCapNhat',
        title: 'Ngày cập nhật',
        width: '150px',
      },

      {
        field: 'userNameNguoiNhan',
        sortField: 'userNameNguoiNhan',
        title: 'User người nhận',
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
  //  this.getList();
    this.getNgonNguOptions();
    this.getLoaiTaiLieuOptions();
    // Listen input search!
    this.search$.pipe(debounceTime(1000)).subscribe((res: string) => {
      if (res || res === '') {
        this.paginator.SearchText = res;
        //  this.getList();
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
   // this.getList();
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

    this.api.get('/api/tailieu-list', query).subscribe(res => {
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
  public getNgonNguOptions() {
    this.api.get('/api/tailieu-dm/ngon-ngu')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.ngonNguKey, label: m.ngonNguDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.ngonNguOptions = res;
        }
      })
  }

  public getLoaiTaiLieuOptions() {
    this.api.get('/api/tailieu-dm/loai-tai-lieu')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.loaiTaiLieuKey, label: m.loaiTaiLieuDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.loaiTaiLieuOptions = res;
        }
      })
  }

  /**
   * Delete
   * @param id 
   */
  public onDelete(id) {

    this.api.delete(`/api/tailieu-delete?TaiLieuId= ${id}`)
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
