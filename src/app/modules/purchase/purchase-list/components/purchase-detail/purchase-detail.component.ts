import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/modules/auth';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { ApproveModalComponent } from './approve-modal/approve-modal.component';
import { ConsultationModalComponent } from './consultation-modal/consultation-modal.component';
import { TableFullModalComponent } from './table-full-modal/table-full-modal.component';
import swal from 'sweetalert';
import { Columns, DataTable } from 'src/app/_metronic/shared/shared/models/dataTable';
import { TranslateService } from '@ngx-translate/core';
import { PurchaseDetail, ThongTinNganSach } from '../models/purchase-detail.model';
import { BasicContentModalComponent } from 'src/app/_metronic/shared/shared/components/basic-content-modal/basic-content-modal.component';

@Component({
  selector: 'app-purchase-detail',
  templateUrl: './purchase-detail.component.html',
  styleUrls: ['./purchase-detail.component.scss']
})
export class PurchaseDetailComponent implements OnInit {

  @ViewChild('appApproveModal', { static: false }) appApproveModal: ApproveModalComponent;
  @ViewChild('appConsultationModal', { static: false }) appConsultationModal: ConsultationModalComponent;
  @ViewChild('tableFullModal', { static: false }) tableFullModal: TableFullModalComponent;
  @ViewChild('basicContent', { static: false }) basicContent: BasicContentModalComponent;

  public today = new Date();
  public dataDetail: PurchaseDetail;
  public tenNguoiPheDuyet: string;
  public params: any;

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
        this.getDetail()
      }
    })
  }

  public backToDraff() {
    const Action = "Back_To_Draft";

    const formData = new FormData();
    formData.append("IdYCMH", this.dataDetail?.id?.toString());
    formData.append("MaYCMH", this.dataDetail?.maYCMH);
    formData.append("Action", Action);

    // POST
    this.api.post('/api/purchase-product-update/approve', formData).subscribe(res => {
      if (res) {
        swal({
          icon: "success",
          title: "Bạn đã chuyển trạng thái về Nháp thành công!",
          buttons: {
            ok: "Đóng"
          },
        } as any).then(() => {
          this.getDetail()
        });
      } else {
        this.api.errorMessage(null)
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }

  public getDetail() {
    const query = {
      maYCMH: this.params?.maThamChieu,
      idYCMH: this.params?.id
    };
    this.api.get('/api/purchase-product-detail', query).subscribe(res => {
      if (res) {
        this.dataDetail = res;
        this.today = res.ngayTao;
        this.cdf.detectChanges();
      }
    })
    this.tenNguoiPheDuyet = this.userService.currentUserValue.hoTen;
  }

  public trackByFn(index: number, item: any) {
    return index;
  }

  get timeLine() {
    return this.dataDetail?.lichSuPheDuyets?.map(m => ({
      ghiChu: m?.ghiChu,
      tinhTrang: m?.tenTrangThai,
      ngayDuyetNum: m?.ngayDuyet,
      nguoiDuyet: m?.nguoiDuyet,
      tenTrangThai: m?.tenTrangThai,
      tinhTrangKey: m?.tinhTrangKey,
      tenBuocThucHien: m?.tenTrangThai,
    }))
  }

  public nccDeXuat(item) {
    if (item?.isChiDinhNCC) {
      return item?.nccDeXuat?.map(m => ('Chỉ định ' + m))?.join(',');
    } else {
      return item?.nccDeXuat?.join(',');
    }
  }

  public getNganSach() {
    const date = new Date(this.dataDetail.ngayTao * 1000);
    const chiPhis = this.dataDetail?.thongTinHangHoaDichVus?.filter(m => m.maNganSach ?? false);
    if (chiPhis.length) {
      const body = {
        budgetNames: chiPhis?.map(m => m.maNganSach),
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        code: this.dataDetail?.maYCMH
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
