import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ApproveStationeryModalComponent } from './approve-stationery-modal/approve-stationery-modal.component';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';

@Component({
  selector: 'app-detail-stationery',
  templateUrl: './detail-stationery.component.html',
  styleUrls: ['./detail-stationery.component.scss']
})
export class DetailStationeryComponent implements OnInit {

  public params: Params;
  public dataDetail: any;

  @ViewChild('approveStationery') approveStationery: ApproveStationeryModalComponent;

  constructor(
    private api: ApiService,
    private aRoute: ActivatedRoute
  ) {
    this.aRoute.params.subscribe(params => {
      if (params) {
        this.params = params;
        this.getDetail()
      }
    })
  }

  ngOnInit(): void {
  }

  public getDetail() {
    this.api.get('/api/hoso-vanphongpham-detail', { hoSoId: this.params.hoSoId }).subscribe(res => {
      if (res) {
        this.dataDetail = res;
      }
    });
  }

  get soLuongTotal() {
    return this.dataDetail?.danhSachHang?.items?.reduce(function (total, currentValue) { return Number(total) + Number(currentValue?.soLuong) }, 0) || 0;
  }

  get thanhTienTotal() {
    return this.dataDetail?.danhSachHang?.items?.reduce(function (total, currentValue) { return Number(total) + Number(currentValue?.thanhTien) }, 0) || 0;
  }

  get timeLine() {
    return this.dataDetail?.lichSuPheDuyet?.items?.map(m => ({
      ghiChu: m?.ghiChu,
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
