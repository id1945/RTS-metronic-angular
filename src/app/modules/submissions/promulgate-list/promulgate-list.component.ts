import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { DataTable, Columns } from 'src/app/_metronic/shared/shared/models/dataTable';

@Component({
  selector: 'app-promulgate-list',
  templateUrl: './promulgate-list.component.html',
  styleUrls: ['./promulgate-list.component.scss']
})
export class PromulgateListComponent implements OnInit {
  // Paginator
  public paginator = {
    pageSize: 20,
    page: 1,
    totalRecord: 0,
    SortField: 'ngayBanHanh',
    SortOrder: 'desc',
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

  public statusOptions: any[] = [];
  public selectStatusOptions: any;

  constructor(
    private router: Router,
    private api: ApiService,
    private cdf: ChangeDetectorRef,
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
        field: 'tenNguoiBanHanh',
        sortField: 'tenNguoiBanHanh',
        title: 'Tên người ban hành',
        width: '200px',
      },
      {
        field: 'ngayBanHanh',
        sortField: 'ngayBanHanh',
        title: 'Ngày ban hành',
        width: '150px',
      },
      {
        field: 'tenTrangThai',
        sortField: 'tenTrangThai',
        title: 'Trạng thái',
        width: '150px',
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

    this.api.get('/api/banhanh-list', query).subscribe(res => {
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

  public showDetail(item) {
    this.router.navigate(['submissions', 'detail', item?.hoSoId]);
  }
}
