import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../../auth';
import { ActivatedRoute, Params } from '@angular/router';
import { ApproveModalComponent } from './approve-modal/approve-modal.component';
import { ConsultationModalComponent } from './consultation-modal/consultation-modal.component';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { Columns, DataTable } from 'src/app/_metronic/shared/shared/models/dataTable';
import { TranslateService } from '@ngx-translate/core';
import { SubmissionsDetail, ThongTinNganSach } from './models/submissions-detail.model';
import { BasicContentModalComponent } from 'src/app/_metronic/shared/shared/components/basic-content-modal/basic-content-modal.component';

@Component({
  selector: 'app-submissions-detail',
  templateUrl: './submissions-detail.component.html',
  styleUrls: ['./submissions-detail.component.scss'],
})
export class SubmissionsDetailComponent implements OnInit {

  @ViewChild('appApproveModal', { static: false }) appApproveModal: ApproveModalComponent;
  @ViewChild('appConsultationModal', { static: false }) appConsultationModal: ConsultationModalComponent;
  @ViewChild('basicContent', { static: false }) basicContent: BasicContentModalComponent;

  public today = new Date();
  public dataDetail: SubmissionsDetail;
  public params: Params;
  public tenNguoiPheDuyet: string;
  public currentHoSoId: number;

  // Table
  public dataTable: DataTable<ThongTinNganSach> = {
    items: [],
    columns: [] as Columns[],
    selected: [],
  };

  constructor(
    public api: ApiService,
    private aRoute: ActivatedRoute,
    private cdf: ChangeDetectorRef,
    private userService: AuthService,
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
        this.currentHoSoId = params?.hoSoId;
        this.getDetail(params?.hoSoId);
      }
    })
  }

  public getDetail(hoSoId: number) {
    this.api.get('/api/totrinh-duyetchi-detail', { hoSoId: hoSoId }).subscribe(res => {
      if (res) {
        this.dataDetail = res;
        this.cdf.detectChanges();
      }
    });
    this.tenNguoiPheDuyet = this.userService.currentUserValue.hoTen;
  }

  public downloadFile(hoSoGiayToId: number, fileName: string) {
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

  // public getUrlFilePdf(hoSoGiayToId: number, fileName: string) {
  //   const header = {
  //     observe: 'response',
  //     responseType: 'blob' as 'json',
  //   };
  //   this.api.get('/api/totrinh-duyetchi-misc/xem-tai-lieu', { hoSoGiayToId: hoSoGiayToId }, header).subscribe(res => {
  //     if (res) {
  //       this.api.downloadFileFromBlob(res);
  //     }
  //   }, err => {
  //     // Message error
  //     this.api.errorMessage(err);
  //   });
  // }

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

  public getNganSach() {
    const date = new Date(this.dataDetail.ngayTao * 1000);
    const chiPhis = this.dataDetail?.chiPhi?.items?.filter(m => m.maChiPhiKey ?? false);
    if (chiPhis.length) {
      const body = {
        budgetNames: chiPhis?.map(m => m.maChiPhiKey),
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        code: this.dataDetail?.maToTrinh
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
