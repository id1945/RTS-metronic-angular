import { AuthService } from 'src/app/modules/auth';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { Columns, DataTable } from 'src/app/_metronic/shared/shared/models/dataTable';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss']
})
export class RequestListComponent implements OnInit {
  // Paginator
  public paginator = {
    pageSize: 20,
    page: 1,
    totalRecord: 0,
    // List
    email: '',
  };
  // Table
  public dataTable: DataTable<any> = {
    items: [],
    columns: [] as Columns[],
  };
  public SearchText$ = new BehaviorSubject(null);

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private cdf: ChangeDetectorRef,
    private translate: TranslateService,
  ) {
    // Table config title and field
    this.dataTable.columns = [
      {
        field: 'id',
        title: this.translate.instant('Số yêu cầu'),
        width: '150px',
      },
      {
        field: 'service_name',
        title: this.translate.instant('Loại yêu cầu'),
        width: '150px',
      },
      {
        field: 'partner_email',
        title: this.translate.instant('Người đề nghị'),
        width: '150px',
      },
      {
        field: 'department_name',
        title: this.translate.instant('Bộ phận'),
        width: '150px',
      },
      {
        field: 'name',
        title: this.translate.instant('Nội dung'),
        width: '150px',
      },
      {
        field: 'start_date',
        title: this.translate.instant('Ngày yêu cầu'),
        width: '150px',
        align: 'center'
      },
      {
        field: 'stage_name',
        title: this.translate.instant('Trạng thái'),
        width: '150px',
        align: 'center'
      },
      // {
      //   field: 'thaoTac',
      //   title: this.translate.instant('Thao tác'),
      //   width: '60px',
      //   align: 'center'
      // }
    ];
  }
  
  
  ngOnInit(): void {
    // Load datatable
    this.paginator.email = this.auth.currentUserValue?.email;
    this.getList();
    // Listen input search!
    this.SearchText$.pipe(debounceTime(1000)).subscribe((res: any) => {
      if (res != null) {
        this.paginator.email = res;
        this.getList();
      }
    });
  }

  public getList() {
    this.api.loadingCustomOn();

    let query = {
      email: this.paginator.email == '' ? 'null' : this.paginator.email,
      page_number: this.paginator.page,
      limit_number: this.paginator?.pageSize,
    };

    this.api.loadingCustomOn();
    this.api.get('/tcm_ticket/get_ticket', query).subscribe(res => {
      if (res) {
        this.paginator = { ...this.paginator, totalRecord: res?.result?.total_record }
        this.dataTable.items = res?.result?.ticket_list
        this.cdf.detectChanges();
      }
      this.api.loadingCustomOff();
    }, err => {
      this.api.loadingCustomOff();
    })
  }

}
