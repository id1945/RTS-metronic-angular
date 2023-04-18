import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import swal from 'sweetalert';
import { DataTable, Columns } from 'src/app/_metronic/shared/shared/models/dataTable';

@Component({
  selector: 'app-video-library-list',
  templateUrl: './video-library-list.component.html',
  styleUrls: ['./video-library-list.component.scss']
})
export class VideoLibraryListComponent implements OnInit {

  // Paginator
  public paginator = {
    pageSize: 20,
    page: 1,
    totalRecord: 0,
    SortField: '',
    SortOrder: '',
    // List
    TenAlbumAnh: '',
    MoTa: '',
  };
  public SearchText$ = new BehaviorSubject(null);
  // Table
  public dataTable: DataTable<any> = {
    items: [],
    columns: [] as Columns[],
  };

  constructor(
    private api: ApiService,
    private translate: TranslateService,
  ) {
    // Table config title and field
    this.dataTable.columns = [
      {
        field: 'tenVideo',
        sortField: 'tenVideo',
        title: 'Tên video',
        width: '250px',
      },
      {
        field: 'anhDaiDien',
        sortField: 'anhDaiDien',
        title: 'Ảnh đại diện video',
        width: '150px',
      },
      {
        field: 'ngayTao',
        sortField: 'ngayTao',
        title: 'Ngày tạo',
        width: '100px',
      },
      {
        field: 'tenTrangThai',
        sortField: 'tenTrangThai',
        title: 'Trạng thái',
        width: '100px',
      },
      {
        field: 'ghiChu',
        sortField: 'ghiChu',
        title: 'Ghi chú',
        width: '150px',
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
   // this.getList();
    // Listen input search!
    this.SearchText$.pipe(debounceTime(1000)).subscribe((res: string) => {
      if (res || res === '') {
        this.paginator.TenAlbumAnh = res;
       // this.getList();
      }
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
   // this.getList();
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
    this.api.get('/api/thuvienanh-list', query).subscribe(res => {
      if (res) {
        this.dataTable = { ...this.dataTable, ...res }
        this.paginator = { ...this.paginator, totalRecord: res?.paging?.toTalRecord }
        this.dataTable.items = this.dataTable?.items?.map(m => ({ ...m, expand: false }))
      }
      this.api.loadingCustomOff();
    }, err => {
      this.api.errorMessage(err);
      this.api.loadingCustomOff();
    })
  }

  /**
    * Delete
    * @param id
    */
  public onDelete(id) {
    this.api.delete(`/api/thuvienanh-delete/${id}`)
      .subscribe((res: any) => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: "Xoá ảnh thành công!",
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.getList();
          });
        } else {
          this.api.errorMessage("Xoá ảnh không thành công!");
        }
      }, err => {
        this.api.errorMessage(err);
      });
  }
}
