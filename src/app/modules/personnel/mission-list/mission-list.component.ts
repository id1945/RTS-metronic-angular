import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core'
import { Router } from '@angular/router';
import { MissionFormModalComponent } from './components/mission-form-modal/mission-form-modal.component';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import swal from 'sweetalert';
import { removeEmpty } from 'src/app/_metronic/shared/shared/common/helper';
import { DataTable, Columns } from 'src/app/_metronic/shared/shared/models/dataTable';

@Component({
  selector: 'app-mission-list',
  templateUrl: './mission-list.component.html',
  styleUrls: ['./mission-list.component.scss']
})
export class MissionListComponent implements OnInit {
  public isSearchAdvance = false;
  // Paginator
  public paginator = {
    pageSize: 20,
    page: 1,
    totalRecord: 0,
    SortField: 'hoSoId',
    SortOrder: 'desc',
    // List
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

  @ViewChild('missionForm', { static: false }) missionForm: MissionFormModalComponent;

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
        field: 'maDieuDongCongTac',
        sortField: 'maDieuDongCongTac',
        title: 'Mã điều động công tác',
        width: '200px',
      },
      {
        field: 'noiDungCongTac',
        sortField: 'noiDungCongTac',
        title: 'Nội dung',
        width: '200px',
      },
      {
        field: 'diaDiem',
        sortField: 'diaDiem',
        title: 'Địa điểm',
        width: '150px',
      },
      {
        field: 'tenLoaiNghiepVu',
        sortField: 'tenLoaiNghiepVu',
        title: 'Nghiệp vụ',
        width: '150px',
      },
      {
        field: 'ngayDi',
        sortField: 'ngayDi',
        title: 'Ngày đi',
        width: '150px',
      },
      {
        field: 'ngayVe',
        sortField: 'ngayVe',
        title: 'Ngày về',
        width: '150px',
      },
      {
        field: 'soNguoiDi',
        sortField: 'soNguoiDi',
        title: 'Số người đi',
        width: '120px',
      },
      {
        field: 'tinhTrangDisplay',
        sortField: 'tinhTrangDisplay',
        title: this.translate.instant('PURCHASE.DETAIL.table.detail.statusLabel'),
        width: '150px',
      },
      {
        field: 'thaoTac',
        title: 'Thao tác',
        width: '50px',
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

    const query = removeEmpty({
      ...this.paginator,
      Page: this.paginator.page,
      ItemsPerPage: this.paginator?.pageSize,
      SortOrder: this.paginator?.SortOrder?.replace('end', '')
    });

    delete query.page;
    delete query.pageSize;
    delete query.totalRecord;

    this.api.get('/api/dieudong-congtac-list', query).subscribe(res => {
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
    this.api.get('/api/dieudong-congtac-dm/trang-thai')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.trangThaiKey, label: m.trangThaiDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.statusOptions = res;
        }
      })
  }

  public getTinhTrangOptions() {
    this.api.get('/api/dieudong-congtac-dm/tinh-trang')
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
    this.api.delete(`/api/dieudong-congtac-delete?HoSoId=${id}`)
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
    return this.router.navigate(['/personnel', 'mission', 'detail', item?.hoSoId])
  }
}
