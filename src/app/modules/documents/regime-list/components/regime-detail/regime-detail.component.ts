import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { VanBanDinhChe } from '../../models/van-ban-dinh-che.model';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';

@Component({
  selector: 'app-regime-detail',
  templateUrl: './regime-detail.component.html',
  styleUrls: ['./regime-detail.component.scss']
})
export class RegimeDetailComponent implements OnInit {

  public isCollapsedDocs = false;
  public ListVanBan: any[];
  public dataDetail: VanBanDinhChe;
  public urlPdf: string;

  constructor(
    private router: Router,
    private api: ApiService,
    private aRoute: ActivatedRoute,
    private cdf: ChangeDetectorRef,
  ) {
    this.aRoute.params.subscribe(param => {
      this.getDetail(param.id);
      this.getListVanBan();
    })
  }

  ngOnInit(): void {
  }

  public getDetail(id) {
    this.api.get('/api/vanban-dinhche-detail', { vanBanDinhCheId: id }).subscribe(res => {
      if (res) {
        this.dataDetail = res;
        this.previewPdf(res.attachments[0]);
      }
    });
  }

  public getListVanBan() {
    this.api.get('/api/trangchu/van-ban')
      .subscribe((res: any) => {
        if (res) {
          this.ListVanBan = res?.items;
          this.cdf.detectChanges();
        }
      })
  }

  public previewPdf(item: { taiLieuId: number, tenFile: string }) {
    const options = {
      observe: 'response',
      responseType: 'blob' as 'json',
    };
    this.api.get('/api/vanban-dinhche-misc/xem-tai-lieu', { taiLieuId: item.taiLieuId }, options).subscribe(res => {
      if (res) {
        /* Get blob */
        const blob = new Blob([res.body], { type: 'application/pdf' });
        this.urlPdf = window.URL.createObjectURL(blob);
      }
    }, err => this.api.errorMessage(err));
  }

  public showChiTietVanBanDinhChe(Id) {
    this.router.navigateByUrl(`/contacts/institutional-detail/${Id}`);
  }

}
