import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/modules/auth';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { ApproveSupplierModalComponent } from './approve-supplier-modal/approve-supplier-modal.component';
import { ConsultationSupplierModalComponent } from './consultation-supplier-modal/consultation-supplier-modal.component';

@Component({
  selector: 'app-detail-supplier-selection',
  templateUrl: './detail-supplier-selection.component.html',
  styleUrls: ['./detail-supplier-selection.component.scss']
})
export class DetailSupplierSelectionComponent implements OnInit {

  @ViewChild('appApproveModal', {static: false}) appApproveModal: ApproveSupplierModalComponent;
  @ViewChild('appConsultationModal', {static: false}) appConsultationModal: ConsultationSupplierModalComponent;

  public today = new Date();
  public dataDetail: any;
  public tenNguoiPheDuyet: string;
  public params: any;

  constructor(
    public api: ApiService,
    private userService: AuthService,
    private aRoute: ActivatedRoute,
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
    const query = {
      IdDeXuat: this.params?.id
    };
    this.api.get('/api/purchase-requisition-detail', query).subscribe(res => {
      if (res) {
        this.dataDetail = res;
        this.today = res.ngayTao;
        this.cdf.detectChanges();
      }
    }, err => this.api.errorMessage(err));
    this.tenNguoiPheDuyet = this.userService.currentUserValue.hoTen;
  }

  get timeLine() {
    return this.dataDetail?.lichSuPheDuyet?.items.map(m => ({
      ghiChu: m?.ghiChu,
      tinhTrang: m?.tenTrangThai,
      ngayDuyetNum: m?.ngayDuyet,
      nguoiDuyet: m?.nguoiDuyet,
      tenTrangThai: m?.tenTrangThai,
      tinhTrangKey: m?.tinhTrangKey,
      tenBuocThucHien: m?.tenTrangThai,
    }))
  }

}
