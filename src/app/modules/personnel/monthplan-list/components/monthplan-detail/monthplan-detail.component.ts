import { Component, OnInit, ViewChild, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/modules/auth';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { ApproveMonthPlanModalComponent } from './approve-monthplan-modal/approve-monthplan-modal.component';
@Component({
  selector: 'app-monthplan-detail',
  templateUrl: './monthplan-detail.component.html',
  styleUrls: ['./monthplan-detail.component.scss']
})
export class MonthPlanDetailComponent implements OnInit {

  @ViewChild('appApproveModal', { static: false }) appApproveModal: ApproveMonthPlanModalComponent;

  @Output() loadTimeLine = new EventEmitter();
  
  public today = new Date();
  public dataDetail: any;
  public tenNguoiPheDuyet: string;
  public params: any;

  constructor(
    public api: ApiService,
    private auth: AuthService,
    private aRoute: ActivatedRoute,
    private cdf: ChangeDetectorRef,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.aRoute.params.subscribe(params => {
      if (params) {
        this.params = params;
        this.getDetail()
      }
    })
  }

  public onSubmitApprove(dataDetail) {

    const bodyParams = {
      hoSoId: dataDetail?.hoSoId,
    };

    const url = '/api/kehoach-congtac-create/trinh-duyet' ;

    this.api.loadingCustomOn();
    this.api.post(url, bodyParams).subscribe(res => {
      if (res?.isSuccess) {
        swal({
          icon: 'success',
          title: "Bạn đã trình duyệt thành công !",
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.close();
          this.getDetail();
        });
      } else {
        this.api.errorMessage("Bạn đã trình duyệt không thành công !");
      }
      this.api.loadingCustomOff();
    }, err => {
      this.api.errorMessage(err);
      this.api.loadingCustomOff();
    });
  }

  public getDetail() {
    this.api.get('/api/kehoach-congtac-detail', { HoSoId: this.params?.hoSoId }).subscribe(res => {
      if (res) {
        this.dataDetail = res;
        this.today = new Date(res?.ngayTao * 1000);
        this.cdf.detectChanges();
      }
    })
  }

  public downloadFile(urlDownload: string) {
    const header = {
      observe: 'response',
      responseType: 'blob' as 'json',
    };
    this.api.get(urlDownload,'', header).subscribe(res => {
      if (res) {
        this.api.downloadFileFromBlob(res);
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }

  private close() {
    this.loadTimeLine.emit();
    this.cdf.detectChanges();
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
      nguoiDuyets:m?.nguoiDuyets,
    }))


    
  }
}
