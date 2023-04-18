import { TranslateService } from '@ngx-translate/core';
import { ViewChild } from '@angular/core';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { of, BehaviorSubject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { FormUsersModalComponent } from './components/form-users-modal/form-users-modal.component';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { DataTable, Columns } from 'src/app/_metronic/shared/shared/models/dataTable';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  public isSearchAdvance = false;
  public statusOptions: Options[] = [];
  // Paginator
  public paginator = {
    pageSize: 20,
    page: 1,
    totalRecord: 0,
    sortField: 'nguoiDungId',
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

  @ViewChild('formExpressDelivery', { static: false }) formExpressDelivery: FormUsersModalComponent;

  public search$ = new BehaviorSubject(null);

  constructor(
    private api: ApiService,
    private cdf: ChangeDetectorRef,
    private translate: TranslateService,
  ) {

    // Table config title and field
    this.dataTable.columns = [
      {
        field: 'tenDangNhap',
        sortField: 'tenDangNhap',
        title: 'Tên đăng nhập',
        width: '150px',
      },
      {
        field: 'hoTen',
        sortField: 'hoTen',
        title: 'Họ tên',
        width: '150px',
      },
      {
        field: 'email',
        sortField: 'email',
        title: 'Email',
        width: '150px',
      },
      {
        field: 'nhomNguoiDungDisplay',
        sortField: 'nhomNguoiDungDisplay',
        title: 'Nhóm người dùng',
        width: '150px',
      },

      {
        field: 'phongBanDisplay',
        sortField: 'phongBanDisplay',
        title: 'Phòng ban',
        width: '150px',
      },
      {
        field: 'trangThaiDisplay',
        sortField: 'trangThaiDisplay',
        title: 'Trạng thái',
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

    this.api.get('/api/nguoidung-list', query).subscribe(res => {
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
    this.api.get('/api/nguoidung-dm/phong-ban')
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
    this.api.delete(`/api/nguoidung-create?NguoiDungId=${id}`).subscribe((res: any) => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: "Xoá người dùng thành công!",
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.getList();
          });
        } else {
          this.api.errorMessage("Xoá người dùng không thành công!");
        }
      }, err => {
        this.api.errorMessage(err);
      });
  }
}