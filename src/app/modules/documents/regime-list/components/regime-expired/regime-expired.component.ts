import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';

@Component({
  selector: 'app-regime-expired',
  templateUrl: './regime-expired.component.html',
  styleUrls: ['./regime-expired.component.scss']
})
export class RegimeExpiredComponent implements OnInit {

  public dataTable: any;

  constructor(
    public api: ApiService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getList();
  }

  public getList() {
    this.api.loadingCustomOn();
    const query = {
      page: 1,
      ItemsPerPage: 20,
      TrangThaiKey: 2
    }
    this.api.get('/api/vanban-dinhche-list', query).subscribe(res => {
      if (res) {
        this.dataTable = res;
      }
      this.api.loadingCustomOff();
    }, () => this.api.loadingCustomOff())
  }

  public showChiTietVanBanDinhChe(Id) {
    this.router.navigateByUrl(`/documents/regime-detail/${Id}`);
  }
}
