import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';

@Component({
  selector: 'app-regime-new',
  templateUrl: './regime-new.component.html',
  styleUrls: ['./regime-new.component.scss']
})
export class RegimeNewComponent implements OnInit {

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
      TrangThaiKey: 1
    }
    this.api.get('/api/vanban-dinhche-list', query).subscribe(res => {
      if (res) {
        this.dataTable = res;
      }
      this.api.loadingCustomOff();
    }, () => this.api.loadingCustomOff())
  }

  showChiTietVanBanDinhChe(Id) {
    this.router.navigateByUrl(`/documents/regime-detail/${Id}`);
  }
}
