import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from 'src/app/modules/auth';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import serialize from '@octetstream/object-to-form-data';
import swal from 'sweetalert';
import { ApproveRequestsPaymentModalComponent } from './components/approve-requests-payment-modal/approve-requests-payment-modal.component';
import { SelectedFiles } from 'src/app/_metronic/shared/shared/services/files.service';
import { ConfirmInputBasicComponent } from 'src/app/_metronic/shared/shared/components/confirm-input-basic/confirm-input-basic.component';
import { ConfirmInputFileComponent } from 'src/app/_metronic/shared/shared/components/confirm-input-file/confirm-input-file.component';
import { RequestsPaymentDetail, ThongTinNganSachTTTU } from '../../models/request-payment.model';
import { Columns, DataTable } from 'src/app/_metronic/shared/shared/models/dataTable';
import { TranslateService } from '@ngx-translate/core';
import { BasicContentModalComponent } from 'src/app/_metronic/shared/shared/components/basic-content-modal/basic-content-modal.component';

@Component({
  selector: 'app-detail-requests-payment',
  templateUrl: './detail-requests-payment.component.html',
  styleUrls: ['./detail-requests-payment.component.scss']
})
export class DetailRequestsPaymentComponent implements OnInit {

  @ViewChild('approveModalComponent') approveModalComponent: ApproveRequestsPaymentModalComponent;
  @ViewChild('confirmInputBasic') confirmInputBasic: ConfirmInputBasicComponent;
  @ViewChild('confirmInputFile') confirmInputFile: ConfirmInputFileComponent;
  @ViewChild('basicContent', { static: false }) basicContent: BasicContentModalComponent;

  public dataDetail: RequestsPaymentDetail;
  public tenNguoiPheDuyet: string;
  public params: Params;

  // Table
  public dataTable: DataTable<ThongTinNganSachTTTU> = {
    items: [],
    columns: [] as Columns[],
    selected: [],
  };

  constructor(
    public api: ApiService,
    private userService: AuthService,
    private aRoute: ActivatedRoute,
    private cdf: ChangeDetectorRef,
    private translate: TranslateService,
  ) {
    // Table config title and field
    this.dataTable.columns = [
      {
        field: 'stt',
        title: this.translate.instant('STT'),
        width: '50',
      },
      {
        field: 'DepartmentCode',
        title: this.translate.instant('Mã bộ phận'),
        width: '100px',
      },
      {
        field: 'DepartmentName',
        title: this.translate.instant('Tên bộ phận'),
        width: '150px',
      },
      {
        field: 'BudgetName',
        title: this.translate.instant('Mã ngân sách'),
        width: '250px',
      },
      {
        field: 'Month',
        title: this.translate.instant('Tháng'),
        width: '80px',
        align: 'center'
      },
      {
        field: 'Period',
        title: this.translate.instant('Kỳ kiểm soát'),
        width: '150px',
      },
      // {
      //   field: 'SavingsRatio',
      //   title: this.translate.instant('Hệ số tiết kiệm'),
      //   width: '130px',
      //   align: 'center'
      // },
      {
        field: 'DeparmentBudget',
        title: this.translate.instant('Ngân sách bộ phận cả năm'),
        width: '150px',
        align: 'right'
      },
      {
        field: 'FullYearBudget',
        title: this.translate.instant('Mã ngân sách cả năm'),
        width: '150px',
        align: 'right'
      },
      {
        field: 'PercentBudgetOfAll',
        title: this.translate.instant('Tỷ trọng'),
        width: '150px',
        align: 'center'
      },
      {
        field: 'BudgetToUse',
        title: this.translate.instant('Ngân sách trong kỳ'),
        width: '150px',
        align: 'right'
      },
      {
        field: 'UsedBudget',
        title: this.translate.instant('Đã sử dụng'),
        width: '150px',
        align: 'right'
      },
      {
        field: 'RemainingBudget',
        title: this.translate.instant('Còn lại'),
        width: '150px',
        align: 'right'
      }
    ];
  }

  ngOnInit(): void {
    this.aRoute.params.subscribe(params => {
      if (params) {
        this.params = params;
        this.getDetail()
      }
    })
  }

  public getDetail() {
    this.tenNguoiPheDuyet = this.userService.currentUserValue.hoTen;
    this.api.loadingCustomOn();
    this.api.get('/api/denghi-thanhtoan-daily-detail', { hoSoId: this.params?.hoSoId }).subscribe(res => {
      if (res) {
        this.dataDetail = res;
        this.cdf.detectChanges();
      }
      this.api.loadingCustomOff();
    }, er => this.api.loadingCustomOff());
  }

