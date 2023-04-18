import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { firstAndLastDayOfMonth } from 'src/app/_metronic/shared/shared/common/helper';
import { DatePipe } from '@angular/common';
import { Params } from '@angular/router';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { PER_SCREEN } from '../../../shared/constant';
const HEADER_ACCEPT = { headers: { 'Accept': 'application/json' } };


@Component({
  selector: 'app-search-approve-rest-overtime',
  templateUrl: './search-approve-rest-overtime.component.html',
  styleUrls: ['./search-approve-rest-overtime.component.scss']
})
export class SearchApproveRestOvertimeComponent implements OnInit, OnChanges {

  public isSearchAdvance = false;
  public SearchText$ = new BehaviorSubject(null);
  public PER_SCREEN = PER_SCREEN;

  @Input() params: Params;
  @Output() search = new EventEmitter();

  public paginator = {
    Type: '-1',
    KeyEmployee: '',
    FromDate: this.datepipe.transform(firstAndLastDayOfMonth(new Date().getFullYear().toString(), (new Date().getMonth() + 1).toString()).firstDate, 'yyyy-MM-dd'),
    ToDate: this.datepipe.transform(firstAndLastDayOfMonth(new Date().getFullYear().toString(), (new Date().getMonth() + 2).toString()).lastDate, 'yyyy-MM-dd')
  };

  public holidayTypeOptions: Options[] = [];
  public typeWLEOOptions: Options[] = [];

  constructor(
    private api: ApiService,
    private datepipe: DatePipe,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => this.emit(), 100);
  }

  ngOnInit(): void {
    // Listen input search!
    this.SearchText$.pipe(debounceTime(1000)).subscribe((res: string) => {
      if (res || res === '') {
        this.paginator.KeyEmployee = res;
        this.emit();
      }
    })
    // Init
    this.emit();
    // Load options
    this.fetchTypeWLEO();
    this.fetchTypeLeave();
  }

  public emit() {
    this.search.emit({
      ...this.paginator,
      Type: !this.paginator.Type ? '-1' : this.paginator.Type,
      ToDate: this.datepipe.transform(this.paginator?.ToDate, 'yyyy-MM-dd'),
      FromDate: this.datepipe.transform(this.paginator?.FromDate, 'yyyy-MM-dd'),
    });
  }

  private fetchTypeLeave() {
    this.api.post('/API/Mobile/TypeLeave', {}, HEADER_ACCEPT)
      .pipe(switchMap(s => of(s?.Items?.map((m: any) => ({ value: m?.ID?.toString(), label: m?.MANUALLEAVE })))))
      .subscribe(res => {
        if (res) {
          this.holidayTypeOptions = res;
        }
      })
  }

  private fetchTypeWLEO() {
    this.api.post('/API/Mobile/TypeWLEO', {}, HEADER_ACCEPT)
      .pipe(switchMap(s => of(s?.Items?.map((m: any) => ({ value: m?.ID?.toString(), label: m?.NAME })))))
      .subscribe(res => {
        if (res) {
          this.typeWLEOOptions = res;
        }
      })
  }
}

