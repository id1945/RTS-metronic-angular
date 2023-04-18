import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { years } from 'src/app/_metronic/shared/shared/common/helper';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { DatePipe } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
const HEADER_ACCEPT = { headers: { 'Accept': 'application/json' } };
import { DataTable, Columns } from 'src/app/_metronic/shared/shared/models/dataTable';

@Component({
  selector: 'app-explanation',
  templateUrl: './explanation.component.html',
  styleUrls: ['./explanation.component.scss']
})
export class ExplanationComponent implements OnInit {
  // Query
  public paginator = {
    FromDate: null,
    ToDate: null,
    pageSize: 20,
    page: 1,
    totalRecord: 0
  };
  // Table
  public dataTable: DataTable<any> = {
    items: [],
    columns: [] as Columns[],
  };
  // Search
  public yearsOptions: Options[] = years(5,0).map(m => ({ label: `Năm ${m}`, value: m.toString() }));
  public monthsStepOptions: Options[] = [];
  public yearSelected = new Date().getFullYear().toString();
  public monthSelected: string;

  constructor(
    private api: ApiService,
    public datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.dataTable.columns = [
      {
        field: 'ID',
        sortField: 'ID',
        title: 'ID công giải trình',
        width: '140px',
      },
      {
        field: 'WORKINGDAY',
        sortField: 'WORKINGDAY',
        title: 'Ngày giải trình',
        width: '130px',
        pipe: 'dd/MM/yyyy'
      },
      {
        field: 'SHIFT_CODE',
        sortField: 'SHIFT_CODE',
        title: 'Ca làm việc',
        width: '130px',
      },
      {
        field: 'VALIN1',
        sortField: 'VALIN1',
        title: 'Quẹt 1',
        width: '80px',
        pipe: 'HH:mm'
      },
      {
        field: 'VALIN4',
        sortField: 'VALIN4',
        title: 'Quẹt 4',
        width: '80px',
        pipe: 'HH:mm'
      },
      {
        field: 'FROM_HOUR',
        sortField: 'FROM_HOUR',
        title: 'Giờ GT vào',
        width: '80px',
        pipe: 'HH:mm'
      },
      {
        field: 'TO_HOUR',
        sortField: 'TO_HOUR',
        title: 'Giờ GT ra',
        width: '80px',
        pipe: 'HH:mm'
      },
      {
        field: 'TYPE_ERROR',
        sortField: 'TYPE_ERROR',
        title: 'Loại vi phạm',
        width: '130px',
      },
      {
        field: 'STATUS_NAME',
        sortField: 'STATUS_NAME',
        title: 'Trạng thái',
        width: '150px',
      },
      {
        field: 'MANUAL_CODE',
        sortField: 'MANUAL_CODE',
        title: 'Công giải trình',
        width: '170px',
      },
      {
        field: 'REASON_TYPE',
        sortField: 'REASON_TYPE',
        title: 'Loại lý do',
        width: '170px',
      },
      {
        field: 'NOTE',
        sortField: 'NOTE',
        title: 'Lý do',
        width: '170px',
      }
    ];
    this.getMonths(new Date().toISOString());
  }

  public getMonths(date: string): void {
    const bodyParam = {
      Year: new Date(date).getFullYear().toString(),
      Page: 1,
      PageSize: 10
    }
    this.api.post('/API/Mobile/Period', bodyParam, HEADER_ACCEPT)
      .pipe(switchMap(s => of(s?.Items?.map((m: any) => ({ value: m?.ID, label: m?.NAME, startDate: m?.STARTDATE, endDate: m?.ENDDATE })))))
      .subscribe(res => {
        if (res) {
          this.monthsStepOptions = res;
          if (this.monthsStepOptions?.length) {
            this.monthSelected = this.monthsStepOptions[0].value;

            // Init load list
            this.paginator.FromDate = this.datepipe.transform(this.monthsStepOptions[0]?.startDate, 'yyyy-MM-dd');
            this.paginator.ToDate = this.datepipe.transform(this.monthsStepOptions[0]?.endDate, 'yyyy-MM-dd');
            this.getFormToDate(this.monthSelected);
          }
        }
      })
  }

  public getFormToDate(id: string) {
    const day = this.monthsStepOptions.find(f => f.value === id);
    if (day) {
      this.paginator = { ...this.paginator, FromDate: day?.startDate, ToDate: day?.endDate };
      this.getList();
    }
  }

  public getList(): void {
    const bodyParams = {
      Status: "0,1,2,3",
      Page: this.paginator?.page,
      PageSize: this.paginator?.pageSize,
      ToDate: this.paginator.ToDate,
      FromDate: this.paginator.FromDate,
    };
    this.api.post('/API/Mobile/SearchTimeExplain', bodyParams, HEADER_ACCEPT).subscribe(res => {
      if (res) {
        this.dataTable.items = res?.Items?.map(m => m);
        this.paginator = { ...this.paginator, totalRecord: res?.ParameterOutput?.Rowcount };
      }
    });
  }
}
