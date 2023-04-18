import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { Router } from '@angular/router';
import { distinctUntilChanged, switchMap, debounceTime } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.scss']
})
export class ContactsListComponent implements OnInit {
  // Paginator
  public paginator = {
    pageSize: 12,
    page: 1,
    totalRecord: 0,
    // List
    searchText: '',
    phongBanKey: '',
  };
  // Table
  public dataTable: any[] = [];
  public phongBan: any[] = [];
  public selectphongBan: any;

  public search$ = new BehaviorSubject(null);

  constructor(
    private router: Router,
    public api: ApiService,
    private cdf: ChangeDetectorRef,
    private translate: TranslateService,
  ) { }

  
  ngOnInit(): void {
    this.getList();
    this.getPhongBanOptions();
    // Listen input search!
    this.search$.pipe(debounceTime(1000), distinctUntilChanged()).subscribe((res: string) => {
      if (res || res === '') {
        this.paginator.searchText = res;
        this.getList();
      }
    })
  }

  getList() {
    this.api.loadingCustomOn();
    const query = {
      ...this.paginator,
      page: this.paginator.page,
      items_per_page: this.paginator.pageSize,
    }
    if (!this.paginator.searchText) {
      delete query.searchText;
    }
    if (!this.paginator.phongBanKey) {
      delete query.phongBanKey;
    }
    delete query.pageSize;
    delete query.totalRecord;
    this.api.get('/api/danhba-list', query)
      .pipe(switchMap(mm => of({ items: mm['items']?.map(m => m?.items)?.flat(1) ?? mm, paging: mm['paging'] })))
      .subscribe(res => {
        if (res) {
          this.dataTable = res?.items;
          this.paginator = { ...this.paginator, totalRecord: res?.paging?.toTalRecord }
          this.cdf.detectChanges();
        }
        this.api.loadingCustomOff();
      }, () => this.api.loadingCustomOn())
  }

  public getPhongBanOptions() {
    this.api.get('/api/danhba-danhmuc/phong-ban')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.phongBanKey, label: m.phongBanDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.phongBan = res;
          this.cdf.detectChanges();
        }
      })
  }

  public showPersonal(Id) {
    this.router.navigateByUrl(`/contacts/personal-information/${Id}`);
  }
}
