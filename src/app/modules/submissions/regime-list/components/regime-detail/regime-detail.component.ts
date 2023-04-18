import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../../auth';
import { ActivatedRoute, Params } from '@angular/router';
import swal from 'sweetalert';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { TranslateService } from '@ngx-translate/core';
import { ApproveRegimeModalComponent } from './approve-regime-modal/approve-regime-modal.component';

@Component({
  selector: 'app-regime-detail',
  templateUrl: './regime-detail.component.html',
  styleUrls: ['./regime-detail.component.scss']
})
export class RegimeDetailComponent implements OnInit {

  @ViewChild('appApproveModal', { static: false }) appApproveModal: ApproveRegimeModalComponent;

  public today = new Date();
  public dataDetail: any;
  public params: Params;
  public tenNguoiPheDuyet: string;
  public currentHoSoId: number;
  public urlPdf: string;

  constructor(
    public api: ApiService,
    private userService: AuthService,
    private aRoute: ActivatedRoute,
    private cdf: ChangeDetectorRef,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.aRoute.params.subscribe(params => {
      if (params) {
        this.params = params;
        this.currentHoSoId = params?.hoSoId;
        this.getDetail(params?.hoSoId);
      }
    })
  }

  public getDetail(hoSoId: number) {
    this.api.get('/api/hoso-vanbandinhche-detail', { hoSoId: hoSoId }).subscribe(res => {
      if (res) {
        this.dataDetail = res;
        this.previewPdf(res.dinhKem.items[0]);
        this.cdf.detectChanges();
      }
    });
    this.tenNguoiPheDuyet = this.userService.currentUserValue.hoTen;
  }

  public downloadFile(fileName: string, hoSoGiayToId: number) {
    const header = {
      observe: 'response',
      responseType: 'blob' as 'json',
    };
    this.api.get('/api/totrinh-duyetchi-misc/tai-lieu-goc', { hoSoGiayToId: hoSoGiayToId }, header).subscribe(res => {
      if (res) {
        this.api.downloadFileFromBlob(res);
      }
    }, err => {
      // Message error
      this.api.errorMessage(err);
    });
  }

  get timeLine() {
    return this.dataDetail?.lichSuPheDuyet?.items?.map(m => ({
      ghiChu: m?.noiDung,
      tinhTrang: m?.tinhTrang,
      ngayDuyetNum: m?.ngayDuyet,
      nguoiDuyet: m?.nguoiDuyet,
      tenTrangThai: m?.tenTrangThai,
      tinhTrangKey: m?.tinhTrangKey,
      tenBuocThucHien: m?.tenBuocThucHien,
    }))
  }

  public previewPdf(item: { taiLieuId: number, urlPreview: string }) {
    const options = {
      observe: 'response',
      responseType: 'blob' as 'json',
    };
    this.api.get(item.urlPreview, null, options).subscribe(res => {
      if (res) {
        /* Get blob */
        const blob = new Blob([res.body], { type: 'application/pdf' });
        this.urlPdf = window.URL.createObjectURL(blob);
      }
    }, err => this.api.errorMessage(err));
  }

}
