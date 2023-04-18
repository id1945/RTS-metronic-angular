import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RegisterRestService {

  public date = new Date();

  // Init search
  public searchParams$ = new BehaviorSubject({
    Status: '-1',
    FromDate: this.datepipe.transform(new Date(this.date.getFullYear(), this.date.getMonth() - 1, 20), 'yyyy-MM-dd'),
    ToDate: this.datepipe.transform(new Date(this.date.getFullYear(), this.date.getMonth() + 1, 10), 'yyyy-MM-dd'),
    Page: 1,
    PageSize: 50,
    All: '0'
  });

  constructor(public datepipe: DatePipe) { }
}
