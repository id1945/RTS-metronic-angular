import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { MissionDetail } from '../models/mission-detail.model';
import { ApproveMissionModalComponent } from './approve-mission-modal/approve-mission-modal.component';
import swal from 'sweetalert';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-mission-detail',
  templateUrl: './mission-detail.component.html',
  styleUrls: ['./mission-detail.component.scss']
})
export class MissionDetailComponent implements OnInit {

  @ViewChild('appApproveModal', { static: false }) appApproveModal: ApproveMissionModalComponent;

  public today = new Date();
  public dataDetail: MissionDetail;
  public tenNguoiPheDuyet: string;
  public params: any;
  public chiPhiCongTacKey = ['phiAnSang', 'phiAnTrua', 'phiAnToi', 'phiSinhHoat', 'phiKhachSan', 'phiVanChuyen'];

  constructor(
    public api: ApiService,
    private aRoute: ActivatedRoute,
    private translate: TranslateService,
    private cdf: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.aRoute.params.subscribe(params => {
      if (params) {
        this.params = params;
        this.getDetail()
      }
    })
  }

  public getDetail() {
    this.api.get('/api/dieudong-congtac-detail', { HoSoId: this.params?.hoSoId }).subscribe(res => {
      if (res) {
        this.dataDetail = res;
        this.today = new Date(res?.ngayTao * 1000);
      }
    }, err => this.api.errorMessage(err));
  }

  public onExportExcel(HoSoId) {
    const query = { HoSoId: HoSoId };
    const header = {
      observe: 'response',
      responseType: 'blob' as 'json',
    };
    this.api.get('/api/dieudong-congtac-detail/export-excel', query, header).subscribe((res) => {
      if (res) {
        this.api.downloadFileFromBlob(res);
      }
    }, err => this.api.errorMessage(err));
  }

  public thanhTienTamTinh(item) {
    const soTien = this.chiPhiCongTacKey?.map(m => (item[m]?.thanhTien ?? 0));
    return soTien?.reduce((tien, total) => tien ? tien + total : total) ?? 0;
  }

  public onSubmitApprove(dataDetail) {

    const bodyParams = {
      hoSoId: dataDetail?.hoSoId,
    };

    const url = '/api/dieudong-congtac-create/trinh-duyet' ;

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

  get timeLine() {
    return this.dataDetail?.lichSuPheDuyet?.items?.map(m => ({
      ghiChu: m?.noiDung,
      tinhTrang: m?.tinhTrang,
      ngayDuyetNum: m?.ngayDuyet,
      nguoiDuyet: m?.nguoiDuyet,
      tenTrangThai: m?.tenTrangThai,
      tinhTrangKey: m?.tinhTrangKey,
      tenBuocThucHien: m?.tenBuocThucHien,
      nguoiDuyets: m?.nguoiDuyets,
    }))
  }
}