  public xacNhanUuTien(item: any) {
    const url = '/api/denghi-thanhtoan-daily-update/thanhtoan-uutien';
    const bodyParams = {
      hoSoId: item?.hoSoId
    }
    // PUT
    this.api.put(url, bodyParams).subscribe(res => {
      if (res?.isSuccess) {
        swal({
          icon: "success",
          title: "Bạn đã xác nhận Thanh toán ưu tiên thành công!",
          buttons: {
            ok: "Đóng"
          },
        } as any).then(() => {
          this.getDetail();
        });
      } else {
        this.api.errorMessage(null)
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }

  public downloadFile(hoSoGiayToId: string, fileName: string) {
    const header = {
      observe: 'response',
      responseType: 'blob' as 'json',
    };
    this.api.get('/api/denghi-thanhtoan-daily-misc/tai-lieu-goc', { hoSoGiayToId: hoSoGiayToId }, header).subscribe(res => {
      if (res) {
        this.api.downloadFileFromBlob(res);
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }

  /**
   * Get total Số tiền
   */

  get totalSoTienCoCT() {
    return {
      vnd: this.dataDetail?.chiTietThanhToan?.items?.reduce(function (total, current) { return Number(total) + Number(current?.soTienCoCTVN || 0) }, 0) || 0,
      eur: this.dataDetail?.chiTietThanhToan?.items?.reduce(function (total, current) { return Number(total) + Number(current?.soTienCoCTNT || 0) }, 0) || 0,
    }
  }

  get totalSoTienKhongCoCT() {
    return {
      vnd: this.dataDetail?.chiTietThanhToan?.items?.reduce(function (total, current) { return Number(total) + Number(current?.soTienKhongCTVN || 0) }, 0) || 0,
      eur: this.dataDetail?.chiTietThanhToan?.items?.reduce(function (total, current) { return Number(total) + Number(current?.soTienKhongCTNT || 0) }, 0) || 0,
    }
  }

  get totalSoTien() {
    return {
      vnd: this.totalSoTienCoCT?.vnd + this.totalSoTienKhongCoCT?.vnd,
      eur: this.totalSoTienCoCT?.eur + this.totalSoTienKhongCoCT?.eur,
    }
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
      dinhKem: m?.dinhKem,
      nguoiDuyets: m?.nguoiDuyets,
    }))
  }

  public onPrint(hoSoId: number) {
    const header = {
      observe: 'response',
      responseType: 'blob' as 'json',
    };
    this.api.get('/api/denghi-thanhtoan-daily-detail/print', { HoSoId: hoSoId }, header).subscribe(res => {
      this.api.downloadFileFromBlob(res);
    }, err => {
      this.api.errorMessage(err);
    });
  }

  /**
   * Yêu cầu bổ sung chứng từ
   * @param data 
   */
  public onYCBoSung(data: { meta: null, content: '' }) {
    const formData = serialize({
      HoSoId: data?.meta ?? '',
      LyDo: data?.content ?? ''
    });
    // POST
    this.api.post('/api/denghi-thanhtoan-daily-create/yeu-cau-bo-sung-chung-tu', formData).subscribe(res => {
      if (res?.isSuccess) {
        swal({
          icon: "success",
          title: "Yêu cầu bổ sung chứng từ thành công.",
          buttons: {
            ok: "Đóng"
          },
        } as any).then(() => {
          this.confirmInputBasic.isVisible = false;
          this.getDetail();
        });
      } else {
        this.api.errorMessage('Yêu cầu bổ sung chứng từ không thành công!');
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }

  /**
   * Bổ sung chứng từ
   * @param data 
   */
  public onBoSung(data: { meta: null, content: '', selectedFiles: SelectedFiles[] }) {
    const formData = serialize({
      HoSoId: data?.meta ?? '',
      PhanHoiYeuCauBoSung: data?.content ?? ''
    });
    data?.selectedFiles.forEach(f => {
      formData.append('DinhKems', f.file);
    })
    // POST
    this.api.post('/api/denghi-thanhtoan-daily-create/bo-sung-chung-tu', formData).subscribe(res => {
      if (res?.isSuccess) {
        swal({
          icon: "success",
          title: "Bổ sung chứng từ thành công.",
          buttons: {
            ok: "Đóng"
          },
        } as any).then(() => {
          this.confirmInputFile.isVisible = false;
          this.getDetail();
        });
      } else {
        this.api.errorMessage('Bổ sung chứng từ không thành công!');
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }

  public getNganSach() {
    const date = new Date(this.dataDetail.ngayTao * 1000);
    const chiPhis = this.dataDetail?.chiTietThanhToan?.items?.filter(m => m.maChiPhiKey ?? false);
    if (chiPhis.length) {
      const body = {
        budgetNames: chiPhis?.map(m => m.maChiPhiKey),
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        code: this.dataDetail?.soChungTu
      }
      this.api.post('/api/v1/budgetinformation/getinfo', body).subscribe(res => {
        if (res) {
          this.dataTable.items = res;
          this.cdf.detectChanges();
          this.basicContent.showModal();
        }
      }, err => this.api.errorMessage(err));
    } else {
      this.api.errorMessage('Không tìm thấy mã chi phí!');
    }
  }
}
