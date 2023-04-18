import { TranslateService } from '@ngx-translate/core';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import swal from 'sweetalert';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';

@Component({
  selector: 'app-agencypolicy-detail',
  templateUrl: './agencypolicy-detail.component.html',
  styleUrls: ['./agencypolicy-detail.component.scss']
})
export class AgencyPolicyDetailComponent implements OnInit {

  public isCollapsedDocs = false;
  public ListVanBan: any[];
  public dataDetail: any;
  public urlPdf: string;

  constructor(
    private router: Router,
    private api: ApiService,
    private aRoute: ActivatedRoute,
    private cdf: ChangeDetectorRef,
    private translate: TranslateService,
  ) {
    this.aRoute.params.subscribe(param => {
      this.getDetail(param.id);
    })
  }

  ngOnInit(): void {
  }

  public getDetail(id) {
    this.api.get('/api/chinhsach-daily-detail', { chinhSachDaiLyId: id }).subscribe(res => {
      if (res) {
        this.dataDetail = res;
        this.previewPdf(res.dinhKems[0]);
      }
    });
  }



  public previewPdf(item: { chinhSachDaiLyId: number, urlPreview: string }) {
    const options = {
      observe: 'response',
      responseType: 'blob' as 'json',
    };
    this.api.get(item.urlPreview, "", options).subscribe(res => {
      if (res) {
        /* Get blob */
        const blob = new Blob([res.body], { type: 'application/pdf' });
        this.urlPdf = window.URL.createObjectURL(blob);
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }

  public convertDate(d) {
    return new Date(d * 1000)
  }

}
