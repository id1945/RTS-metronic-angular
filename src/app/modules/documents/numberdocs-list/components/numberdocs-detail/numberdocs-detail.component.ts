import { TranslateService } from '@ngx-translate/core';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import swal from 'sweetalert';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { ApproveNumberdocsModalComponent } from '../approve-numberdocs-modal/approve-numberdocs-modal.component';

@Component({
  selector: 'app-numberdocs-detail',
  templateUrl: './numberdocs-detail.component.html',
  styleUrls: ['./numberdocs-detail.component.scss']
})
export class NumberdocsDetailComponent implements OnInit {

  @ViewChild('appApproveModal', { static: false }) appApproveModal: ApproveNumberdocsModalComponent;

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
      this.getDetail(param.laySoVanBanId);
      this.getListVanBan();
    })
  }

  ngOnInit(): void {
  }

  public getDetail(laySoVanBanId) {
    this.api.get('/api/lay-so-vanban-detail', { laySoVanBanId: laySoVanBanId }).subscribe(res => {
      if (res) {
        this.dataDetail = res;
        this.previewPdf(res?.attachment?.items[0]);
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
    this.api.get('/api/lay-so-vanban-misc/xem-tai-lieu', { taiLieuId: item.taiLieuId }, options).subscribe(res => {
      if (res) {
        /* Get blob */
        const blob = new Blob([res.body], { type: 'application/pdf' });
        this.urlPdf = window.URL.createObjectURL(blob);
      }
    }, err => this.api.errorMessage(err));
  }

  public convertDate(d) {
    return new Date(d * 1000)
  }

  public showChiTietVanBanDinhChe(Id) {
    this.router.navigateByUrl(`/contacts/institutional-detail/${Id}`);
  }

  public onApprove(isApprove) {
    const url = isApprove == 1 ? '/api/lay-so-vanban-create/phe-duyet' : '/api/lay-so-vanban-create/tu-choi';
    const bodyParams = {
      LaySoVanBanId: this.dataDetail?.laySoVanBanId,
      NoiDung: " "
    }
    // POST
    this.api.post(url, bodyParams).subscribe(res => {
      if (res?.isSuccess) {
        swal({
          icon: "success",
          title: isApprove == 1 ? "Phê duyệt yêu cầu thành công!" : "Từ chối yêu cầu thành công!",
          buttons: {
            ok: "Đóng"
          },
        } as any).then(() => {
          this.cdf.detectChanges();
        });
        this.getDetail(this.dataDetail?.laySoVanBanId);
      } else {
        this.api.errorMessage(null)
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }
}
