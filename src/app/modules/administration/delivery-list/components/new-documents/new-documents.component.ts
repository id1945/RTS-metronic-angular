import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';

@Component({
  selector: 'app-new-documents',
  templateUrl: './new-documents.component.html',
  styleUrls: ['./new-documents.component.scss']
})
export class NewDocumentsComponent implements OnInit {

  public dataTable: any;

  constructor(
    public api: ApiService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getList();
  }

  public getList() {
    const query = {
      page: 1,
      ItemsPerPage: 20,
      TrangThaiKey: 1
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
