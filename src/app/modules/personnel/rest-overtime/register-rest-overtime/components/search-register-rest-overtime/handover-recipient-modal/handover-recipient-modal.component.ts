import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { UserPosition } from '../../../../shared/register-rest.model';
import { DataTable, Columns } from 'src/app/_metronic/shared/shared/models/dataTable';

@Component({
  selector: 'app-handover-recipient-modal',
  templateUrl: './handover-recipient-modal.component.html',
  styleUrls: ['./handover-recipient-modal.component.scss'],
  exportAs: 'handover-recipient'
})
export class HandoverRecipientModalComponent implements OnInit {

  public isVisible: boolean = false;

  // Paginator
  public paginator = {
    Keyword: "",
    OrgID: "-1",
    page: 1,
    pageSize: 10,
    totalRecord: 0,
  };
  // Table
  public dataTable: DataTable<any> = {
    items: [],
    columns: [] as Columns[],
    selected: [],
  };
  public SearchText$ = new BehaviorSubject(null);
  @Output() selected = new EventEmitter();
  public recipientSelected: UserPosition;

  constructor(
    private api: ApiService
  ) {
    this.dataTable.columns = [
      {
        field: 'EMPLOYEE_ID',
        title: 'ID',
        width: '60px',
        align: 'left'
      },
      {
        field: 'FULLNAME_VN',
        title: 'Họ tên',
        width: '150px',
      },
      {
        field: 'ORG_NAME',
        title: 'Đơn vị',
        width: '200px',
      },
      {
        field: 'JOB_TITLE_NAME',
        title: 'Vị trí công việc',
        width: '150px',
      },
      {
        field: 'GENDER',
        title: 'Giới tính',
        width: '100px',
      },
      // {
      //   field: 'WORK_STATUS',
      //   title: 'Trạng thái nhân viên',
      //   width: '170px',
      // }
    ];
  }

  ngOnInit(): void {
    this.getList();
    // Listen input search!
    this.SearchText$.pipe(debounceTime(1000)).subscribe((res: string) => {
      if (res || res === '') {
        this.paginator.Keyword = res;
        this.getList();
      }
    })
  }

  public showModal() {
    this.isVisible = true;
  }

  public getList() {
    const query = {
      ...this.paginator,
      Page: this.paginator.page,
      PageSize: this.paginator.pageSize
    }
    delete query.totalRecord;
    const headers = { headers: { 'Accept': 'application/json' } };
    this.api.post('/API/Mobile/GetListPosition', query, headers).subscribe(res => {
      if (res) {
        this.dataTable.items = res?.Items;
        this.paginator = { ...this.paginator, totalRecord: res?.ParameterOutput?.Rowcount }
      }
    })
  }

  public onSelectRow(item, isClear = false) {
    if (isClear) {
      this.recipientSelected = null;
      this.dataTable.items = this.dataTable.items.map(m => ({ ...m, checkbox: false }));
    } else {
      this.recipientSelected = item;
      this.dataTable.items = this.dataTable.items.map(m => m.EMPLOYEE_ID === item.EMPLOYEE_ID ? ({ ...m, checkbox: true }) : ({ ...m, checkbox: false }));
    }
  }
}
