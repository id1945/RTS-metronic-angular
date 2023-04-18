import { BehaviorSubject, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { renderYearRange } from 'src/app/_metronic/shared/shared/common/helper';
import { FormPostsModalComponent } from './components/form-posts-modal/form-posts-modal.component';
import swal from 'sweetalert';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { DataTable, Columns } from 'src/app/_metronic/shared/shared/models/dataTable';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent implements OnInit {
  public isSearchAdvance = false;
  // Paginator
  public paginator = {
    pageSize: 20,
    page: 1,
    totalRecord: 0,
    SortField: 'BaiVietId',
    SortOrder: 'desc',
    // List
    searchText: '',
    namKey: '',
    nhomBaiViet: '',
  };
  public SearchText$ = new BehaviorSubject(null);
  // Table
  public dataTable: DataTable<any> = {
    items: [],
    columns: [] as Columns[],
    selected: [],
  };
  public namOptions: Options[] = renderYearRange(2018, 2030);
  public nhomBaiVietOptions: Options[] = [];

  @ViewChild('formPosts') formPosts: FormPostsModalComponent;

  constructor(
    private api: ApiService,
    private cdf: ChangeDetectorRef,
    private translate: TranslateService,
  ) {
    // Table config title and field
    this.dataTable.columns = [
      {
        field: 'tenBaiViet',
        sortField: 'tenBaiViet',
        title: 'Tên bài viết',
        width: '350px',
        align: 'left'
      },
      {
        field: 'tenNguoiDang',
        sortField: 'tenNguoiDang',
        title: 'Người đăng',
        width: '180px',
        align: 'left'
      },
      {
        field: 'nhomBaiViet',
        sortField: 'nhomBaiViet',
        title: 'Nhóm bài viết',
        width: '180px',
        align: 'left'
      },
      {
        field: 'ngayTao',
        sortField: 'ngayTao',
        title: 'Ngày tạo',
        width: '100px',
        align: 'left'
      },
      {
        field: 'tenTrangThai',
        sortField: 'trangThai',
        title: 'Trạng thái',
        width: '100px',
        align: 'left'
      },
      {
        field: 'anhDaiDienURL',
        // sortField: 'anhDaiDienURL',
        title: 'Ảnh đại diện',
        width: '100px',
        align: 'center'
      },
      {
        field: 'isAllowRoleXuatBan',
        // sortField: 'isAllowRoleXuatBan',
        title: 'Xuất bản',
        width: '70px',
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
    // Load datatable
    this.getList();
    this.getNhomBaiViet();
    // Listen input search!
    this.SearchText$.pipe(debounceTime(1000)).subscribe((res: string) => {
      if (res || res === '') {
        this.paginator.searchText = res;
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

    this.api.loadingCustomOn();
    this.api.get('/api/baiviet-list', query).subscribe(res => {
      if (res) {
        this.dataTable = { ...this.dataTable, ...res }
        this.paginator = { ...this.paginator, totalRecord: res?.paging?.toTalRecord }
        this.dataTable.items = this.dataTable?.items?.map(m => ({ ...m, expand: false }))
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
    this.dataTable.columns = this.dataTable.columns.map(m => (field == m.field ? { ...m, sortOrder: e } : { ...m, sortOrder: null }))
    this.getList();
  }

  public getNhomBaiViet() {
    this.api.get('/api/baiviet-danhmuc/nhom-bai-viet')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.nhomBaiVietDisplay, label: m.nhomBaiVietDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.nhomBaiVietOptions = res;
        }
      })
  }

  /**
   * Delete
   * @param id 
   */
  public onDelete(id) {
    this.api.delete(`/api/baiviet-delete/${id}`)
      .subscribe((res: any) => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: "Xoá bài viết thành công!",
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.getList();
          });
        } else {
          this.api.errorMessage("Xoá bài viết không thành công!");
        }
      }, err => {
        this.api.errorMessage(err);
      });
  }

  public onPublish(baiVietId: string) {
    this.api.get('/api/baiviet-list/xuat-ban', { baiVietId: baiVietId }).subscribe(res => {
      swal({
        icon: "success",
        title: "Xuất bản thành công!",
        buttons: {
          ok: this.translate.instant('COMMON.btn.close'),
        },
      } as any).then(() => {
        this.getList();
      });
    })
  }

}