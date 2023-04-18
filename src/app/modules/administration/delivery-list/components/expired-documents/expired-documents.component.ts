import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';

@Component({
  selector: 'app-expired-documents',
  templateUrl: './expired-documents.component.html',
  styleUrls: ['./expired-documents.component.scss']
})
export class ExpiredDocumentsComponent implements OnInit {

  public dataTable: any;

  constructor(
    public api: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getList();
  }

  public getList() {
    const query = {
      page: 1,
      ItemsPerPage: 20,
      TrangThaiKey: 2
    }
    this.api.get('/api/vanban-dinhche-list', query).subscribe(res => {
      if (res) {
        this.dataTable = res;
      }
    })
  }
  showChiTietVanBanDinhChe(Id) {
    this.router.navigateByUrl(`/contacts/institutional-detail/${Id}` );
  }

}
