import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/modules/auth';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { PurchaseContactDetail } from '../../models/purchase-contact-detail.model';
import { ApproveContractModalComponent } from './approve-contract-modal/approve-contract-modal.component';
import { ConsultationContractModalComponent } from './consultation-contract-modal/consultation-contract-modal.component';
import { ContractFullTableModalComponent } from './contract-full-table-modal/contract-full-table-modal.component';

@Component({
  selector: 'app-detail-contract',
  templateUrl: './detail-contract.component.html',
  styleUrls: ['./detail-contract.component.scss']
})
export class DetailContractComponent implements OnInit {

  @ViewChild('appApproveModal', {static: false}) appApproveModal: ApproveContractModalComponent;
  @ViewChild('contractFullTable', {static: false}) contractFullTable: ContractFullTableModalComponent;
  @ViewChild('appConsultationModal', {static: false}) appConsultationModal: ConsultationContractModalComponent;

  public today = new Date();
  public dataDetail: PurchaseContactDetail;
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
      idDeNghi: this.params?.id
    };
    this.api.get('/api/purchase-contract-detail', query).subscribe(res => {
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
    return this.dataDetail?.lichSuPheDuyet?.items?.map(m => ({
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
