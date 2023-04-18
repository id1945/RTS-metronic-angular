import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { ApproveExpressDeliveryModalComponent } from './approve-express-delivery-modal/approve-express-delivery-modal.component';

@Component({
  selector: 'app-detail-express-delivery-modal',
  templateUrl: './detail-express-delivery-modal.component.html',
  styleUrls: ['./detail-express-delivery-modal.component.scss']
})
export class DetailExpressDeliveryModalComponent implements OnInit {

  @ViewChild('approveExpressDelivery') approveExpressDelivery: ApproveExpressDeliveryModalComponent;
  @Output() loadList = new EventEmitter();

  public isVisible = false;
  public dataDetail: any;
  public item: any;

  constructor(
    private api: ApiService,
  ) { }

  ngOnInit(): void {
  }

  public async showModal(item) {
    this.isVisible = true;
    this.item = item;
    this.loadDetail();
  }

  public async loadDetail() {
    const detail = await this.api.get('/api/dangky-chuyephatnhanh-detail', { hoSoId: this.item?.hoSoId }).toPromise();
    this.dataDetail = { ...detail, ...this.item };
    this.loadList.emit();
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
