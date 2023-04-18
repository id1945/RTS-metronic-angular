import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/modules/auth';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { ApproveRegisterVehicleModalComponent } from './approve-registervehicle-modal/approve-registervehicle-modal.component';

@Component({
  selector: 'app-detail-registervehicle',
  templateUrl: './detail-registervehicle.component.html',
  styleUrls: ['./detail-registervehicle.component.scss']
})
export class DetailRegisterVehicleComponent implements OnInit {

  @ViewChild('approveRegisterVehicle') approveRegisterVehicle: ApproveRegisterVehicleModalComponent;

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
      hoSoId: this.params?.hoSoId
    };
    this.api.get('/api/xeduadon-detail', query).subscribe(res => {
      if (res) {
        this.dataDetail = res;
        this.today = res.ngayTao;
        this.cdf.detectChanges();
      }
    })
    this.tenNguoiPheDuyet = this.userService.currentUserValue.hoTen;
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
}
