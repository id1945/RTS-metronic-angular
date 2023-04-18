import { ApiService } from 'src/app/_metronic/shared/http/api.service'
import { Component, OnInit } from '@angular/core'
import { years } from 'src/app/_metronic/shared/shared/common/helper'
import { Options } from 'src/app/_metronic/shared/shared/models/options'
import { switchMap } from 'rxjs/operators'
import { of } from 'rxjs'

const HEADER_ACCEPT = { headers: { 'Accept': 'application/json' } };

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss']
})
export class SalaryComponent implements OnInit {

  // Search
  public yearsOptions: Options[] = years(5,0).map(m => ({ label: `Năm ${m}`, value: m.toString() }));
  public yearSelected = new Date().getFullYear().toString();
  public monthsStepOptions: Options[] = [];
  public salaryInfo: any;

  constructor(
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.getPeriod(this.yearSelected);
  }

  public getPeriod(fullYear: string): void {
    const bodyParam = {
      Year: fullYear,
      Page: 1,
      PageSize: 10
    }
    this.api.post('/API/Mobile/Period', bodyParam, HEADER_ACCEPT)
    .pipe(switchMap(s => of(s?.Items?.map((m: any) => ({ value: m?.ID, label: m?.NAME })))))
    .subscribe(res => {
      if (res) {
        this.monthsStepOptions = res;
      }
    })
  }

  public getSalary(period: string): void {
    this.api.post('/API/Mobile/GetSalarys', { Period: period }, HEADER_ACCEPT).subscribe(res => {
      if (res?.ResponseStatus === 1) {
        this.salaryInfo = res?.Items?.lenght && res?.Items[0];
      } else {
        this.api.errorMessage(res?.Message);
      }
    }, err => this.api.errorMessage(err));
  }

}
